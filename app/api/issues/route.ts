import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { issueSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = issueSchema.parse(body)

        // Get user details for auto-tagging
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Create issue with auto-tagging
        const issue = await prisma.issue.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                category: validatedData.category,
                priority: validatedData.priority,
                visibility: validatedData.visibility,
                mediaUrls: validatedData.mediaUrls || [],
                hostel: user.hostel || "Not Specified",
                block: user.block || "Not Specified",
                room: user.room || "Not Specified",
                reporterId: user.id,
                status: "REPORTED",
                reportedAt: new Date(),
            },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(issue, { status: 201 })
    } catch (error) {
        console.error("Issue creation error:", error)

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
        const category = searchParams.get("category")
        const priority = searchParams.get("priority")
        const status = searchParams.get("status")

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: Record<string, any> = {}

        // Students can only see their own issues + public issues
        // Management can see all issues
        if (session.user.role === "STUDENT") {
            where.OR = [
                { reporterId: session.user.id },
                { visibility: "PUBLIC" },
            ]
        }

        if (category) where.category = category
        if (priority) where.priority = priority
        if (status) where.status = status

        const issues = await prisma.issue.findMany({
            where,
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
            },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" },
            ],
        })

        return NextResponse.json(issues)
    } catch (error) {
        console.error("Issues fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
