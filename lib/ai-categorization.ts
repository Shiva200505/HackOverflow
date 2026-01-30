// AI-powered auto-categorization utility
// This simulates AI categorization - in production, you'd use OpenAI API or similar

const categoryKeywords = {
    PLUMBING: [
        "water", "leak", "pipe", "drain", "flush", "tap", "faucet", "shower",
        "toilet", "sink", "bathroom", "washroom", "dripping", "clogged", "overflow"
    ],
    ELECTRICAL: [
        "light", "power", "electricity", "switch", "socket", "outlet", "fan",
        "ac", "air conditioning", "bulb", "wire", "short circuit", "voltage",
        "electrical", "charging", "plug"
    ],
    CLEANLINESS: [
        "dirty", "clean", "garbage", "trash", "smell", "odor", "mess", "dustbin",
        "sweep", "mop", "hygiene", "sanitation", "pest", "cockroach", "rat",
        "mosquito", "waste", "litter"
    ],
    INTERNET: [
        "wifi", "internet", "network", "connection", "router", "slow", "speed",
        "lan", "ethernet", "broadband", "connectivity", "online", "offline"
    ],
    FURNITURE: [
        "chair", "table", "bed", "desk", "cupboard", "wardrobe", "door", "window",
        "broken", "damaged", "furniture", "hinge", "lock", "drawer", "shelf"
    ],
}

const priorityKeywords = {
    EMERGENCY: [
        "emergency", "urgent", "critical", "immediate", "danger", "fire", "flood",
        "electrical shock", "gas leak", "broken glass", "injury"
    ],
    HIGH: [
        "important", "serious", "major", "severe", "bad", "terrible", "awful",
        "completely broken", "not working at all"
    ],
    MEDIUM: [
        "moderate", "needs attention", "should fix", "problem", "issue"
    ],
}

export function autoCategorizeIssue(title: string, description: string): {
    category: string
    priority: string
    confidence: number
} {
    const text = `${title} ${description}`.toLowerCase()

    // Find category
    let bestCategory = "OTHER"
    let bestCategoryScore = 0

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        const score = keywords.filter(keyword => text.includes(keyword)).length
        if (score > bestCategoryScore) {
            bestCategoryScore = score
            bestCategory = category
        }
    }

    // Find priority
    let priority = "MEDIUM"

    for (const [level, keywords] of Object.entries(priorityKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            priority = level
            break
        }
    }

    // If no specific priority keywords found, default to LOW
    if (priority === "MEDIUM" && bestCategoryScore === 0) {
        priority = "LOW"
    }

    // Calculate confidence (0-100)
    const confidence = Math.min(100, (bestCategoryScore + (priority !== "MEDIUM" ? 20 : 0)) * 10)

    return {
        category: bestCategory,
        priority,
        confidence
    }
}

// Helper function to suggest category based on partial input
export function suggestCategory(text: string): string[] {
    const lowerText = text.toLowerCase()
    const suggestions: string[] = []

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            suggestions.push(category)
        }
    }

    return suggestions.length > 0 ? suggestions : ["OTHER"]
}
