"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Megaphone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function NewAnnouncementPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "GENERAL",
        targetAudience: "ALL",
    })

    useEffect(() => {
        if (session && session.user.role !== "MANAGEMENT") {
            toast.error("Unauthorized Access")
            router.push("/dashboard")
        }
    }, [session, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Transform simple form data to match the complex backend schema
            const payload = {
                title: formData.title,
                content: formData.content,
                type: formData.type,
                // Defaulting to empty arrays for hostels/blocks implies "Global" or "All" in many systems, 
                // but if the schema demands valid strings, we might need to handle specific logic.
                // Based on typically "All" selection:
                targetHostels: [],
                targetBlocks: [],
                targetRoles: formData.targetAudience === "ALL"
                    ? ["STUDENT", "MANAGEMENT"]
                    : [formData.targetAudience === "STUDENTS" ? "STUDENT" : "MANAGEMENT"]
            }

            const response = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to create announcement")
            }

            toast.success("Announcement created successfully!")
            router.push("/announcements")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create announcement")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center gap-4">
                        <Link href="/announcements">
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Megaphone className="h-6 w-6" />
                                </div>
                                <h1 className="text-3xl font-bold">New Announcement</h1>
                            </div>
                            <p className="text-white/90">
                                Broadcast a message to the hostel community
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
                                <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Announcement headline"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your announcement details here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    className="min-h-[150px] resize-none text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-base font-semibold">Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GENERAL">General</SelectItem>
                                            <SelectItem value="CLEANING">Cleaning</SelectItem>
                                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                            <SelectItem value="DOWNTIME">Downtime</SelectItem>
                                            <SelectItem value="PEST_CONTROL">Pest Control</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="target" className="text-base font-semibold">Target Audience</Label>
                                    <Select
                                        value={formData.targetAudience}
                                        onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Everyone</SelectItem>
                                            <SelectItem value="STUDENTS">Students Only</SelectItem>
                                            <SelectItem value="MANAGEMENT">Management Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Link href="/announcements" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full h-12">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        "Publish Announcement"
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
