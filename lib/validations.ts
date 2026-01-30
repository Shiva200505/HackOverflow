import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT", "MANAGEMENT"]),
    hostel: z.string().optional(),
    block: z.string().optional(),
    room: z.string().optional(),
})

export const issueSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(["PLUMBING", "ELECTRICAL", "CLEANLINESS", "INTERNET", "FURNITURE", "OTHER"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"]),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    mediaUrls: z.array(z.string()).optional(),
})

export const announcementSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    type: z.enum(["CLEANING", "PEST_CONTROL", "DOWNTIME", "MAINTENANCE", "GENERAL"]),
    targetHostels: z.array(z.string()),
    targetBlocks: z.array(z.string()),
    targetRoles: z.array(z.enum(["STUDENT", "MANAGEMENT"])),
})

export const lostFoundSchema = z.object({
    type: z.enum(["LOST", "FOUND"]),
    itemName: z.string().min(2, "Item name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location is required"),
    contactInfo: z.string().optional(),
    date: z.string(),
    imageUrls: z.array(z.string()).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type IssueInput = z.infer<typeof issueSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
export type LostFoundInput = z.infer<typeof lostFoundSchema>
