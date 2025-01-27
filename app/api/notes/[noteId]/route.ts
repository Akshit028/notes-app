import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { prisma } from "@/db/index";

export async function GET(
    _request: Request,
    { params }: { params: { noteId: string } }
) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const note = await prisma.note.findUnique({
            where: {
                id: params.noteId,
                userId: session.user.id,
            },
        });

        if (!note) {
            return new NextResponse("Note not found", { status: 404 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error("[NOTE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
