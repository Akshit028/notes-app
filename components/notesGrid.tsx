// components/NotesGrid.tsx
import { Note } from '@/types/types';
import  NoteCard  from './noteCard';

interface NotesGridProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
    isTouchDevice: boolean;
}

const NotesGrid = ({
    notes,
    onEdit,
    onDelete,
    isTouchDevice,
}: NotesGridProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
            <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                isTouchDevice={isTouchDevice}
            />
        ))}
    </div>
);

export default NotesGrid;