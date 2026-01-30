"use client"

import { motion } from "framer-motion"

export const FadeIn = ({ children, delay = 0, duration = 0.5, className = "" }: { children: React.ReactNode, delay?: number, duration?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
)

export const SlideIn = ({ children, direction = "left", delay = 0, className = "" }: { children: React.ReactNode, direction?: "left" | "right" | "up" | "down", delay?: number, className?: string }) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0
        },
        visible: { opacity: 1, x: 0, y: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const StaggerContainer = ({ children, staggerChildren = 0.1, className = "" }: { children: React.ReactNode, staggerChildren?: number, className?: string }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            visible: { transition: { staggerChildren } }
        }}
        className={className}
    >
        {children}
    </motion.div>
)

export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5 }}
        className={className}
    >
        {children}
    </motion.div>
)

export const HoverCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={className}
    >
        {children}
    </motion.div>
)

export const TapButton = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={className}
    >
        {children}
    </motion.div>
)
