'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Sphere, Line } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'

// Device type detection
type DeviceType = 'mobile' | 'tablet' | 'desktop'

function getDeviceType(width: number): DeviceType {
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// 3D Globe Component
function InteractiveGlobe({ scrollProgress, deviceType }: { scrollProgress: number; deviceType: DeviceType }) {
  const globeRef = useRef<THREE.Group>(null)
  const dotsRef = useRef<THREE.Points>(null)
  
  // Memoize particle generation to prevent recreation
  const { particlePositions, globeRadius, ringRadius } = useMemo(() => {
    const particles = []
    let particleCount: number
    let radius: number
    
    switch (deviceType) {
      case 'mobile':
        particleCount = 800
        radius = 1.3
        break
      case 'tablet':
        particleCount = 1500
        radius = 1.7
        break
      default:
        particleCount = 3000
        radius = 2
    }
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      particles.push(x, y, z)
    }
    
    return {
      particlePositions: new Float32Array(particles),
      globeRadius: radius,
      ringRadius: radius + 0.05
    }
  }, [deviceType])

  useFrame((state) => {
    if (globeRef.current) {
      // Smooth rotation based on scroll
      const targetRotationY = scrollProgress * Math.PI * 4
      const targetRotationX = Math.sin(scrollProgress * Math.PI) * 0.3
      
      globeRef.current.rotation.y += (targetRotationY - globeRef.current.rotation.y) * 0.05
      globeRef.current.rotation.x += (targetRotationX - globeRef.current.rotation.x) * 0.05
      
      // Scale effect
      const targetScale = 1 + Math.sin(scrollProgress * Math.PI) * 0.2
      globeRef.current.scale.setScalar(globeRef.current.scale.x + (targetScale - globeRef.current.scale.x) * 0.05)
    }
    
    if (dotsRef.current) {
      dotsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  const segments = deviceType === 'mobile' ? 32 : deviceType === 'tablet' ? 48 : 64
  const pointSize = deviceType === 'mobile' ? 0.012 : deviceType === 'tablet' ? 0.016 : 0.02
  const torusSegments = deviceType === 'mobile' ? 64 : deviceType === 'tablet' ? 80 : 100

  return (
    <group ref={globeRef}>
      {/* Main Globe Wireframe */}
      <Sphere args={[globeRadius, segments, segments]}>
        <meshStandardMaterial
          color="#dc2626"
          wireframe={true}
          transparent
          opacity={0.15}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Inner Glow Sphere */}
      <Sphere args={[globeRadius - 0.02, Math.floor(segments / 2), Math.floor(segments / 2)]}>
        <meshStandardMaterial
          color="#dc2626"
          transparent
          opacity={0.05}
          emissive="#dc2626"
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Particle Dots */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={pointSize}
          color="#dc2626"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Equator Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, 0.01, 16, torusSegments]} />
        <meshStandardMaterial
          color="#b91c1c"
          emissive="#b91c1c"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Meridian Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[ringRadius, 0.01, 16, torusSegments]} />
        <meshStandardMaterial
          color="#b91c1c"
          emissive="#b91c1c"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Connection Lines between points
function ConnectionLines({ scrollProgress, deviceType }: { scrollProgress: number; deviceType: DeviceType }) {
  const linesRef = useRef<THREE.Group>(null)
  
  // Memoize connections based on device type
  const { connections, lineWidth } = useMemo(() => {
    const scale = deviceType === 'mobile' ? 0.65 : deviceType === 'tablet' ? 0.85 : 1
    const width = deviceType === 'mobile' ? 0.8 : deviceType === 'tablet' ? 1.2 : 1.5
    
    return {
      connections: [
        { start: [1.5 * scale, 0.5 * scale, 1 * scale], end: [-1.5 * scale, 0.8 * scale, 0.5 * scale] },
        { start: [-1.2 * scale, -0.8 * scale, 1.2 * scale], end: [1.8 * scale, -0.5 * scale, -0.5 * scale] },
        { start: [0.5 * scale, 1.5 * scale, 0.8 * scale], end: [-0.8 * scale, -1.5 * scale, 1 * scale] },
        { start: [1.8 * scale, 0, -0.5 * scale], end: [-1 * scale, 1.2 * scale, -1.2 * scale] },
      ],
      lineWidth: width
    }
  }, [deviceType])
  
  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.rotation.y = scrollProgress * Math.PI * 2
    }
  })
  
  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[conn.start, conn.end]}
          color="#dc2626"
          lineWidth={lineWidth}
          transparent
          opacity={0.4 + scrollProgress * 0.4}
        />
      ))}
    </group>
  )
}

