"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import * as LucideIcons from "lucide-react"

export function ServicesSection() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        if (data.success) {
          // Show only first 4 services
          setServices(data.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="container mx-auto px-4 py-16 sm:py-20 bg-white dark:bg-[#050000]">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">Our <span className="text-red-600 dark:text-red-400">Services</span></h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            From concept to completion, we deliver premium creative solutions that drive results
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.6
      }
    }
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  }

  return (
    <section id="services" className="container mx-auto px-4 py-16 sm:py-20 bg-white dark:bg-[#050000] overflow-hidden">
      <div className="mb-12 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={titleVariants}
          className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl"
        >
          Our{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 10 }}
            className="text-red-600 dark:text-red-400 inline-block"
          >
            Services
          </motion.span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={subtitleVariants}
          className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300"
        >
          From concept to completion, we deliver premium creative solutions that drive results
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((service, index) => {
          const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
          return (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="perspective-1000"
            >
              <Card className="h-full group relative overflow-hidden liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl transition-all hover:border-red-500 dark:hover:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:shadow-[0_20px_60px_rgba(220,38,38,0.4)]">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-600/20 group-hover:via-red-500/10 group-hover:to-red-400/20 transition-all duration-700"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                <CardHeader className="relative z-10">
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.2
                    }}
                    transition={{ duration: 0.6 }}
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg`}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  {service.tagline && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="text-xs font-medium text-red-500 dark:text-red-400 group-hover:text-red-200 mb-2 transition-colors"
                    >
                      {service.tagline}
                    </motion.p>
                  )}
                  
                  <CardTitle className="text-xl text-black dark:text-white group-hover:text-white transition-colors">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="inline-block"
                    >
                      {service.title}
                    </motion.span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors"
                  >
                    {service.description}
                  </motion.p>

                  {/* <ul className="space-y-2">
                    {service.features?.map((feature: string, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 + idx * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors"
                      >
                        <motion.div
                          whileHover={{ scale: 1.5 }}
                          className="h-1 w-1 rounded-full bg-red-500 dark:bg-red-400 group-hover:bg-white"
                        />
                        <span className="relative overflow-hidden">
                          <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 + idx * 0.1 }}
                            className="inline-block"
                          >
                            {feature}
                          </motion.span>
                        </span>
                      </motion.li>
                    ))}
                  </ul> */}

                  {/* {service.pricing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="pt-2"
                    >
                      <div className="text-lg font-bold text-black dark:text-white group-hover:text-white transition-colors">
                        {service.pricing}
                      </div>
                    </motion.div>
                  )} */}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="group/btn w-full justify-between text-red-600 dark:text-red-400 group-hover:text-white group-hover:bg-white/10 hover:text-red-700 dark:hover:text-red-300 transition-all"
                    >
                      <Link href={`/services/${service.id}`}>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.8 }}
                        >
                          Learn More
                        </motion.span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        className="mt-12 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            asChild
            className="rounded-full bg-red-600 dark:bg-red-500 px-8 py-6 text-base font-semibold text-white hover:bg-red-700 dark:hover:bg-red-600 shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
          >
            <Link href="/services">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
                className="relative"
              >
                View All Services
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
