"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, CheckCircle2 } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function QRScannerPage() {
    const [scanning, setScanning] = useState(true)
    const [scannedData, setScannedData] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Simulate scanning delay
        const timer = setTimeout(() => {
            setScanning(false)
            setScannedData("HOSTEL-A-BLOCK-B-ROOM-304")
            toast.success("QR Code Detected", {
                description: "Redirecting to room report..."
            })
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const handleScanAgain = () => {
        setScanning(true)
        setScannedData(null)
        setTimeout(() => {
            setScanning(false)
            setScannedData("HOSTEL-A-BLOCK-B-ROOM-304")
        }, 3000)
    }

    const handleProceed = () => {
        router.push("/issues/new?room=304&block=B&hostel=A")
    }

    return (
        <FadeIn className="container mx-auto p-6 max-w-md h-[calc(100vh-100px)] flex flex-col justify-center">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Scan QR Code</h1>
                <p className="text-gray-400">
                    Scan the QR code on the door or equipment to report an issue instantly.
                </p>
            </div>

            <Card className="overflow-hidden border-0 bg-black/40 backdrop-blur-md shadow-2xl relative">
                {scanning && (
                    <div className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative overflow-hidden">
                            <div className="absolute inset-0 border-4 border-blue-500/50 rounded-3xl animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-scan"></div>
                        </div>
                        <p className="text-white mt-8 font-medium animate-pulse">Searching for code...</p>
                    </div>
                )}

                <CardContent className="p-0 aspect-[3/4] bg-gray-900 relative">
                    {/* Mock Camera View */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-16 w-16 text-gray-700" />
                    </div>

                    {!scanning && scannedData && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Room Identified</h3>
                            <p className="text-blue-400 font-mono text-lg mb-6">{scannedData}</p>

                            <div className="w-full space-y-3">
                                <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={handleProceed}>
                                    Report Issue Here
                                </Button>
                                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800" onClick={handleScanAgain}>
                                    Scan Another
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </FadeIn>
    )
}
