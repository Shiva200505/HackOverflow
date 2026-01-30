import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params

    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const issue = await prisma.issue.findUnique({
            where: { id: params.id },
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        if (!issue) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 })
        }

        // Check access permissions
        if (session.user.role === "STUDENT") {
            if (issue.visibility === "PRIVATE" && issue.reporterId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 })
            }
        }

        return NextResponse.json(issue)
    } catch (error) {
        console.error("Issue fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params

    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Only management can update issues
        if (session.user.role !== "MANAGEMENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const { status, assignedTo } = body

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {}

        if (status) {
            updateData.status = status

            // Update timestamps based on status
            if (status === "ASSIGNED" && !updateData.assignedAt) {
                updateData.assignedAt = new Date()
            } else if (status === "IN_PROGRESS" && !updateData.inProgressAt) {
                updateData.inProgressAt = new Date()
            } else if (status === "RESOLVED" && !updateData.resolvedAt) {
                updateData.resolvedAt = new Date()
            } else if (status === "CLOSED" && !updateData.closedAt) {
                updateData.closedAt = new Date()
            }
        }

        if (assignedTo !== undefined) {
            updateData.assignedTo = assignedTo
            if (assignedTo && !updateData.assignedAt) {
                updateData.assignedAt = new Date()
            }
        }

        const issue = await prisma.issue.update({
            where: { id: params.id },
            data: updateData,
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

        return NextResponse.json(issue)
    } catch (error) {
        console.error("Issue update error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
