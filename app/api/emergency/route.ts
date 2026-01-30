import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { type, location } = await req.json()

        // Create emergency issue
        const emergency = await prisma.issue.create({
            data: {
                title: `🚨 EMERGENCY: ${type}`,
                description: `Emergency alert triggered by ${session.user.name}\nLocation: ${location}\nType: ${type}\n\nThis is an automated emergency alert. Please respond immediately.`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                category: "SECURITY" as any,
                priority: "EMERGENCY",
                status: "REPORTED",
                visibility: "PUBLIC",
                hostel: session.user.hostel || "Unknown",
                block: session.user.block || "Unknown",
                room: session.user.room || "Unknown",
                reporterId: session.user.id,
                mediaUrls: [],
            },
        })

        // TODO: Send real-time notifications to all management users
        // This would integrate with WebSocket or push notifications

        return NextResponse.json(
            {
                message: "Emergency alert sent successfully",
                issueId: emergency.id
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Emergency alert error:", error)
        return NextResponse.json(
            { error: "Failed to send emergency alert" },
            { status: 500 }
        )
    }
}
