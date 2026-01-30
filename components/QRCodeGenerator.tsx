"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Download } from "lucide-react"

export default function QRCodeGenerator() {
    const [showQR, setShowQR] = useState(false)
    const reportUrl = typeof window !== "undefined" ? `${window.location.origin}/issues/new` : ""

    const downloadQR = () => {
        const canvas = document.getElementById("qr-code") as HTMLCanvasElement
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream")
            const downloadLink = document.createElement("a")
            downloadLink.href = pngUrl
            downloadLink.download = "hostel-issue-qr.png"
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    }

    return (
        <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Quick Report QR Code</DialogTitle>
                    <DialogDescription>
                        Scan this QR code to quickly report an issue from your mobile device
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            id="qr-code"
                            value={reportUrl}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={downloadQR} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download QR
                        </Button>
                        <Button onClick={() => setShowQR(false)}>Close</Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Print and display this QR code in common areas for easy issue reporting
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
