export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export type CreateNoteInput = Pick<Note, 'title' | 'content'>;