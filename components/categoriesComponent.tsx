"use client";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreVertical, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useState, FormEvent, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Category } from "@/types/types"
import { Card, CardHeader, CardTitle } from "./ui/card";

const CategoriesComponent: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategory, setNewCategory] = useState<string>("")
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
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

    const handleEditCategory = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editingCategory && newCategory.trim() && !isLoading) {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newCategory.trim() })
                })

                if (!response.ok) throw new Error('Failed to update category')

                const updatedCategory = await response.json()
                setCategories(prev =>
                    prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
                )
                setNewCategory("")
                setEditingCategory(null)
                setOpen(false)
            } catch (error) {
                console.error('Error updating category:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleDeleteCategory = async () => {
        if (deletingCategory) {
            try {
                const response = await fetch(`/api/categories/${deletingCategory.id}`, {
                    method: 'DELETE',
                })

                if (!response.ok) throw new Error('Failed to delete category')

                setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id))
                setDeletingCategory(null)
            } catch (error) {
                console.error('Error deleting category:', error)
            }
        }
    }

    const handleCategoryClick = (category: Category): void => {
        router.push(`/categories/${category.id}`)
    }

    const startEditCategory = (category: Category) => {
        setEditingCategory(category)
        setNewCategory(category.name)
        setOpen(true)
    }

    const handleGoBack = () => {
        router.push('/notes')
    }

    return (
        <div className="p-4 ">
            <div className="flex justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleGoBack}
                    className="mr-4"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Dialog open={open} onOpenChange={(open) => {
                    setOpen(open)
                    if (!open) {
                        setEditingCategory(null)
                        setNewCategory("")
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add Category</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            <DialogDescription>
                                {editingCategory ? 'Edit your category here.' : 'Add your categories here.'}
                                Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}>
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
                                    {isLoading ? "Saving..." : (editingCategory ? "Update" : "Save")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <AlertDialog
                open={!!deletingCategory}
                onOpenChange={() => setDeletingCategory(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category "{deletingCategory?.name}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                    <Card className="mb-4 flex gap-2 justify-between group items-center relative hover:shadow-lg transition-shadow"
                        key={category.id}
                    >
                        <CardHeader
                            onClick={() => handleCategoryClick(category)}
                            className="flex flex-row items-start justify-between space-y-0 cursor-pointer line-clamp-1"
                        >
                            <CardTitle className="">{category.name}</CardTitle>
                        </CardHeader>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => startEditCategory(category)}
                                    className="cursor-pointer"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeletingCategory(category)}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default CategoriesComponent