"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MapPin, Calendar, User, Loader2 } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/motion"
import { toast } from "sonner"

const TYPE_COLORS = {
    LOST: "bg-red-100 text-red-800",
    FOUND: "bg-green-100 text-green-800",
}

const STATUS_COLORS = {
    ACTIVE: "bg-blue-100 text-blue-800",
    CLAIMED: "bg-purple-100 text-purple-800",
    CLOSED: "bg-gray-100 text-gray-800",
}

interface LostFoundItem {
    id: string
    type: string
    itemName: string
    description: string
    location: string
    date: string
    status: string
    imageUrls: string[]
    createdAt: string
    reporter: {
        name: string
        email: string
    }
}

export default function LostFoundList() {
    const [items, setItems] = useState<LostFoundItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [claimingId, setClaimingId] = useState<string | null>(null)
    const [filters, setFilters] = useState({
        type: "all",
        status: "all",
    })

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (filters.type !== "all") params.append("type", filters.type)
                if (filters.status !== "all") params.append("status", filters.status)

                const response = await fetch(`/api/lost-found?${params}`)
                const data = await response.json()
                setItems(data)
            } catch (error) {
                console.error("Failed to fetch items:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchItems()
    }, [filters])

    const handleClaim = async (itemId: string) => {
        setClaimingId(itemId)
        try {
            const response = await fetch(`/api/lost-found/${itemId}/claim`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to claim item")
            }

            toast.success("Item claimed successfully! The reporter will be notified.")

            // Refresh the list
            const params = new URLSearchParams()
            if (filters.type !== "all") params.append("type", filters.type)
            if (filters.status !== "all") params.append("status", filters.status)

            const refreshResponse = await fetch(`/api/lost-found?${params}`)
            const data = await refreshResponse.json()
            setItems(data)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to claim item")
        } finally {
            setClaimingId(null)
        }
    }

    return (
        <FadeIn className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Lost & Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Report or find lost items in the hostel
                    </p>
                </div>
                <Link href="/lost-found/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Report Item
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                        <SelectItem value="FOUND">Found</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="CLAIMED">Claimed</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-500">Loading items...</p>
                </div>
            ) : items.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No items found</p>
                    </CardContent>
                </Card>
            ) : (
                <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <StaggerItem key={item.id}>
                            <HoverCard>
                                <Card className="hover:shadow-md transition-shadow overflow-hidden">
                                    {item.imageUrls.length > 0 && (
                                        <div className="h-40 w-full relative overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.imageUrls[0]}
                                                alt={item.itemName}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={TYPE_COLORS[item.type as keyof typeof TYPE_COLORS]}>
                                                {item.type}
                                            </Badge>
                                            <Badge className={STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{item.itemName}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {item.description}
                                        </p>
                                        <div className="space-y-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {item.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {item.reporter.name}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4"
                                            size="sm"
                                            onClick={() => handleClaim(item.id)}
                                            disabled={item.status !== "ACTIVE" || claimingId === item.id}
                                        >
                                            {claimingId === item.id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Claiming...
                                                </>
                                            ) : (
                                                item.type === "LOST" ? "I Found This" : "This Is Mine"
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            )}
        </FadeIn>
    )
}
