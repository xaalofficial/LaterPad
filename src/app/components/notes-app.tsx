"use client";

import { useEffect, useState } from "react";
import { NotesList } from "./notes-list";

type Note = {
	note: string;
	category: string;
	timestamp: number;
};

export function NotesApp() {
	const [notes, setNotes] = useState<Note[]>([]);

	// Fetch notes from the backend
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
		<div className="space-y-6">
			<NotesList notes={notes} />
		</div>
	);
}
