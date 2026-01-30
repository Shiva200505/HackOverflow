"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square, Loader2, Send } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function VoiceReportPage() {
    const router = useRouter()
    const [isRecording, setIsRecording] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            toast.error("Speech recognition is not supported in this browser.")
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
            setIsRecording(true)
            toast.info("Listening...")
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = ""
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + " "
                }
            }
            if (finalTranscript) {
                setTranscript(prev => (prev + finalTranscript).trim())
            }
        }

        recognition.onerror = () => {
            setIsRecording(false)
            toast.error("Error occurred in recognition.")
        }

        recognition.onend = () => {
            setIsRecording(false)
        }

        recognition.start()
        recognitionRef.current = recognition
    }

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecording(false)
        }
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    const handleSubmit = async () => {
        if (!transcript) return

        setIsProcessing(true)
        try {
            // 1. Process with AI to get structure
            const aiResponse = await fetch("/api/ai/process-voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            })

            if (!aiResponse.ok) throw new Error("Failed to process voice")
            const aiData = await aiResponse.json()

            // 2. Submit actual issue
            const issueResponse = await fetch("/api/issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...aiData,
                    mediaUrls: [],
                    visibility: "PUBLIC"
                }),
            })

            if (!issueResponse.ok) throw new Error("Failed to create issue")

            toast.success("Issue Reported Successfully!", {
                description: `Categorized as ${aiData.category} with ${aiData.priority} priority.`
            })

            setTranscript("")
            router.push("/issues")

        } catch (error) {
            console.error(error)
            toast.error("Failed to submit report. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <FadeIn className="container mx-auto p-6 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Voice Reporting
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Describe your issue and AI will fill out the details for you.
                </p>
            </div>

            <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className={`relative mb-8 transition-all duration-300 ${isRecording ? "scale-110" : "scale-100"}`}>
                        {isRecording && (
                            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                        )}
                        <Button
                            size="lg"
                            className={`h-24 w-24 rounded-full shadow-xl transition-all duration-300 ${isRecording
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                }`}
                            onClick={toggleRecording}
                        >
                            {isRecording ? (
                                <Square className="h-8 w-8 text-white fill-current" />
                            ) : (
                                <Mic className="h-10 w-10 text-white" />
                            )}
                        </Button>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                        {isRecording ? "Listening..." : "Tap to Speak"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-xs">
                        {isRecording
                            ? "Describe the issue, location, and urgency clearly."
                            : "Press the microphone button to start recording your issue."}
                    </p>

                    {isProcessing && (
                        <div className="flex items-center gap-2 text-purple-600 mb-6 font-medium">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing with AI...
                        </div>
                    )}

                    {transcript && (
                        <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-left mb-6 border border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Transcript</p>
                            <p className="text-lg text-gray-800 dark:text-gray-200">{transcript}</p>
                        </div>
                    )}

                    {transcript && !isProcessing && (
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setTranscript("")}
                            >
                                Clear
                            </Button>
                            <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSubmit}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Submit Report
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </FadeIn>
    )
}
