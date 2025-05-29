"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, Target, CheckSquare, Link, FileText } from "lucide-react"
import { detectNoteType, getTypeIcon } from "@/lib/note-utils"

interface QuickInputProps {
  onNoteSaved: () => void
}

export function QuickInput({ onNoteSaved }: QuickInputProps) {
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [detectedType, setDetectedType] = useState<"url" | "todo" | "note">("note")
  const [showSuccess, setShowSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus on mount
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Detect type as user types
    if (content.trim()) {
      setDetectedType(detectNoteType(content))
    }
  }, [content])

  const handleSave = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          category: category.trim() || undefined,
        }),
      })

      if (response.ok) {
        setContent("")
        setCategory("")
        setDetectedType("note")
        setShowSuccess(true)
        onNoteSaved()

        // Hide success message after animation
        setTimeout(() => setShowSuccess(false), 2000)

        // Re-focus for next note
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Tab" && content.trim()) {
      e.preventDefault()
      if (categoryRef.current) {
        categoryRef.current.focus()
      }
    }
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
  }

  const insertTodoTemplate = () => {
    const todoTemplate = `[ ] First task
[ ] Second task
[ ] Third task`
    setContent(todoTemplate)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="relative">
      {/* Success Animation */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-50 animate-in zoom-in-50 duration-500">
          <div className="bg-green-500 text-white rounded-full p-4 shadow-lg">
            <Plus className="h-8 w-8" />
          </div>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <div className="text-center space-y-2 md:space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2 md:mb-4">
            <Target className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">Capture Mode</h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg">
            Drop your thoughts here. We'll organize them later!
          </p>
        </div>

        {/* Quick Templates */}
        <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={insertTodoTemplate}
            className="h-7 md:h-8 gap-1 text-xs md:text-sm"
          >
            <CheckSquare className="h-3 w-3" />
            Todo List
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContent("https://")
              if (textareaRef.current) {
                textareaRef.current.focus()
                textareaRef.current.setSelectionRange(8, 8)
              }
            }}
            className="h-7 md:h-8 gap-1 text-xs md:text-sm"
          >
            <Link className="h-3 w-3" />
            URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContent("")
              if (textareaRef.current) {
                textareaRef.current.focus()
              }
            }}
            className="h-7 md:h-8 gap-1 text-xs md:text-sm"
          >
            <FileText className="h-3 w-3" />
            Note
          </Button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="relative group">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste anything... URLs, tasks, brilliant ideas, random thoughts..."
              className="min-h-[120px] md:min-h-[140px] text-sm md:text-base font-mono resize-none bg-muted/30 border-2 border-muted transition-colors duration-200 focus:border-primary focus:bg-background focus:ring-0 focus:ring-offset-0"
              disabled={isLoading}
            />
            {content.trim() && (
              <Badge
                variant="secondary"
                className="absolute top-2 md:top-4 right-2 md:right-4 animate-in slide-in-from-right-2 duration-300 text-xs"
              >
                {getTypeIcon(detectedType)} {detectedType}
              </Badge>
            )}

            {/* Character count */}
            {content.length > 0 && (
              <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 text-xs text-muted-foreground font-mono">
                {content.length} chars
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Input
              ref={categoryRef}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              placeholder="Tag it (optional)"
              className="flex-1 border-2 border-muted transition-colors duration-200 focus:border-primary focus:ring-0 focus:ring-offset-0"
              disabled={isLoading}
            />
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isLoading}
              size="default"
              className="px-4 sm:px-8 transition-all duration-200 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Capture
                </>
              )}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="hidden md:flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Enter</kbd>
                <span>to save</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                <span>to tag</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                <span>view all</span>
              </div>
            </div>
            <div className="md:hidden text-xs text-muted-foreground">Swipe right to view all notes</div>
          </div>
        </div>

        {/* Todo Help */}
        <Card className="bg-muted/30">
          <CardContent className="p-3 md:p-4">
            <h4 className="font-medium mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
              <CheckSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Creating Todo Lists
            </h4>
            <div className="text-xs md:text-sm text-muted-foreground space-y-0.5 md:space-y-1">
              <p>
                • Use <code className="bg-background px-1 rounded">[ ]</code> for unchecked items
              </p>
              <p>
                • Use <code className="bg-background px-1 rounded">[x]</code> for completed items
              </p>
              <p>
                • Start lines with <code className="bg-background px-1 rounded">-</code>,{" "}
                <code className="bg-background px-1 rounded">*</code>, or numbers
              </p>
              <p>• Or click the "Todo List" button above for a template</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
