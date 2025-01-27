import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ categoryId: string; noteId: string }> }
) {
    try {
        await prisma.note.update({
            where: { id: (await params).noteId },
            data: {
                categoryId: null,
            },
        });

        const updatedNotes = await prisma.note.findMany({
            where: { categoryId: (await params).categoryId },
        });

        return NextResponse.json(updatedNotes, { status: 200 });
    } catch (error) {
        console.error("Error removing note from category:", error);
        return NextResponse.json(
            { error: "Failed to remove note from category" },
            { status: 500 }
        );
    }
}
