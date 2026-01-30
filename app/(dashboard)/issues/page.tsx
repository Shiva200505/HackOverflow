import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, Loader2 } from "lucide-react"
import IssuesList from "@/components/issues/IssuesList"

export default async function IssuesPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="space-y-6">
            {/* Page Header with Gradient */}
            <div className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <AlertCircle className="h-8 w-8" />
                                </div>
                                <h1 className="text-4xl font-bold">Issues</h1>
                            </div>
                            <p className="text-white/90 text-lg">
                                Track and manage hostel issues efficiently
                            </p>
                        </div>
                        <Link href="/issues/new">
                            <Button className="bg-white text-blue-600 hover:bg-white/90 shadow-lg h-12 px-6 font-semibold">
                                <Plus className="mr-2 h-5 w-5" />
                                Report Issue
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                }>
                    <IssuesList />
                </Suspense>
            </div>
        </div>
    )
}
