import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cleanNoteData, isValidNote } from "../../lib/notesUtils";

let notes: { note: string; category: string; timestamp: number }[] = [];
// Save notes
export async function POST(request: Request) {
	const { note, category } = await request.json();

	const { trimmedNote, trimmedCategory } = cleanNoteData(note, category);

	if (!isValidNote(trimmedNote)) {
		return NextResponse.json({ error: "Note is empty" }, { status: 400 });
	}

	const saved = await prisma.note.create({
		data: {
			note: trimmedNote,
			category: trimmedCategory,
			timestamp: Date.now(),
		},
	})

	return NextResponse.json({ success: true, saved });
}

// Shows notes
export async function GET(){
	const notes = await prisma.note.findMany({
		orderBy: {
			timestamp: "desc",
		},
	})
	return NextResponse.json(notes);
}