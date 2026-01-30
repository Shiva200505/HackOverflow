
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { parseIssueFromVoice } from "@/lib/groq";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { transcript } = body;

        if (!transcript || typeof transcript !== "string") {
            return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
        }

        const aiData = await parseIssueFromVoice(transcript);

        return NextResponse.json(aiData);
    } catch (error) {
        console.error("Voice processing error:", error);
        return NextResponse.json(
            { error: "Failed to process voice report" },
            { status: 500 }
        );
    }
}
