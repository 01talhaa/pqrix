'use client'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { 
  Star, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Flame, 
  Cpu, 
  Terminal, 
  Database, 
  Code 
} from "lucide-react"
import dynamic from 'next/dynamic'

const Tech3DScene = dynamic(() => import('@/components/tech-3d-scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

export default function RedHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-screen bg-[#050000] overflow-hidden text-white font-sans">
      
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Tech3DScene />
      </div>

      {/* Advanced Background with 3D Depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220, 38, 38, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220, 38, 38, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(${scrollY * 0.5}px)`,
            transformOrigin: 'center top'
          }}
        />
        
        <div 
          className="absolute top-1/3 left-1/3 w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center pt-24 pb-20 text-center">
          
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-red-950/30 border border-red-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="text-[11px] font-black text-red-400 uppercase tracking-[0.25em]">PQRIX - we solve, you scale</span>
            {/* <Terminal size={14} className="text-red-500" /> */}
          </div>

          <h1 className="max-w-5xl text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
            <span className="inline-block bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
              Custom Software
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-red-600 via-red-500 to-red-800 bg-clip-text text-transparent">
              Built for Scale
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-xl text-gray-400 leading-relaxed font-medium">
            Enterprise-grade web & mobile solutions engineered for performance. From MVPs to complex systems.
            <span className="text-red-500"> AI-powered when it matters.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-12">
            <Button className="group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-7 rounded-full text-lg shadow-[0_20px_60px_rgba(220,38,38,0.3)] transition-all duration-500 hover:scale-105 border border-red-400/20">
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </Button>
            
            <Button variant="outline" className="border-2 border-white/10 hover:border-red-500/50 bg-white/5 backdrop-blur-xl text-white font-semibold px-10 py-7 rounded-full text-lg transition-all duration-500">
              Talk to an Expert
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 flex flex-wrap justify-center gap-12 px-10 py-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl">
            {[
              { val: '200+', lab: 'Projects Delivered' },
              { val: '50+', lab: 'Enterprise Clients' },
              { val: '15+', lab: 'Tech Stacks' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-red-500">{stat.val}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mt-1 font-bold">{stat.lab}</div>
                </div>
                {i < 2 && <div className="hidden md:block h-10 w-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        {/* Brand Showcase */}
        <div className="mt-10 flex flex-col items-center">
          <div className="flex gap-1.5 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
            ))}
          </div>
          <p className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-12">Powering innovative startups & enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 hover:opacity-100 transition-all duration-700">
            {['SHILPOMARKET', 'PIXELPRIMP', 'ECOMMERZO', 'MEDIA-MIND', 'BASHA-LAGBE'].map((name) => (
              <div key={name} className="text-2xl font-black tracking-tighter text-white hover:text-red-500 transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Section */}
        <div className="mt-48 grid md:grid-cols-2 gap-20 items-center pb-40">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-1.5 bg-red-600 rounded-full" />
              <span className="text-xs font-black tracking-[0.3em] uppercase text-red-500">End-to-End Development</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              Architected for
              <br />
              <span className="text-red-600">Performance</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
              Full-stack solutions from concept to deployment. Cloud-native architecture, modern frameworks, and scalable infrastructure with optional AI capabilities.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Code size={18} className="text-red-500" />
                </div>
                Clean Code
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Database size={18} className="text-red-500" />
                </div>
                Scalable Systems
              </div>
            </div>
          </div>
          
          <div className="relative group">
            {/* 3D Card */}
            <div 
              className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black p-3 shadow-[0_40px_100px_rgba(220,38,38,0.2)] transition-all duration-700"
              style={{
                transform: `perspective(1000px) rotateY(${(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) * 0.01}deg) rotateX(${(mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 0) / 2) * -0.01}deg)`
              }}
            >
              <div className="rounded-[2rem] overflow-hidden relative aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1676299081847-824916ef030a?q=80&w=2070&auto=format&fit=crop" 
                  alt="AI Technology" 
                  className="object-cover w-full h-full opacity-60 group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-red-950/40 backdrop-blur-3xl border border-red-500/20 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Deployment Time</div>
                    <div className="text-3xl font-black text-white tracking-tighter">2-6<span className="text-red-500 text-xl">wks</span></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Terminal className="text-white" size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-10 bg-red-600/10 blur-[100px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  )
}