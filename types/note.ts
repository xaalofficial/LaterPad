export interface Note {
  id: string
  content: string
  type: "url" | "todo" | "note"
  category?: string
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  content: string
  category?: string
}
