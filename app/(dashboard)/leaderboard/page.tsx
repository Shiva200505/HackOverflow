import { Trophy, Award, Star } from "lucide-react"
import { Leaderboard } from "@/components/Leaderboard"

export default function LeaderboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header with Gradient */}
            <div className="mb-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Trophy className="h-8 w-8" />
                                </div>
                                <h1 className="text-4xl font-bold">Leaderboard</h1>
                            </div>
                            <p className="text-white/90 text-lg">
                                Top contributors and community champions
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Award className="h-5 w-5" />
                                <span className="font-semibold">Earn Points</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Star className="h-5 w-5" />
                                <span className="font-semibold">Win Badges</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <Leaderboard />
            </div>
        </div>
    )
}
