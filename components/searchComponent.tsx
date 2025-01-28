"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Note } from "@/types/types";

const GlobalSearch = () => {
    const [query, setQuery] = useState("");
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
                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(debouncedSearch)}`
                );
                if (!response.ok) throw new Error("Search failed");
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchNotes();
    }, [debouncedSearch]);

    const handleNoteClick = (note: Note) => {
        router.push(`/notes/${note.id}`);
        setQuery("");
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
                    className="w-full rounded-full pl-10"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                )}
            </div>

            {query.trim() !== "" && (
                <div className="absolute z-10 mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border bg-white shadow-lg dark:bg-black">
                    {results.length === 0 && !isLoading ? (
                        <p className="py-4 text-center text-muted-foreground">
                            No matching notes.
                        </p>
                    ) : (
                        <div className="space-y-2 py-2">
                            {results.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={() => handleNoteClick(note)}
                                    className="w-full px-4 py-2 text-left transition-colors hover:bg-accent"
                                >
                                    <div className="font-medium">
                                        {note.title}
                                    </div>
                                    <div className="line-clamp-1 text-sm text-muted-foreground">
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
