"use client"

import { useState } from "react"
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

  if (!note) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleOpenUrl = () => {
    if (note.type === "url") {
      let url = note.content
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`
      }
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleEdit = () => {
    setEditContent(note.content)
    setEditCategory(note.category || "")
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
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
    const lines = note.content.split("\n")
    const line = lines[lineIndex]

    if (line.includes("[ ]")) {
      lines[lineIndex] = line.replace("[ ]", "[x]")
    } else if (line.includes("[x]")) {
      lines[lineIndex] = line.replace("[x]", "[ ]")
    }

    const newContent = lines.join("\n")

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
        }),
      })

      if (response.ok) {
        onUpdate?.()
      }
    } catch (error) {
      console.error("Failed to update todo:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[200px] font-mono"
            placeholder="Edit your note..."
          />
          <Input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="Category (optional)"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Check className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </Button>
            <Button onClick={handleCancelEdit} variant="outline" size="sm">
              <X className="h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    if (note.type === "todo") {
      return (
        <div className="space-y-2">
          {note.content.split("\n").map((line, index) => (
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

    if (note.type === "url") {
      return (
        <button
          onClick={handleOpenUrl}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left break-all"
        >
          {note.content}
        </button>
      )
    }

    return <div className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">{note.content}</div>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="secondary" className={getTypeColor(note.type)}>
              {getTypeIcon(note.type)} {note.type}
            </Badge>
            {note.category && note.category !== "Unsorted" && <Badge variant="outline">{note.category}</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 border">{renderContent()}</div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && <span className="ml-4">Updated: {formatDate(note.updatedAt)}</span>}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              {note.type === "url" && (
                <Button variant="outline" size="sm" onClick={handleOpenUrl}>
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
