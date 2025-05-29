import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/notes/[id] - Starting request for ID:", params.id)

    await prisma.note.delete({
      where: { id: params.id },
    })

    console.log("Successfully deleted note:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error in DELETE /api/notes/[id]:", error)
    return NextResponse.json(
      { error: "Note not found", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT /api/notes/[id] - Starting request for ID:", params.id)

    const body = await request.json()
    console.log("Update data:", body)

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    console.log("Successfully updated note:", params.id)
    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Database error in PUT /api/notes/[id]:", error)
    return NextResponse.json(
      { error: "Note not found", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 },
    )
  }
}
