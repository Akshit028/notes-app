import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { prisma } from '@/db/index';
import options from '@/config/auth';

export async function GET() {
    try {
        const session = await getServerSession(options);
        console.log("Session:", session); // Debug log

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notes = await prisma.note.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(notes);
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(options);
        console.log("Session in POST:", session); // Debug log

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized - No user ID' }, { status: 401 });
        }

        const body = await request.json();
        console.log("Request body:", body); // Debug log

        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId: session.user.id
            }
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error('Detailed POST error:', error);
        return NextResponse.json({
            error: 'Failed to create note',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('id');

        if (!noteId) {
            return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
        }

        // Verify note belongs to user before deleting
        const note = await prisma.note.findFirst({
            where: {
                id: noteId,
                userId: session.user.id
            }
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        await prisma.note.delete({
            where: {
                id: noteId
            }
        });

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, title, content } = await request.json();

        if (!id || !title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify note belongs to user before updating
        const existingNote = await prisma.note.findFirst({
            where: {
                id,
                userId: session.user.id
            }
        });

        if (!existingNote) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        });

        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}