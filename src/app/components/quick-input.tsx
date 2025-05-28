"use client";
import { useEffect, useState, useRef } from "react";
import { cleanNoteData, isValidNote } from "../lib/notesUtils";

export function QuickInput() {
	const [note, setNote] = useState("");
	const [category, setCategory] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	async function handleSave() {
		const { trimmedNote, trimmedCategory } = cleanNoteData(note, category);

		if (!isValidNote(trimmedNote)) return;

		try {
			const response = await fetch("/api/notes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					note: trimmedNote,
					category: trimmedCategory,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to save");
			}

			console.log("Saved successfully:", data.saved);

			setNote("");
			setCategory("");
			textareaRef.current?.focus();
		} catch (error) {
			console.error("Error saving note:", error);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSave();
		}
	}

	function handleCategoryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSave();
		}
	}

	return (
		<div className="w-full max-w-4xl mx-auto p-6 space-y-4">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Paste Now, Don't Worry Later
				</h1>
				<p className="text-muted-foreground">
					Capture anything instantly. Organize later. Press Ctrl+Enter
					to save.
				</p>
			</div>

			<div className="">
				<textarea
					aria-label="Note input"
					ref={textareaRef}
					value={note}
					onChange={(e) => setNote(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Paste or type anything here... URLs, tasks, ideas, notes..."
					className="w-full text-2xl placeholder-opacity-10 p-5 h-56 border-5 rounded-lg min-h-3 border-gray-700 resize-none"
				/>

				<div className="flex justify-between gap-3 mt-2">
					<input
						aria-label="Category input"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						onKeyDown={handleCategoryKeyDown}
						placeholder="Category (optional)"
						className="flex p-3 px-4 bg-gray-100 border-2 rounded-lg"
					/>
					<button
						disabled={!note.trim()}
						onClick={handleSave}
						className="
						p-3 px-6 border-2 rounded-lg transition-colors
						bg-gray-900 text-white hover:bg-gray-300 cursor-pointer
						disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50
						"
					>
						+ Save Note
					</button>
				</div>
			</div>
		</div>
	);
}
