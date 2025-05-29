"use client"

import { useState } from "react"
import type { Note } from "@/types/note"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ExternalLink, Copy, Check, Eye } from "lucide-react"
import { getTypeIcon, getTypeColor, truncateText } from "@/lib/note-utils"

interface NoteItemProps {
  note: Note
  onDelete: (id: string) => void
  onView: (note: Note) => void
}

export function NoteItem({ note, onDelete, onView }: NoteItemProps) {
  const [copied, setCopied] = useState(false)

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
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const { text: truncatedContent, isTruncated } = truncateText(note.content, 150)

  const renderTruncatedContent = () => {
    if (note.type === "todo") {
      const lines = truncatedContent.split("\n").slice(0, 3) // Show max 3 lines for todos
      return (
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              {line.trim().startsWith("[ ]") || line.trim().startsWith("[x]") ? (
                <>
                  <div className="mt-0.5">{line.trim().startsWith("[x]") ? "✅" : "☐"}</div>
                  <span className={line.trim().startsWith("[x]") ? "line-through text-muted-foreground" : ""}>
                    {line.replace(/^\[ ?\]|^\[x\]/, "").trim()}
                  </span>
                </>
              ) : (
                <span className="font-mono text-xs">{line}</span>
              )}
            </div>
          ))}
          {(note.content.split("\n").length > 3 || isTruncated) && (
            <div className="text-xs text-muted-foreground">...</div>
          )}
        </div>
      )
    }

    if (note.type === "url") {
      return (
        <button
          onClick={handleOpenUrl}
          className="text-blue-600 hover:text-blue-800 hover:underline text-left text-sm break-all"
        >
          {truncatedContent}
        </button>
      )
    }

    return <span className="text-sm leading-relaxed break-words font-mono">{truncatedContent}</span>
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={getTypeColor(note.type)}>
                {getTypeIcon(note.type)} {note.type}
              </Badge>
              {note.category && note.category !== "Unsorted" && <Badge variant="outline">{note.category}</Badge>}
              <span className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</span>
            </div>

            <div className="cursor-pointer" onClick={() => onView(note)}>
              {renderTruncatedContent()}
              {isTruncated && (
                <div className="text-xs text-blue-600 hover:text-blue-800 mt-1">Click to view full content</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onView(note)} className="h-8 w-8 p-0">
              <Eye className="h-3 w-3" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
              {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </Button>

            {note.type === "url" && (
              <Button variant="ghost" size="sm" onClick={handleOpenUrl} className="h-8 w-8 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
