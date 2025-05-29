import { type NextRequest, NextResponse } from "next/server"
import type { CreateNoteRequest } from "@/types/note"
import { detectNoteType, formatNoteContent } from "@/lib/note-utils"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const type = searchParams.get("type")
    const category = searchParams.get("category")

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

    const notes = await prisma.note.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Database error in GET /api/notes:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch notes",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNoteRequest = await request.json()

    if (!body.content || body.content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const type = detectNoteType(body.content)
    const formattedContent = formatNoteContent(body.content, type)

    // Generate a simple ID using timestamp and random number
    const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newNote = await prisma.note.create({
      data: {
        id,
        content: formattedContent,
        type,
        category: body.category || "Unsorted",
      },
    })

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Database error in POST /api/notes:", error)
    return NextResponse.json(
      {
        error: "Failed to create note",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
