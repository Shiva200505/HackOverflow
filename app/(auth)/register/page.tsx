"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Home, Lock, Mail, User, Building2, Hash } from "lucide-react"
import { FadeIn, SlideIn } from "@/components/ui/motion"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
        hostel: "",
        block: "",
        room: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Registration failed")
                return
            }

            router.push("/login?registered=true")
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Gradient Panel */}
            <div className="hidden lg:block lg:w-1/2 overflow-hidden">
                <SlideIn direction="left" className="h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 text-white relative">
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 h-64 w-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-20 right-20 h-80 w-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center h-full max-w-md mx-auto">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Home className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl font-bold">Hostel Tracker</h1>
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Join Our Community!</h2>
                            <p className="text-white/90 text-lg mb-8">
                                Create your account and start managing hostel life smarter.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <h3 className="font-semibold mb-2">✨ What You&apos;ll Get</h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Report and track issues instantly</li>
                                    <li>• Emergency SOS button for safety</li>
                                    <li>• Earn points and badges</li>
                                    <li>• Stay updated with announcements</li>
                                    <li>• Lost & Found management</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </SlideIn>
            </div>

            {/* Right Side - Register Form */}
            <FadeIn delay={0.3} className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
                                <Home className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Hostel Tracker
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Create Account
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter your information to get started
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                    <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        disabled={isLoading}
                                        minLength={6}
                                        className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Role
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT">Student</SelectItem>
                                        <SelectItem value="MANAGEMENT">Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.role === "STUDENT" && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="hostel" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Hostel
                                        </Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="hostel"
                                                placeholder="e.g., Hostel A"
                                                value={formData.hostel}
                                                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                                                disabled={isLoading}
                                                className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="block" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Block
                                            </Label>
                                            <Input
                                                id="block"
                                                placeholder="Block 1"
                                                value={formData.block}
                                                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                                                disabled={isLoading}
                                                className="h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="room" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Room
                                            </Label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <Input
                                                    id="room"
                                                    placeholder="101"
                                                    value={formData.room}
                                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                                    disabled={isLoading}
                                                    className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-emerald-600 hover:text-teal-600 dark:text-emerald-400 dark:hover:text-teal-400 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </FadeIn>
        </div>
    )
}
