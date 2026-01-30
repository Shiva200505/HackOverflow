import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"
import AnnouncementsList from "@/components/announcements/AnnouncementsList"

export default async function AnnouncementsPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const isManagement = session.user?.role === "MANAGEMENT"

    return (
        <div className="space-y-6">
            {/* Page Header with Gradient */}
            <div className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <AlertCircle className="h-8 w-8" />
                                </div>
                                <h1 className="text-4xl font-bold">Announcements</h1>
                            </div>
                            <p className="text-white/90 text-lg">
                                Stay updated with the latest hostel news and updates
                            </p>
                        </div>
                        {isManagement && (
                            <Link href="/announcements/new">
                                <Button className="bg-white text-purple-600 hover:bg-white/90 shadow-lg h-12 px-6 font-semibold">
                                    <Plus className="mr-2 h-5 w-5" />
                                    New Announcement
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <AnnouncementsList isManagement={isManagement} />
            </div>
        </div>
    )
}
