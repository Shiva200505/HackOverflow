import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import LostFoundList from "@/components/lost-found/LostFoundList"

export default async function LostFoundPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            {/* Page Header with Gradient */}
            <div className="mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Search className="h-8 w-8" />
                                </div>
                                <h1 className="text-4xl font-bold">Lost & Found</h1>
                            </div>
                            <p className="text-white/90 text-lg">
                                Find your lost items or help others find theirs
                            </p>
                        </div>
                        <Link href="/lost-found/new">
                            <Button className="bg-white text-orange-600 hover:bg-white/90 shadow-lg h-12 px-6 font-semibold">
                                <Plus className="mr-2 h-5 w-5" />
                                Report Item
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <LostFoundList />
            </div>
        </div>
    )
}
