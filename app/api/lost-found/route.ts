import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { lostFoundSchema } from "@/lib/validations"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = lostFoundSchema.parse(body)

        const lostFound = await prisma.lostFound.create({
            data: {
                type: validatedData.type,
                itemName: validatedData.itemName,
                description: validatedData.description,
                location: validatedData.location,
                contactInfo: validatedData.contactInfo,
                date: (() => {
                    const d = new Date(validatedData.date)
                    if (isNaN(d.getTime())) {
                        throw new Error("Invalid date")
                    }
                    return d
                })(),
                imageUrls: validatedData.imageUrls || [],
                status: "ACTIVE",
                reporterId: session.user.id,
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

        return NextResponse.json(lostFound, { status: 201 })
    } catch (error) {
        console.error("Lost/Found creation error:", error)

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
        const status = searchParams.get("status")

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: Record<string, any> = {}

        if (type && type !== "all") where.type = type
        if (status && status !== "all") where.status = status

        const items = await prisma.lostFound.findMany({
            where,
            include: {
                reporter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(items)
    } catch (error) {
        console.error("Lost/Found fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
