import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateNoteInput, Note } from "@/types/types";

interface NoteEditorProps {
    note: (Note & { id?: string }) | CreateNoteInput;
    isLoading: boolean;
    error: string | null;
    onSave: () => Promise<void>;
    onClose: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
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
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={onSave}
                        disabled={isLoading}
                        className="flex items-center"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSave();
                    }}
                    className="mx-auto max-w-3xl px-4 py-8"
                >
                    <Input
                        name="title"
                        placeholder="Note Title"
                        value={note.title}
                        onChange={onChange}
                        className="mb-8 border-none bg-transparent text-3xl font-semibold shadow-none focus-visible:ring-0"
                        disabled={isLoading}
                    />
                    <Textarea
                        name="content"
                        placeholder="Write your note here..."
                        value={note.content}
                        onChange={onChange}
                        className="min-h-[calc(100vh-250px)] resize-none border-none bg-transparent text-lg shadow-none focus-visible:ring-0"
                        disabled={isLoading}
                    />
                </form>
            </main>

            {error && (
                <div className="fixed bottom-0 left-0 right-0 bg-destructive/10 p-4">
                    <p className="mx-auto max-w-3xl text-sm text-destructive">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NoteEditor;
