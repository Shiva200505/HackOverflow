"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Mic, QrCode, Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function QuickActions() {
    const [isOpen, setIsOpen] = useState(false)

    const actions = [
        {
            icon: FileText,
            label: "Report Issue",
            href: "/issues/new",
            color: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/30",
        },
        {
            icon: Mic,
            label: "Voice Report",
            href: "/issues/voice", // Assume voice route; adjusted if routed differently
            color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/30",
        },
        {
            icon: Search,
            label: "Lost & Found",
            href: "/lost-found",
            color: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-500/30",
        },
        {
            icon: QrCode,
            label: "Scan QR",
            href: "/qr-scanner",
            color: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30",
        },
    ]

    return (
        <div className="fixed bottom-24 right-6 z-40 group">
            {/* Overlay background when open */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-[1px] -z-10 transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Action Buttons */}
            <div
                className={cn(
                    "flex flex-col-reverse gap-4 mb-4 transition-all duration-300",
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}
            >
                {actions.map((action, index) => (
                    <div key={action.label} className="flex items-center gap-3 flex-row-reverse relative">
                        {/* Labels */}
                        <div
                            className={cn(
                                "bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 transform",
                                isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                            )}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {action.label}
                        </div>

                        <Link href={action.href}>
                            <Button
                                className={cn(
                                    action.color,
                                    "h-14 w-14 rounded-full shadow-lg text-white transition-all duration-300 border-2 border-white/20",
                                    "hover:scale-110 hover:shadow-xl flex items-center justify-center p-0"
                                )}
                                style={{
                                    transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                                }}
                                title={action.label}
                            >
                                <action.icon className="h-6 w-6" />
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Main FAB Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className={cn(
                        "h-16 w-16 rounded-full shadow-2xl transition-all duration-500 z-50",
                        isOpen
                            ? "bg-gray-800 hover:bg-gray-900 rotate-[135deg] shadow-gray-900/50"
                            : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-blue-600/40 animate-pulse-slow"
                    )}
                >
                    <Plus className={cn("h-8 w-8 transition-transform duration-300", isOpen ? "scale-90" : "scale-100")} />
                </Button>
            </div>
        </div>
    )
}
