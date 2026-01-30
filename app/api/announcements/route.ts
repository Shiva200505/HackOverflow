import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { announcementSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Only management can create announcements
        if (session.user.role !== "MANAGEMENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const validatedData = announcementSchema.parse(body)

        const announcement = await prisma.announcement.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                type: validatedData.type,
                targetHostels: validatedData.targetHostels,
                targetBlocks: validatedData.targetBlocks,
                targetRoles: validatedData.targetRoles,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(announcement, { status: 201 })
    } catch (error) {
        console.error("Announcement creation error:", error)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).name === "ZodError") {
            return NextResponse.json(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { error: "Invalid input data", details: (error as any).errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type")

        // Get user's hostel and block for targeted announcements
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: Record<string, any> = {}

        // Filter by type if provided
        if (type && type !== "all") {
            where.type = type
        }

        // For students, filter announcements targeted to them
        if (session.user.role === "STUDENT" && user) {
            where.OR = [
                { targetHostels: { isEmpty: true } }, // No specific hostel target = all hostels
                { targetHostels: { has: user.hostel } },
            ]
            where.AND = {
                OR: [
                    { targetRoles: { isEmpty: true } },
                    { targetRoles: { has: "STUDENT" } },
                ]
            }
        }

        const announcements = await prisma.announcement.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(announcements)
    } catch (error) {
        console.error("Announcements fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
