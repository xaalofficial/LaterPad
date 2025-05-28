export function cleanNoteData(note: string, category?: string) {
  const trimmedNote = note.trim();
  const trimmedCategory = category?.trim() || "Unsorted";

  return { trimmedNote, trimmedCategory };
}

export function isValidNote(note: string) {
  return note.length > 0;
}
