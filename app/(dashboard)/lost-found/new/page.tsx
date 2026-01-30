"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewLostFoundPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "LOST" as "LOST" | "FOUND",
        itemName: "",
        description: "",
        location: "",
        date: "",
        contactInfo: "",
        imageUrl: "",
    })

    useEffect(() => {
        // Set default date to today
        setFormData(prev => ({
            ...prev,
            date: new Date().toISOString().split("T")[0]
        }))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Prepare data to match API schema
            const apiData = {
                type: formData.type,
                itemName: formData.itemName,
                description: formData.description,
                location: formData.location,
                contactInfo: formData.contactInfo || undefined,
                date: formData.date,
                imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
            }

            const response = await fetch("/api/lost-found", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData),
            })

            const data = await response.json()

            if (!response.ok) {
                let errorMessage = data.error || "Failed to report item"
                if (data.details && Array.isArray(data.details)) {
                    const details = data.details.map((err: { message: string }) => err.message).join(", ")
                    errorMessage += `: ${details}`
                }
                throw new Error(errorMessage)
            }

            toast.success("Item reported successfully!")
            router.push("/lost-found")
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to report item")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center gap-4">
                        <Link href="/lost-found">
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Search className="h-6 w-6" />
                                </div>
                                <h1 className="text-3xl font-bold">Report Lost/Found Item</h1>
                            </div>
                            <p className="text-white/90">
                                Help reunite items with their owners
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6 max-w-3xl">
                <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-base font-semibold">Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "LOST" | "FOUND") => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOST">I lost something</SelectItem>
                                        <SelectItem value="FOUND">I found something</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="itemName" className="text-base font-semibold">Item Name</Label>
                                <Input
                                    id="itemName"
                                    placeholder="e.g., Blue Water Bottle"
                                    value={formData.itemName}
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the item (color, brand, distinguishing marks)..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="min-h-[120px] resize-none text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-base font-semibold">Location Found/Lost</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Common Room, Block A"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-base font-semibold">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact" className="text-base font-semibold">Contact Info (Optional)</Label>
                                <Input
                                    id="contact"
                                    placeholder="Phone number or Room number"
                                    value={formData.contactInfo}
                                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                    className="h-12"
                                />
                                <p className="text-sm text-gray-500">Note: Your email from your profile will be used for contact</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-base font-semibold">Image URL (Optional)</Label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="image"
                                        placeholder="https://..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="pl-10 h-12"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Link href="/lost-found" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full h-12">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Report Item"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
