// app/notes/page.tsx

import type { Metadata } from "next";

import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

export const metadata: Metadata = {
  title: "Notes page",
};

const Notes = async () => {
  const response = await getNotes();

  return (
    <section>
      <h1>Notes List</h1>
      {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
    </section>
  );
};

export default Notes;
