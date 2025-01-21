// components/NoteEditor.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import type { Note, CreateNoteInput } from '@/types/types';

interface NoteEditorProps {
    note: (Note & { id?: string }) | CreateNoteInput;
    isLoading: boolean;
    error: string | null;
    onSave: () => Promise<void>;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const NoteEditor = ({
    note,
    isLoading,
    error,
    onSave,
    onClose,
    onChange,
}: NoteEditorProps) => {
    return (
        <div className="fixed inset-0 bg-background">
            <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <Button variant={'outline'} onClick={onSave} disabled={isLoading} className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="max-w-3xl mx-auto px-4 py-8">
                    <Input
                        name="title"
                        placeholder="Note Title"
                        value={note.title}
                        onChange={onChange}
                        className="text-3xl font-semibold border-none shadow-none mb-8 bg-transparent focus-visible:ring-0"
                        disabled={isLoading}
                    />
                    <Textarea
                        name="content"
                        placeholder="Write your note here..."
                        value={note.content}
                        onChange={onChange}
                        className="min-h-[calc(100vh-250px)] resize-none shadow-none border-none focus-visible:ring-0 text-lg bg-transparent"
                        disabled={isLoading}
                    />
                </form>
            </main>

            {error && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-destructive/10">
                    <p className="text-destructive text-sm max-w-3xl mx-auto">{error}</p>
                </div>
            )}
        </div>
    );
};

export default NoteEditor;