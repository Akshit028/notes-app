"use client";

// components/CategoriesComponent.tsx
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, FormEvent, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Category } from "@/types/types"
import { Card, CardTitle } from "@/components/ui/card";

const CategoriesComponent: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategory, setNewCategory] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories')
            if (!response.ok) throw new Error('Failed to fetch categories')
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleCreateCategory = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newCategory.trim() && !isLoading) {
            try {
                setIsLoading(true)
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newCategory.trim() })
                })

                if (!response.ok) throw new Error('Failed to create category')

                const newCategoryData = await response.json()
                setCategories(prev => [newCategoryData, ...prev])
                setNewCategory("")
                setOpen(false)
            } catch (error) {
                console.error('Error creating category:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleCategoryClick = (category: Category): void => {
        router.push(`/categories/${category.id}`)
    }

    return (
        <div className="p-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Category</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                        <DialogDescription>
                            Add your categories here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCategory}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Groceries"
                                    className="col-span-3"
                                    value={newCategory}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="p-4 border rounded-lg hover:bg-gray-50 
                        dark:hover:bg-[#27272A] cursor-pointer transition-colors"
                    >

                        <h3 className="text-lg font-medium">{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoriesComponent