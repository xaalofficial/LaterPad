"use client"

import { useState } from "react"
import type { Note } from "@/types/note"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Check, X } from "lucide-react"
import { getTypeIcon, getTypeColor } from "@/lib/note-utils"

interface NoteModalProps {
  note: Note | null
  isOpen: boolean
  onClose: () => void
}

export function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const [copied, setCopied] = useState(false)

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const renderContent = () => {
    if (note.type === "todo") {
      return (
        <div className="space-y-2">
          {note.content.split("\n").map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              {line.trim().startsWith("[ ]") || line.trim().startsWith("[x]") ? (
                <>
                  <div className="mt-1">{line.trim().startsWith("[x]") ? "✅" : "☐"}</div>
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
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Badge variant="secondary" className={getTypeColor(note.type)}>
                {getTypeIcon(note.type)} {note.type}
              </Badge>
              {note.category && note.category !== "Unsorted" && <Badge variant="outline">{note.category}</Badge>}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 border">{renderContent()}</div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && <span className="ml-4">Updated: {formatDate(note.updatedAt)}</span>}
            </div>
            <div className="flex gap-2">
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