// Location Markers
function LocationMarkers({ scrollProgress, deviceType }: { scrollProgress: number; deviceType: DeviceType }) {
  const markersRef = useRef<THREE.Group>(null)
  
  // Memoize marker properties
  const { locations, markerSize, ringSize } = useMemo(() => {
    const scale = deviceType === 'mobile' ? 0.65 : deviceType === 'tablet' ? 0.85 : 1
    const mSize = deviceType === 'mobile' ? 0.05 : deviceType === 'tablet' ? 0.065 : 0.08
    const rSize = deviceType === 'mobile' ? 0.10 : deviceType === 'tablet' ? 0.125 : 0.15
    
    return {
      locations: [
        { pos: [1.5 * scale, 0.5 * scale, 1 * scale], active: scrollProgress < 0.25 },
        { pos: [-1.5 * scale, 0.8 * scale, 0.5 * scale], active: scrollProgress >= 0.25 && scrollProgress < 0.5 },
        { pos: [-1.2 * scale, -0.8 * scale, 1.2 * scale], active: scrollProgress >= 0.5 && scrollProgress < 0.75 },
        { pos: [1.8 * scale, -0.5 * scale, -0.5 * scale], active: scrollProgress >= 0.75 },
      ],
      markerSize: mSize,
      ringSize: rSize
    }
  }, [deviceType, scrollProgress])
  
  useFrame(() => {
    if (markersRef.current) {
      markersRef.current.rotation.y = scrollProgress * Math.PI * 4
    }
  })
  
  return (
    <group ref={markersRef}>
      {locations.map((loc, i) => (
        <group key={i} position={loc.pos as [number, number, number]}>
          {/* Marker Sphere */}
          <Sphere args={[markerSize, 16, 16]}>
            <meshStandardMaterial
              color={loc.active ? "#dc2626" : "#b91c1c"}
              emissive={loc.active ? "#dc2626" : "#b91c1c"}
              emissiveIntensity={loc.active ? 1.5 : 0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </Sphere>
          
          {/* Pulse Ring when active */}
          {loc.active && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ringSize, 0.005, 16, 32]} />
              <meshStandardMaterial
                color="#dc2626"
                emissive="#dc2626"
                emissiveIntensity={2}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

// Orbiting Satellites
function OrbitingSatellites({ scrollProgress, deviceType }: { scrollProgress: number; deviceType: DeviceType }) {
  const satellitesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 + scrollProgress * Math.PI
    }
  })
  
  // Memoize satellite properties
  const { satelliteCount, orbitRadius, boxSize } = useMemo(() => {
    switch (deviceType) {
      case 'mobile':
        return { satelliteCount: 2, orbitRadius: 2.2, boxSize: 0.07 }
      case 'tablet':
        return { satelliteCount: 3, orbitRadius: 2.8, boxSize: 0.085 }
      default:
        return { satelliteCount: 3, orbitRadius: 3.5, boxSize: 0.1 }
    }
  }, [deviceType])
  
  return (
    <group ref={satellitesRef}>
      {Array.from({ length: satelliteCount }).map((_, i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / satelliteCount, 0]}>
          <mesh position={[orbitRadius, 0, 0]}>
            <boxGeometry args={[boxSize, boxSize, boxSize * 1.5]} />
            <meshStandardMaterial
              color="#b91c1c"
              emissive="#b91c1c"
              emissiveIntensity={1}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Main 3D Scene
function Scene({ scrollProgress, deviceType }: { scrollProgress: number; deviceType: DeviceType }) {
  const cameraSettings = useMemo(() => {
    switch (deviceType) {
      case 'mobile':
        return { position: [0, 0, 4.5] as [number, number, number], fov: 65 }
      case 'tablet':
        return { position: [0, 0, 5.5] as [number, number, number], fov: 55 }
      default:
        return { position: [0, 0, 6] as [number, number, number], fov: 50 }
    }
  }, [deviceType])

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraSettings.position} fov={cameraSettings.fov} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#dc2626" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#dc2626" distance={10} />
      <pointLight position={[-5, 5, 5]} intensity={1.5} color="#b91c1c" />
      <pointLight position={[5, -5, -5]} intensity={1.5} color="#991b1b" />
      
      {/* Globe and Elements */}
      <InteractiveGlobe scrollProgress={scrollProgress} deviceType={deviceType} />
      <ConnectionLines scrollProgress={scrollProgress} deviceType={deviceType} />
      <LocationMarkers scrollProgress={scrollProgress} deviceType={deviceType} />
      <OrbitingSatellites scrollProgress={scrollProgress} deviceType={deviceType} />
    </>
  )
}

// Canvas Wrapper
function Globe3D() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Prevent double rendering by setting mounted state
    setMounted(true)
    
    // Check device type on mount and resize
    const checkDevice = () => {
      setDeviceType(getDeviceType(window.innerWidth))
    }
    
    checkDevice()
    
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / maxScroll
      setScrollProgress(Math.min(Math.max(progress, 0), 1))
    }
    
    // Debounce resize for better performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkDevice, 150)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  const canvasSettings = useMemo(() => {
    switch (deviceType) {
      case 'mobile':
        return {
          dpr: [1, 1.5] as [number, number],
          antialias: false,
          powerPreference: 'low-power' as const
        }
      case 'tablet':
        return {
          dpr: [1, 1.75] as [number, number],
          antialias: true,
          powerPreference: 'default' as const
        }
      default:
        return {
          dpr: [1, 2] as [number, number],
          antialias: true,
          powerPreference: 'high-performance' as const
        }
    }
  }, [deviceType])

  // Don't render until mounted to prevent SSR issues
  if (!mounted) return null

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={canvasSettings.dpr}
        gl={{ 
          antialias: canvasSettings.antialias,
          alpha: true,
          powerPreference: canvasSettings.powerPreference,
          stencil: false,
          depth: true
        }}
        performance={{ min: 0.5 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} deviceType={deviceType} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Main Hero Component
export default function Hero() {
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
    <section className="relative min-h-[200vh] bg-gradient-to-br from-[#0a0f0d] via-[#050705] to-[#0d0a0f] overflow-hidden text-white font-sans">
      
      {/* 3D Globe Scene - Single instance with fixed positioning */}
      <div className="fixed inset-0 w-screen h-screen z-0">
        <Globe3D />
      </div>

      {/* Overlay Effects */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 w-[min(800px,80vw)] h-[min(800px,80vh)] rounded-full blur-[min(150px,20vw)] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
      </div>
    </section>
  )
}
