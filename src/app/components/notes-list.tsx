import { NoteItem } from "./note-item";

type Note = {
  note: string;
  category: string;
  timestamp: number;
};

export function NotesList({ notes }: { notes: Note[] }) {
  return (
    <div className="space-y-3">
      {notes.map((note, index) => (
        <NoteItem key={index} note={note} />
      ))}
    </div>
  );
}
