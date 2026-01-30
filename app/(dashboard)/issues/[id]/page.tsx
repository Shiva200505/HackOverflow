import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import IssueDetail from "@/components/issues/IssueDetail"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default async function IssueDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const isManagement = session.user?.role === "MANAGEMENT"

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center gap-4">
                        <Link href="/issues">
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <h1 className="text-3xl font-bold">Issue Details</h1>
                            </div>
                            <p className="text-white/90">
                                View and manage issue progress
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <IssueDetail issueId={params.id} isManagement={isManagement} />
            </div>
        </div>
    )
}
