'use client'

import { Target, Layers, FileCode2, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react"

const reasons = [
  {
    icon: Target,
    title: "Business-first approach",
    description: "We solve problems, not just write code"
  },
  {
    icon: Layers,
    title: "Modern tech stack",
    description: "Future-proof, scalable solutions"
  },
  {
    icon: FileCode2,
    title: "Clean engineering",
    description: "Maintainable, well-documented code"
  },
  {
    icon: MessageSquare,
    title: "Clear communication",
    description: "No guessing, no surprises"
  },
  {
    icon: TrendingUp,
    title: "Long-term mindset",
    description: "We build software meant to last"
  }
]

export function WhyPqrix() {
  return (
    <section id="why-pqrix" className="container mx-auto px-4 py-16 sm:py-20">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
            Why Choose <span className="text-red-600 dark:text-red-400">PQRIX?</span>
          </h2>
        </div>

        {/* Reasons Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-lg bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <reason.icon className="text-white" size={32} />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-2 -translate-y-2">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-500">
                  {reason.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {reason.description}
                </p>
              </div>
            ))}

            {/* Call to Action Card - Spans remaining space */}
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <div className="relative p-10 rounded-lg bg-gradient-to-br from-red-600/10 to-red-800/10 dark:from-red-950/40 dark:to-black/60 backdrop-blur-xl border border-red-500/30 overflow-hidden group hover:border-red-500/50 transition-all duration-500">
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-4 tracking-tight">
                    Ready to build something great?
                  </h3>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Let's discuss your project and create a solution that drives real results.
                  </p>
                  <a
                    href="/client/register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold text-lg shadow-[0_20px_60px_rgba(220,38,38,0.4)] hover:shadow-[0_25px_80px_rgba(220,38,38,0.6)] transition-all duration-500 hover:scale-105 border border-red-400/20"
                  >
                    Start Your Project
                    <CheckCircle2 size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}
