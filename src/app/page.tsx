"use client";

import { useEffect, useState } from "react";
import { QuickInput } from "./components/quick-input";
import { NotesList } from "./components/notes-list";

type Note = {
  note: string;
  category: string;
  timestamp: number;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    }

    fetchNotes();
  }, []);

  function handleNoteSaved(newNote: Note) {
    setNotes((prev) => [newNote, ...prev]);
  }

  return (
    <>
      <QuickInput onNoteSavedAction={handleNoteSaved} />
      <div className="space-y-6">
        <NotesList notes={notes} />
      </div>
    </>
  );
}
