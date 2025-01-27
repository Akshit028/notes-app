"use client";

import { useState, useEffect } from 'react';
import { Note } from '@/types/types';
import NoteEditor from './noteEditor';
import { useNotes } from '@/hooks/useNotes';
import Loading from '@/app/loading';

interface NoteDetailComponentProps {
    noteId: string;
}

const NoteIdComponent = ({ noteId }: NoteDetailComponentProps) => {
    const { updateNote } = useNotes();
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`/api/notes/${noteId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch note');
                }
                const data = await response.json();
                setNote(data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        };

        fetchNote();
    }, [noteId]);

    const handleSubmit = async () => {
        if (!note || !note.title.trim() || !note.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            await updateNote(note);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setError(null);
        setNote(prev => prev ? { ...prev, [name]: value } : null);
    };

    if (isLoading) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!note) return <div>Note not found</div>;

    return (
        <NoteEditor
            note={note}
            isLoading={isLoading}
            error={error}
            onSave={handleSubmit}
            onClose={() => window.history.back()}
            onChange={handleInputChange}
        />
    );
};

export default NoteIdComponent;