"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./NotesPage.module.css";
import SearchBox from "../../components/SearchBox/SearchBox";
import NoteList from "../../components/NoteList/NoteList";
import NoteModal from "../../components/NoteModal/NoteModal";
import Pagination from "../../components/Pagination/Pagination";

import { fetchNotes } from "../../lib/api";
import type { Note } from "../../types/note";
import ErrorMessage from "./error";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesProps {
  initialPage: number;
  initialSearch: string;
  initialData: NotesResponse;
}

const Notes: React.FC<NotesProps> = ({
  initialPage,
  initialSearch,
  initialData,
}) => {
  const [searchInput, setSearchInput] = useState<string>(initialSearch);

  const [page, setPage] = useState<number>(initialPage);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // debounce значення для пошуку
  const [debouncedSearch] = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    placeholderData: keepPreviousData,
    initialData:
      page === initialPage && debouncedSearch === initialSearch
        ? initialData
        : undefined,
    refetchOnMount: false,
  });

  const handleSearch = useCallback((searchText: string) => {
    setSearchInput(searchText);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={handleSearch}
          onSearch={() => {}}
        />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create Note +
        </button>
      </header>

      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && error && <ErrorMessage error={error} />}

      {data && <NoteList notes={data.notes} />}

      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
};

export default Notes;
