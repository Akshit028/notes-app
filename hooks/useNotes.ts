import { useState, useEffect } from 'react';
import type { Note, CreateNoteInput } from '@/types/types';

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch notes');
            }
            const data: Note[] = await response.json();
            setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const createNote = async (note: CreateNoteInput): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create note');
            }

            await fetchNotes();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateNote = async (note: Note): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update note');
            }

            await fetchNotes();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNote = async (noteId: string): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete note');
            }

            await fetchNotes();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return {
        notes,
        isLoading,
        error,
        setError,
        createNote,
        updateNote,
        deleteNote,
    };
};