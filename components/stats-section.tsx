"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Building2, Rocket, Users, Calendar } from "lucide-react"

interface StatItem {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
}

const stats: StatItem[] = [
  {
    label: "Clients Served",
    value: 150,
    suffix: "+",
    icon: <Building2 className="h-8 w-8" />,
  },
  {
    label: "Projects Completed",
    value: 300,
    suffix: "+",
    icon: <Rocket className="h-8 w-8" />,
  },
  {
    label: "Team Members",
    value: 25,
    suffix: "+",
    icon: <Users className="h-8 w-8" />,
  },
  {
    label: "Years of Experience",
    value: 5,
    suffix: "+",
    icon: <Calendar className="h-8 w-8" />,
  },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(countRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={countRef} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

function StatsSection() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Trusted by <span className="text-green-600 dark:text-lime-400">Industry Leaders</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Delivering excellence through numbers that speak for themselves
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl p-8"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.85) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "2px solid rgba(255,255,255,0.5)",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1), inset 0 1px 2px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* Icon */}
              <div className="mb-4 text-green-600 dark:text-lime-400 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                {stat.icon}
              </div>

              {/* Value */}
              <div className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-2 drop-shadow-md">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {stat.label}
              </div>

              {/* Decorative gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at top right, rgba(34,197,94,0.1), transparent 60%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Dark mode styles */}
        <style jsx>{`
          @media (prefers-color-scheme: dark) {
            .group {
              background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,20,0.65) 100%) !important;
              border: 2px solid rgba(255,255,255,0.1) !important;
              box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 2px 0 rgba(255,255,255,0.05) !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}

export { StatsSection }
export default StatsSection
