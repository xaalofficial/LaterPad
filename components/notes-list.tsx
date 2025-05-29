"use client"

import { useState, useEffect, useRef } from "react"
import type { Note } from "@/types/note"
import { NoteItem } from "./note-item"
import { NoteModal } from "./note-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Loader2, Archive } from "lucide-react"

interface NotesListProps {
  refreshTrigger: number
  onNotesCountChange?: (count: number) => void
}

export function NotesList({ refreshTrigger, onNotesCountChange }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (categoryFilter !== "all") params.append("category", categoryFilter)

      const response = await fetch(`/api/notes?${params}`)
      if (response.ok) {
        const fetchedNotes = await response.json()
        setNotes(fetchedNotes)

        // Update parent with total count (unfiltered)
        if (onNotesCountChange) {
          const totalResponse = await fetch("/api/notes")
          if (totalResponse.ok) {
            const allNotes = await totalResponse.json()
            onNotesCountChange(allNotes.length)
          }
        }

        // Extract unique categories (excluding "Unsorted")
        const uniqueCategories = Array.from(
          new Set(
            fetchedNotes.map((note: Note) => note.category).filter((category) => category && category !== "Unsorted"),
          ),
        ) as string[]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [refreshTrigger, search, typeFilter, categoryFilter])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        const updatedNotes = notes.filter((note) => note.id !== id)
        setNotes(updatedNotes)

        // Update parent count
        if (onNotesCountChange) {
          const totalResponse = await fetch("/api/notes")
          if (totalResponse.ok) {
            const allNotes = await totalResponse.json()
            onNotesCountChange(allNotes.length)
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  const handleViewNote = (note: Note) => {
    setSelectedNote(note)
    setIsModalOpen(true)
  }

  const handleUpdateNote = () => {
    fetchNotes() // Refresh the notes list
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNote(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        if (searchRef.current) {
          searchRef.current.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const typeOptions = [
    { value: "all", label: "All Types", count: notes.length, icon: "📚" },
    { value: "note", label: "Notes", count: notes.filter((n) => n.type === "note").length, icon: "📝" },
    { value: "url", label: "URLs", count: notes.filter((n) => n.type === "url").length, icon: "🔗" },
    { value: "todo", label: "Todos", count: notes.filter((n) => n.type === "todo").length, icon: "✓" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Archive className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Your Collection</h2>
        </div>
        <p className="text-muted-foreground text-lg">Find, filter, and manage all your captured thoughts</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your notes... (Ctrl+F)"
            className="pl-10 border-2 border-muted transition-colors duration-200 focus:border-primary focus:ring-0 focus:ring-offset-0"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Filter:</span>
          </div>
          {typeOptions.map((option) => (
            <Button
              key={option.value}
              variant={typeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(option.value)}
              className="h-9 transition-all duration-200"
            >
              <span className="mr-1">{option.icon}</span>
              {option.label} ({option.count})
            </Button>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground font-medium mr-2">Categories:</span>
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="h-8 transition-all duration-200"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="h-8 transition-all duration-200"
              >
                🏷️ {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <span className="text-muted-foreground">Loading your notes...</span>
          </div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          {search || typeFilter !== "all" || categoryFilter !== "all" ? (
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <div>
                <p className="text-lg font-medium">No notes match your filters</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setTypeFilter("all")
                  setCategoryFilter("all")
                }}
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📝</div>
              <div>
                <p className="text-lg font-medium">Your collection is empty</p>
                <p className="text-muted-foreground">Start capturing your thoughts in the Quick Add tab!</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Press</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                <span>to start adding notes</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {notes.length} {notes.length === 1 ? "note" : "notes"} found
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+F</kbd> to search
            </div>
          </div>

          <div className="grid gap-3">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NoteItem note={note} onDelete={handleDelete} onView={handleViewNote} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note Modal */}
      <NoteModal note={selectedNote} isOpen={isModalOpen} onClose={handleCloseModal} onUpdate={handleUpdateNote} />
    </div>
  )
}
