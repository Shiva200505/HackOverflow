"use client"

import { useEffect, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResolutionTimerProps {
    reportedAt: Date
    status: string
    priority: string
}

export function ResolutionTimer({ reportedAt, status, priority }: ResolutionTimerProps) {
    const [elapsed, setElapsed] = useState("")
    const [urgency, setUrgency] = useState<"normal" | "warning" | "critical">("normal")

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const reported = new Date(reportedAt)
            const diff = now.getTime() - reported.getTime()

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setElapsed(`${hours}h ${minutes}m`)

            // Determine urgency based on time and priority
            const SLA_HOURS = {
                URGENT: 2,
                HIGH: 24,
                MEDIUM: 48,
                LOW: 72,
            }

            const slaHours = SLA_HOURS[priority as keyof typeof SLA_HOURS] || 48

            if (hours >= slaHours) {
                setUrgency("critical")
            } else if (hours >= slaHours * 0.75) {
                setUrgency("warning")
            } else {
                setUrgency("normal")
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [reportedAt, priority])

    if (status === "RESOLVED" || status === "CLOSED") {
        return null
    }

    const urgencyStyles = {
        normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                urgencyStyles[urgency]
            )}
        >
            {urgency === "critical" ? (
                <AlertCircle className="h-4 w-4" />
            ) : (
                <Clock className="h-4 w-4" />
            )}
            <span>{elapsed} elapsed</span>
            {urgency === "critical" && <span className="text-xs">⚠️ SLA exceeded</span>}
        </div>
    )
}
