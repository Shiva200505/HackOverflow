import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Zap } from "lucide-react"

import { FadeIn, SlideIn, StaggerContainer, StaggerItem, HoverCard, TapButton } from "@/components/ui/motion"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Gradients (Kept CSS animation for background as it's performant) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 z-0"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl dark:bg-purple-900/20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl dark:bg-blue-900/20 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-6 relative z-10 py-20 text-center">
          <FadeIn delay={0.2} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-blue-100 dark:border-white/10 backdrop-blur-sm shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">HackOverflow 2026 Project</span>
          </FadeIn>

          <SlideIn direction="up" delay={0.3}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Smart Hostel Issue
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Tracking System
              </span>
            </h1>
          </SlideIn>

          <FadeIn delay={0.5}>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the next generation of campus facility management.
              Report issues, track progress, and build a better community together.
            </p>
          </FadeIn>

          <FadeIn delay={0.7} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <TapButton>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </TapButton>
            </Link>
            <Link href="/register">
              <TapButton>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">
                  Create Account
                </Button>
              </TapButton>
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white dark:bg-slate-950 py-20">
        <StaggerContainer className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <HoverCard className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-xl">
                <div className="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Real-time Tracking</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Track status updates instantly. From reported to resolved, never lose sight of your issues.
                </p>
              </HoverCard>
            </StaggerItem>

            <StaggerItem>
              <HoverCard className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-xl">
                <div className="h-14 w-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Community Driven</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Gamified leaderboard, community announcements, and transparent resolution process.
                </p>
              </HoverCard>
            </StaggerItem>

            <StaggerItem>
              <HoverCard className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-xl">
                <div className="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Safety First</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Dedicated SOS features and priority handling for security and emergency issues.
                </p>
              </HoverCard>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </div>
  )
}
