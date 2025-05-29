"use client"

import { useState, useEffect } from "react"
import type { Note } from "@/types/note"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink, Check, Edit, Save, X } from "lucide-react"
import { getTypeIcon, getTypeColor } from "@/lib/note-utils"

interface NoteModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export function NoteModal({ note, isOpen, onClose, onUpdate }: NoteModalProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)

  // Update local state when note prop changes
  useEffect(() => {
    if (note) {
      setCurrentNote(note)
    }
  }, [note])

  if (!currentNote) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentNote.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleOpenUrl = () => {
    if (currentNote.type === "url") {
      let url = currentNote.content
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`
      }
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleEdit = () => {
    setEditContent(currentNote.content)
    setEditCategory(currentNote.category || "")
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/notes/${currentNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
          category: editCategory || "Unsorted",
        }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setCurrentNote(updatedNote)
        setIsEditing(false)
        onUpdate?.()
      }
    } catch (error) {
      console.error("Failed to update note:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent("")
    setEditCategory("")
  }

  const handleTodoToggle = async (lineIndex: number) => {
    const lines = currentNote.content.split("\n")
    const line = lines[lineIndex]

    if (line.includes("[ ]")) {
      lines[lineIndex] = line.replace("[ ]", "[x]")
    } else if (line.includes("[x]")) {
      lines[lineIndex] = line.replace("[x]", "[ ]")
    }

    const newContent = lines.join("\n")

    // Update local state immediately for real-time feedback
    const updatedNote = { ...currentNote, content: newContent }
    setCurrentNote(updatedNote)

    try {
      const response = await fetch(`/api/notes/${currentNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
        }),
      })

      if (response.ok) {
        const savedNote = await response.json()
        setCurrentNote(savedNote)
        onUpdate?.()
      } else {
        // Revert on error
        setCurrentNote(currentNote)
      }
    } catch (error) {
      console.error("Failed to update todo:", error)
      // Revert on error
      setCurrentNote(currentNote)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-3 md:space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[150px] md:min-h-[200px] text-xs md:text-sm font-mono"
            placeholder="Edit your note..."
          />
          <Input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="Category (optional)"
            className="text-xs md:text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} size="sm" className="text-xs md:text-sm">
              {isSaving ? <Check className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </Button>
            <Button onClick={handleCancelEdit} variant="outline" size="sm" className="text-xs md:text-sm">
              <X className="h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    if (currentNote.type === "todo") {
      return (
        <div className="space-y-2">
          {currentNote.content.split("\n").map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              {line.trim().startsWith("[ ]") || line.trim().startsWith("[x]") ? (
                <>
                  <button onClick={() => handleTodoToggle(index)} className="mt-1 hover:scale-110 transition-transform">
                    {line.trim().startsWith("[x]") ? "✅" : "☐"}
                  </button>
                  <span className={line.trim().startsWith("[x]") ? "line-through text-muted-foreground" : ""}>
                    {line.replace(/^\[ ?\]|^\[x\]/, "").trim()}
                  </span>
                </>
              ) : (
                <span className="font-mono text-sm">{line}</span>
              )}
            </div>
          ))}
        </div>
      )
    }

    if (currentNote.type === "url") {
      return (
        <button
          onClick={handleOpenUrl}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left break-all"
        >
          {currentNote.content}
        </button>
      )
    }

    return (
      <div className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{currentNote.content}</div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[80vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="secondary" className={getTypeColor(currentNote.type)}>
              {getTypeIcon(currentNote.type)} {currentNote.type}
            </Badge>
            {currentNote.category && currentNote.category !== "Unsorted" && (
              <Badge variant="outline">{currentNote.category}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4">
          <div className="bg-muted/30 rounded-lg p-3 md:p-4 border">{renderContent()}</div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 text-xs md:text-sm text-muted-foreground">
            <div className="space-y-1 md:space-y-0">
              <div>Created: {formatDate(currentNote.createdAt)}</div>
              {currentNote.updatedAt !== currentNote.createdAt && (
                <div className="md:ml-4 md:inline">Updated: {formatDate(currentNote.updatedAt)}</div>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit} className="text-xs md:text-sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs md:text-sm">
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              {currentNote.type === "url" && (
                <Button variant="outline" size="sm" onClick={handleOpenUrl} className="text-xs md:text-sm">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
