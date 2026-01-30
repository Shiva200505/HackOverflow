import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params

    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { type } = await req.json()
        const issueId = params.id

        // Check if user already reacted
        const existingReaction = await prisma.reaction.findFirst({
            where: {
                issueId,
                userId: session.user.id,
            },
        })

        if (existingReaction) {
            if (existingReaction.type === type) {
                // Remove reaction if same type
                await prisma.reaction.delete({
                    where: { id: existingReaction.id },
                })
                return NextResponse.json({ message: "Reaction removed" })
            } else {
                // Update reaction type
                await prisma.reaction.update({
                    where: { id: existingReaction.id },
                    data: { type },
                })
                return NextResponse.json({ message: "Reaction updated" })
            }
        } else {
            // Create new reaction
            await prisma.reaction.create({
                data: {
                    type,
                    issueId,
                    userId: session.user.id,
                },
            })
            return NextResponse.json({ message: "Reaction added" })
        }
    } catch (error) {
        console.error("Reaction error:", error)
        return NextResponse.json(
            { error: "Failed to process reaction" },
            { status: 500 }
        )
    }
}
