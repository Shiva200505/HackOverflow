import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: itemId } = await params

        // Get the item
        const item = await prisma.lostFound.findUnique({
            where: { id: itemId },
        })

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        if (item.status !== "ACTIVE") {
            return NextResponse.json(
                { error: "This item has already been claimed" },
                { status: 400 }
            )
        }

        // Prevent users from claiming their own items
        if (item.reporterId === session.user.id) {
            return NextResponse.json(
                { error: "You cannot claim your own item" },
                { status: 400 }
            )
        }

        // Update the item to claimed status
        const updatedItem = await prisma.lostFound.update({
            where: { id: itemId },
            data: {
                status: "CLAIMED",
                claimedBy: session.user.id,
                claimStatus: "PENDING",
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

        return NextResponse.json(updatedItem, { status: 200 })
    } catch (error) {
        console.error("Lost/Found claim error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
