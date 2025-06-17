import axios from "axios";
import type { Note, CreateNoteData } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params,
  });
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};

export async function fetchNoteById(id: number): Promise<Note> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }
  return res.json();
}
