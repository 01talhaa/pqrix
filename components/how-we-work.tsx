'use client'

import { Lightbulb, Palette, Code2, Rocket } from "lucide-react"

const steps = [
  {
    icon: Lightbulb,
    title: "Discover",
    description: "We understand your business, goals, and challenges."
  },
  {
    icon: Palette,
    title: "Design",
    description: "We plan clean architecture and intuitive user experiences."
  },
  {
    icon: Code2,
    title: "Build",
    description: "Our engineers build reliable, scalable software."
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "We deploy, monitor, and improve continuously."
  }
]

export function HowWeWork() {
  return (
    <section id="how-we-work" className="container mx-auto px-4 py-16 sm:py-20">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
            How We <span className="text-red-600 dark:text-red-400">Work</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Simple. Professional. No buzzword soup.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Connecting Line (hidden on last item in row) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-red-500/50 to-transparent" />
              )}

              {/* Card */}
              <div className="relative p-8 rounded-lg bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-500 hover:transform hover:-translate-y-2 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/30 border border-red-400/20">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
    </section>
  )
}
