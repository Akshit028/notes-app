import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { prisma } from "@/db/index";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { noteIds } = await req.json();
        const { categoryId } = await params;  // Destructure after awaiting

        if (!noteIds || !Array.isArray(noteIds)) {
            return new NextResponse("Invalid input. 'noteIds' is required", {
                status: 400,
            });
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category || category.userId !== session.user.id) {
            return new NextResponse("Category not found or unauthorized", {
                status: 404,
            });
        }

        await prisma.$transaction(
            noteIds.map((noteId) =>
                prisma.note.update({
                    where: {
                        id: noteId,
                        userId: session.user.id,
                    },
                    data: {
                        categoryId: categoryId,  // Use the destructured categoryId
                    },
                })
            )
        );

        const updatedNotes = await prisma.note.findMany({
            where: {
                categoryId: categoryId,
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(updatedNotes);
    } catch (error) {
        console.error("[ASSIGN_NOTES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}