type Note = {
  note: string;
  category: string;
  timestamp: number;
};

export function NoteItem({ note }: { note: Note }) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div>{note.note}</div>
      <div className="text-sm text-gray-500">{note.category}</div>
    </div>
  );
}
