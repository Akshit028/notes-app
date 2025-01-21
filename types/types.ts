export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    categoryId?: string;
}
export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    notes: Note[];
}

export type CreateNoteInput = Pick<Note, 'title' | 'content'>;