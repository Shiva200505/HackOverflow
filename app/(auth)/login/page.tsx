"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Home, Lock, Mail, Sparkles } from "lucide-react"
import { FadeIn, SlideIn } from "@/components/ui/motion"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
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
                <SlideIn direction="left" className="h-full bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600 p-12 text-white relative">
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 h-64 w-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-20 right-20 h-80 w-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
                        <div className="absolute top-1/2 left-1/2 h-72 w-72 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
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
                            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                            <p className="text-white/90 text-lg">
                                Sign in to manage your hostel issues, announcements, and stay connected with your community.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Sparkles className="h-6 w-6" />
                                <div>
                                    <h3 className="font-semibold">Smart Issue Tracking</h3>
                                    <p className="text-sm text-white/80">Report and track issues in real-time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Sparkles className="h-6 w-6" />
                                <div>
                                    <h3 className="font-semibold">Emergency SOS</h3>
                                    <p className="text-sm text-white/80">One-tap emergency alerts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Sparkles className="h-6 w-6" />
                                <div>
                                    <h3 className="font-semibold">Gamification</h3>
                                    <p className="text-sm text-white/80">Earn points and badges</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SlideIn>
            </div>

            {/* Right Side - Login Form */}
            <FadeIn delay={0.3} className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg">
                                <Home className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                Hostel Tracker
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                Sign In
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                    <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                                </Alert>
                            )}

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
                                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-blue-600 hover:text-violet-600 dark:text-blue-400 dark:hover:text-violet-400 transition-colors"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </FadeIn>
        </div>
    )
}
