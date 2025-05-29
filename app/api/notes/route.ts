import { type NextRequest, NextResponse } from "next/server"
import type { CreateNoteRequest } from "@/types/note"
import { detectNoteType, formatNoteContent } from "@/lib/note-utils"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/notes - Starting request")

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const type = searchParams.get("type")
    const category = searchParams.get("category")

    console.log("Search params:", { search, type, category })

    const whereClause: any = {}

    // Apply search filter
    if (search) {
      whereClause.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ]
    }

    // Apply type filter
    if (type && type !== "all") {
      whereClause.type = type
    }

    // Apply category filter
    if (category && category !== "all") {
      whereClause.category = category
    }

    console.log("Where clause:", whereClause)

    const notes = await prisma.note.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    console.log("Found notes:", notes.length)
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Database error in GET /api/notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/notes - Starting request")

    const body: CreateNoteRequest = await request.json()
    console.log("Request body:", body)

    if (!body.content || body.content.trim() === "") {
      console.log("Invalid content provided")
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const type = detectNoteType(body.content)
    const formattedContent = formatNoteContent(body.content, type)

    console.log("Detected type:", type)
    console.log("Formatted content length:", formattedContent.length)

    const newNote = await prisma.note.create({
      data: {
        content: formattedContent,
        type,
        category: body.category || "Unsorted",
      },
    })

    console.log("Created note with ID:", newNote.id)
    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Database error in POST /api/notes:", error)
    return NextResponse.json(
      { error: "Failed to create note", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
