"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface VoiceReporterProps {
    onTranscript: (text: string) => void
}

export function VoiceReporter({ onTranscript }: VoiceReporterProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null)

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            toast.error("Speech recognition is not supported in your browser")
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
            setIsListening(true)
            toast.success("🎤 Listening... Speak now!")
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = ""

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + " "
                }
            }

            const fullTranscript = (transcript + finalTranscript).trim()
            setTranscript(fullTranscript)

            if (finalTranscript) {
                onTranscript(fullTranscript)
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            toast.error("Error recognizing speech. Please try again.")
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.start()
        recognitionRef.current = recognition
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
            toast.success("Recording stopped")
        }
    }

    const clearTranscript = () => {
        setTranscript("")
        onTranscript("")
    }

    return (
        <Card className="p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Voice Reporter</h3>
                    {transcript && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearTranscript}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-center">
                    <Button
                        onClick={isListening ? stopListening : startListening}
                        size="lg"
                        className={`h-20 w-20 rounded-full ${isListening
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {isListening ? (
                            <MicOff className="h-8 w-8" />
                        ) : (
                            <Mic className="h-8 w-8" />
                        )}
                    </Button>
                </div>

                {isListening && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Listening...</span>
                        </div>
                    </div>
                )}

                {transcript && (
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground mb-1">Transcript:</p>
                        <p className="text-sm">{transcript}</p>
                    </div>
                )}

                <p className="text-xs text-center text-muted-foreground">
                    {isListening
                        ? "Speak clearly. Click the button again to stop."
                        : "Click the microphone to start voice reporting"}
                </p>
            </div>
        </Card>
    )
}
