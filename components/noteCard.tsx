import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Note } from "@/types/types";

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string) => void;
    isTouchDevice: boolean;
}

const NoteCard = ({ note, onDelete, isTouchDevice }: NoteCardProps) => {
    const router = useRouter();
    const handleNoteClick = () => {
        router.push(`/notes/${note.id}`);
    };

    return (
        <Card className="group relative transition-shadow hover:shadow-md">
            <CardHeader
                className="flex cursor-pointer flex-row items-start justify-between space-y-0"
                onClick={handleNoteClick}
            >
                <CardTitle className="line-clamp-2 py-1 pr-12">
                    {note.title}
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-4 top-3 transition-opacity ${
                        isTouchDevice
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
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
            <CardContent className="cursor-pointer" onClick={handleNoteClick}>
                <p className="line-clamp-3 whitespace-pre-wrap">
                    {note.content}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </p>
            </CardContent>
        </Card>
    );
};

export default NoteCard;
