import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
    isTouchDevice: boolean;
}

const NoteCard = ({note,onEdit,onDelete,isTouchDevice}: NoteCardProps)   => {
    return (
        <Card className="mb-4 group relative hover:shadow-lg transition-shadow">
            <CardHeader
                className="flex flex-row items-start justify-between space-y-0 cursor-pointer"
                onClick={() => onEdit(note)}
            >
                <CardTitle className="line-clamp-2 py-1 pr-12">{note.title}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-4 top-3 transition-opacity ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } text-destructive hover:text-destructive/90`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                    }}
                    aria-label={`Delete note: ${note.title}`}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="cursor-pointer" onClick={() => onEdit(note)}>
                <p className="whitespace-pre-wrap line-clamp-3">{note.content}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
            </CardContent>
        </Card>
    );
};

export default NoteCard;