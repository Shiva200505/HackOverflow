
import Groq from "groq-sdk";

export interface AIMetadata {
    title: string;
    description: string;
    category: "PLUMBING" | "ELECTRICAL" | "CLEANLINESS" | "INTERNET" | "FURNITURE" | "SECURITY" | "OTHER";
    priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
}

let groqInstance: Groq | null = null;

function getGroqClient() {
    if (groqInstance) return groqInstance;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY environment variable");
    }

    groqInstance = new Groq({ apiKey });
    return groqInstance;
}

export async function parseIssueFromVoice(transcript: string): Promise<AIMetadata> {
    try {
        const groq = getGroqClient();

        const prompt = `
        You are an AI assistant for a hostel issue tracker.
        Analyze the following user complaint transcript and extract structured data.

        TRANSCRIPT: "${transcript}"

        Return ONLY a JSON object with these fields:
        - title: A short, concise title (max 6-8 words).
        - description: A polished but accurate version of the complaint.
        - category: One of [PLUMBING, ELECTRICAL, CLEANLINESS, INTERNET, FURNITURE, SECURITY, OTHER]. Choose the most relevant.
        - priority: One of [LOW, MEDIUM, HIGH, EMERGENCY]. 
            - EMERGENCY: Immediate danger (fire, gas leak, sparked wires, flooding).
            - HIGH: Major inconvenience (no water, no power, broken door).
            - MEDIUM: Standard maintenance.
            - LOW: Minor cosmetic issues or suggestions.

        Output pure JSON only, no markdown, no explanations.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-120b",
            temperature: 0.1,
        });

        const content = completion.choices[0]?.message?.content || "{}";

        // Clean up markdown code blocks if present
        const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonStr);

        // Ensure defaults if fields are missing
        return {
            title: data.title || "Voice Report",
            description: data.description || transcript,
            category: data.category || "OTHER",
            priority: data.priority || "MEDIUM",
        };
    } catch (error) {
        console.error("AI Parse Error:", error);
        // Fallback
        return {
            title: "Voice Report (Parse Failed)",
            description: transcript,
            category: "OTHER",
            priority: "MEDIUM",
        };
    }
}
