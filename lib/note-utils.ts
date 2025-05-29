export function detectNoteType(content: string): "url" | "todo" | "note" {
  // URL detection
  const urlRegex = /(https?:\/\/[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/
  if (urlRegex.test(content)) {
    return "url"
  }

  // Enhanced todo detection
  const todoPatterns = [
    /^(todo|task):/i,
    /^\[ ?\]/,
    /^- \[ ?\]/,
    /^(do|complete|finish|remember to)/i,
    /^[\d]+\.\s/, // Numbered lists
    /^-\s/, // Dash lists
    /^\*\s/, // Asterisk lists
    /^•\s/, // Bullet lists
  ]

  if (todoPatterns.some((pattern) => pattern.test(content.trim()))) {
    return "todo"
  }

  return "note"
}

export function formatNoteContent(content: string, type: "url" | "todo" | "note"): string {
  if (type === "todo") {
    const lines = content.split("\n")
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return line

      // If it already has checkbox syntax, keep it
      if (/^\[ ?\]/.test(trimmed) || /^\[x\]/.test(trimmed)) {
        return line
      }

      // If it starts with a number, dash, asterisk, or bullet, convert to checkbox
      if (/^[\d]+\.\s/.test(trimmed) || /^[-*•]\s/.test(trimmed)) {
        return line.replace(/^([\d]+\.\s|[-*•]\s)/, "[ ] ")
      }

      // If it starts with todo/task keywords, convert
      if (/^(todo|task):\s*/i.test(trimmed)) {
        return line.replace(/^(todo|task):\s*/i, "[ ] ")
      }

      // If it's a plain line in a todo note, add checkbox
      if (trimmed.length > 0) {
        return `[ ] ${trimmed}`
      }

      return line
    })

    return formattedLines.join("\n")
  }
  return content
}

export function getTypeIcon(type: "url" | "todo" | "note"): string {
  switch (type) {
    case "url":
      return "🔗"
    case "todo":
      return "✓"
    case "note":
      return "📝"
    default:
      return "📝"
  }
}

export function getTypeColor(type: "url" | "todo" | "note"): string {
  switch (type) {
    case "url":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "todo":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "note":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

export function truncateText(text: string, maxLength = 150): { text: string; isTruncated: boolean } {
  if (text.length <= maxLength) {
    return { text, isTruncated: false }
  }

  return {
    text: text.substring(0, maxLength) + "...",
    isTruncated: true,
  }
}
