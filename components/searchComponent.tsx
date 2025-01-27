"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Note } from '@/types/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from "@/components/ui/input";

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearch = useDebounce(query, 300);
    const router = useRouter();

    useEffect(() => {
        const searchNotes = async () => {
            if (!debouncedSearch.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`);
                if (!response.ok) throw new Error('Search failed');
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchNotes();
    }, [debouncedSearch]);

    const handleNoteClick = (note: Note) => {
        router.push(`/notes/${note.id}`);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your notes"
                    className="pl-10 rounded-full w-full"
                />
                {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 animate-spin -translate-y-1/2" />}
            </div>

            {query.trim() !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                    {results.length === 0 && !isLoading ? (
                        <p className="text-center text-muted-foreground py-4">
                            No matching notes.
                        </p>
                    ) : (
                        <div className="space-y-2 py-2">
                            {results.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={() => handleNoteClick(note)}
                                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                                >
                                    <div className="font-medium">{note.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                        {note.content}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;