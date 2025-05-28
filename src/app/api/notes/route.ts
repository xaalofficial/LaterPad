import { NextResponse } from "next/server";
import { cleanNoteData, isValidNote } from "../../lib/notesUtils";

let notes: { note: string; category: string; timestamp: number }[] = [];
// Save notes
export async function POST(request: Request) {
	const { note, category } = await request.json();

	const { trimmedNote, trimmedCategory } = cleanNoteData(note, category);

	if (!isValidNote(trimmedNote)) {
		return NextResponse.json({ error: "Note is empty" }, { status: 400 });
	}

	const saved = {
		note: trimmedNote,
		category: trimmedCategory,
		timestamp: Date.now(),
	};

	notes.unshift(saved);

	return NextResponse.json({ success: true, saved });
}

// Shows notes
export async function GET(){
	return NextResponse.json(notes);
}