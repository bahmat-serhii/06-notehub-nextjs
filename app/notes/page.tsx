import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const initialPage = 1;
  const initialSearch = "";

  const initialData = await fetchNotes({
    page: initialPage,
    search: initialSearch,
  });

  // Prefetch в кеш
  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: initialPage, search: initialSearch }],
    queryFn: () => Promise.resolve(initialData),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes
        initialPage={initialPage}
        initialSearch={initialSearch}
        initialData={initialData}
      />
    </HydrationBoundary>
  );
}
