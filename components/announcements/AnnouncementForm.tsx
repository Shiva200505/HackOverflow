"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const ANNOUNCEMENT_TYPES = [
    { value: "CLEANING", label: "Cleaning Schedule" },
    { value: "PEST_CONTROL", label: "Pest Control" },
    { value: "DOWNTIME", label: "Downtime Notice" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "GENERAL", label: "General" },
]

const HOSTELS = ["Hostel A", "Hostel B", "Hostel C", "Hostel D"]


export default function AnnouncementForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "GENERAL",
        targetHostels: [] as string[],
        targetBlocks: [] as string[],
        targetRoles: ["STUDENT", "MANAGEMENT"] as string[],
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to create announcement")
                return
            }

            router.push("/announcements")
            router.refresh()
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleHostel = (hostel: string) => {
        setFormData(prev => ({
            ...prev,
            targetHostels: prev.targetHostels.includes(hostel)
                ? prev.targetHostels.filter(h => h !== hostel)
                : [...prev.targetHostels, hostel]
        }))
    }

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>
                    Create an announcement for hostel residents
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Announcement title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            placeholder="Announcement details..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            disabled={isLoading}
                            rows={5}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ANNOUNCEMENT_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Hostels (leave empty for all)</Label>
                        <div className="flex flex-wrap gap-2">
                            {HOSTELS.map((hostel) => (
                                <Button
                                    key={hostel}
                                    type="button"
                                    variant={formData.targetHostels.includes(hostel) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleHostel(hostel)}
                                    disabled={isLoading}
                                >
                                    {hostel}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Announcement"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
