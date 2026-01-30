"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Flame, Heart, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type EmergencyType = "FIRE" | "MEDICAL" | "SECURITY" | null

export function EmergencySOS() {
    const [open, setOpen] = useState(false)
    const [selectedType, setSelectedType] = useState<EmergencyType>(null)
    const [sending, setSending] = useState(false)

    const handleEmergency = async (type: EmergencyType) => {
        setSelectedType(type)
        setSending(true)

        try {
            // Get user location if available
            let location = "Location unavailable"
            if (navigator.geolocation) {
                await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            location = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`
                            resolve(true)
                        },
                        () => resolve(false)
                    )
                })
            }

            const response = await fetch("/api/emergency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    location,
                    timestamp: new Date().toISOString(),
                }),
            })

            if (response.ok) {
                toast.success("🚨 Emergency Alert Sent!", {
                    description: "Help is on the way! Management notified.",
                    duration: 5000,
                    style: { background: '#EF4444', color: 'white', border: 'none' }
                })
                setOpen(false)
            } else {
                throw new Error("Failed to send alert")
            }
        } catch {
            toast.error("Failed to send digital alert. Please call services directly.")
        } finally {
            setSending(false)
            setSelectedType(null)
        }
    }

    const emergencyTypes = [
        {
            type: "FIRE" as EmergencyType,
            icon: Flame,
            label: "Fire",
            gradient: "from-orange-500 to-red-600",
            shadow: "shadow-red-500/30",
            description: "Fire / Smoke",
        },
        {
            type: "MEDICAL" as EmergencyType,
            icon: Heart,
            label: "Medical",
            gradient: "from-pink-500 to-rose-600",
            shadow: "shadow-pink-500/30",
            description: "Injury / Health",
        },
        {
            type: "SECURITY" as EmergencyType,
            icon: Shield,
            label: "Security",
            gradient: "from-blue-600 to-indigo-700",
            shadow: "shadow-indigo-500/30",
            description: "Threat / Danger",
        },
    ]

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r from-red-600 to-rose-600 p-0 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse ring-4 ring-red-400/30"
                title="Emergency SOS"
            >
                <AlertTriangle className="h-8 w-8 text-white drop-shadow-md" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
                    <DialogHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 animate-bounce">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-red-600">
                            Emergency SOS
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
                            Tap below to alert security & management immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-4 py-4">
                        {emergencyTypes.map(({ type, icon: Icon, label, gradient, shadow, description }) => (
                            <Button
                                key={type}
                                onClick={() => handleEmergency(type)}
                                disabled={sending}
                                className={cn(
                                    "h-32 flex flex-col items-center justify-center gap-3 p-2 rounded-2xl bg-gradient-to-br transition-all duration-300 hover:scale-105 active:scale-95 border-none",
                                    gradient,
                                    shadow,
                                    "shadow-lg text-white"
                                )}
                            >
                                {sending && selectedType === type ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <>
                                        <div className="p-2 bg-white/20 rounded-full">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="text-center">
                                            <span className="font-bold text-lg block">{label}</span>
                                            <span className="text-[10px] uppercase opacity-90">{description}</span>
                                        </div>
                                    </>
                                )}
                            </Button>
                        ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            🚨 False alarms will be tracked and penalized.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
