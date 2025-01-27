import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/db/index";
import options from "@/config/auth";

type RouteContext = {
    params: {
        categoryId: string;
        noteId: string;
    }
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.note.update({
            where: { 
                id: context.params.noteId,
                userId: session.user.id
            },
            data: {
                categoryId: null,
            },
        });

        const updatedNotes = await prisma.note.findMany({
            where: { 
                categoryId: context.params.categoryId,
                userId: session.user.id
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