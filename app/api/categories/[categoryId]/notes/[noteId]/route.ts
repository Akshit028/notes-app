import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/db/index";
import options from "@/config/auth";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { categoryId: string; noteId: string } }
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.note.update({
            where: { 
                id: params.noteId,
                userId: session.user.id  // Add user check for security
            },
            data: {
                categoryId: null,
            },
        });

        const updatedNotes = await prisma.note.findMany({
            where: { 
                categoryId: params.categoryId,
                userId: session.user.id  // Add user check for security
            },
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