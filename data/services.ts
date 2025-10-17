import { Video, Palette, Sparkles, Zap, Check, Clock, Users, Award, Code, Smartphone, Globe, Layers, Workflow, Rocket } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface ServicePackage {
  name: string
  price: string
  duration: string
  revisions: string
  features: string[]
  popular?: boolean
}

export interface ProcessStep {
  step: string
  description: string
}

export interface ServiceStat {
  icon: LucideIcon
  label: string
  value: string
}

export interface Service {
  id: string
  icon: LucideIcon
  title: string
  tagline: string
  description: string
  longDescription?: string
  features: string[]
  process?: ProcessStep[]
  packages?: ServicePackage[]
  stats?: ServiceStat[]
  pricing?: string
  color: string
  image: string
}

export const servicesData: Record<string, Service> = {
  "discovery-strategy-bd": {
    id: "discovery-strategy-bd",
    icon: Zap,
    title: "Discovery & Strategy",
    tagline: "Clarity Before Code for Local Ventures",
    description:
      "A focused engagement to validate your idea, define project scope, and deliver a comprehensive technical blueprint suitable for the Bangladeshi market.",
    longDescription:
      "Great software starts with a solid plan. Our Discovery phase involves a deep dive into your business goals and market competition. We deliver a detailed Scope of Work (SOW), technical architecture, and a **locally competitive, fixed-price quote** for the development phase.",
    features: [
      "Detailed Scope of Work (SOW)",
      "Wireframing & UX Flowchart",
      "Technical Stack Recommendation",
      "Product Roadmap & Timeline",
      "Fixed-Price Development Quote",
      "Local Market & Competitor Analysis",
    ],
    process: [
      { step: "Ideation", description: "Initial stakeholder interviews and concept review" },
      { step: "Blueprint", description: "Drafting the technical architecture and feature list" },
      { step: "Validation", description: "Refining flows and requirements with your team" },
      { step: "Documentation", description: "Finalizing all SOW and roadmap documents" },
      { step: "Launch Prep", description: "Handing off to the development team or your internal team" },
    ],
    packages: [
      {
        name: "Concept Validation",
        price: "৳ 8,500",
        duration: "3 Days",
        revisions: "1 review session",
        features: ["1-hour video consultation", "Feature outline report", "Tech stack recommendation", "Basic budget estimate"],
      },
      {
        name: "Full Discovery",
        price: "৳ 25,000",
        duration: "2 Weeks",
        revisions: "2 full revisions",
        features: ["Detailed SOW (30+ pages)", "Wireframes for 10 screens", "Finalized technical spec", "Development roadmap", "Fixed-price quote"],
        popular: true,
      },
      {
        name: "Product Workshop",
        price: "৳ 55,000",
        duration: "4 Weeks",
        revisions: "Unlimited",
        features: [
          "Everything in Full Discovery",
          "Competitor and market analysis",
          "Full UX/UI mockups (15+ screens)",
          "Detailed database architecture",
          "Dedicated strategy lead",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Quote Accuracy", value: "95%" },
      { icon: Users, label: "Projects De-risked", value: "150+" },
      { icon: Award, label: "Client Satisfaction", value: "4.8/5" },
    ],
    pricing: "Starting ৳ 8,500",
    color: "from-pink-500/20 to-rose-500/20",
    image: "/creative-direction-team-brainstorming.jpg",
  },
  "web-software-dev-bd": {
    id: "web-software-dev-bd",
    icon: Code,
    title: "Web & SaaS Development",
    tagline: "Robust Web Platforms for Local Growth",
    description:
      "From corporate websites to custom multi-user SaaS platforms, we build secure, scalable web solutions focusing on local needs and payment gateways (bKash/Nagad).",
    longDescription:
      "We specialize in modern web development with a focus on clean architecture and performance. We ensure your web platform is ready for local traffic and seamless integration with the Bangladeshi financial ecosystem.",
    features: [
      "Custom CRM/ERP Solutions",
      "E-commerce & Local Payment Integration (bKash/Nagad)",
      "Advanced API Integrations",
      "User Authentication & Role-Based Access",
      "Cloud Hosting & DevOps Setup Assistance",
      "Ongoing Maintenance & Support",
    ],
    process: [
      { step: "Planning", description: "SOW finalization (or utilize our Discovery package)" },
      { step: "Design", description: "UI/UX wireframing and design mockups" },
      { step: "Development", description: "Agile sprints, daily standups, and dedicated development" },
      { step: "QA/Testing", description: "Rigorous testing for security, load, and functionality" },
      { step: "Deployment", description: "Full launch, monitoring, and knowledge transfer" },
    ],
    packages: [
      {
        name: "Basic Website",
        price: "৳ 35,000",
        duration: "3-4 Weeks",
        revisions: "2 design revisions",
        features: ["5-7 page marketing site", "CMS integration", "Basic forms & contact features", "Mobile responsive design", "1-month bug fix warranty"],
      },
      {
        name: "Pro Web/SaaS MVP",
        price: "৳ 95,000+",
        duration: "6-8 Weeks",
        revisions: "4 design/feature revisions",
        features: ["Custom user dashboard", "3-5 core user features", "Payment gateway integration", "High security standards (Local)", "Dedicated PM/QA lead"],
        popular: true,
      },
      {
        name: "Enterprise Custom",
        price: "৳ 2,00,000+",
        duration: "10+ Weeks",
        revisions: "Unlimited",
        features: [
          "Complex workflow automation",
          "Legacy system migration",
          "Advanced 3rd-party integrations",
          "Custom cloud architecture support",
          "Ongoing retainer option",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Average Delivery", value: "8 Weeks" },
      { icon: Users, label: "Code Confidence", value: "99.9%" },
      { icon: Award, label: "Client NPS", value: "+65" },
    ],
    pricing: "Starting ৳ 35,000",
    color: "from-blue-500/20 to-cyan-500/20",
    image: "/abstract-motion-graphics.png",
  },
  "mobile-app-dev-bd": {
    id: "mobile-app-dev-bd",
    icon: Smartphone,
    title: "Mobile App Development",
    tagline: "Affordable iOS & Android MVP Launch",
    description:
      "Launch your Mobile MVP on both iOS and Android. We use cross-platform efficiency to get your product to the local market fast and affordably.",
    longDescription:
      "We build native-quality mobile applications using modern cross-platform frameworks. We prioritize intuitive UX/UI and robust backend architecture, ensuring a seamless experience for Bangladeshi users.",
    features: [
      "Cross-Platform (iOS & Android)",
      "Push Notification Integration",
      "Location & Camera Services",
      "Backend API Integration",
      "App Store/Play Store Submission Support",
      "Performance Optimization",
    ],
    process: [
      { step: "Strategy", description: "Defining core features for the MVP launch" },
      { step: "Design", description: "Mobile-first UI/UX design and prototyping" },
      { step: "Development", description: "Concurrent build on iOS/Android" },
      { step: "Testing", description: "Beta testing and bug fixing" },
      { step: "Deployment", description: "Guiding you through App Store and Play Store submission" },
    ],
    packages: [
      {
        name: "Basic App MVP",
        price: "৳ 75,000",
        duration: "8-10 Weeks",
        revisions: "3 feature revisions",
        features: ["Core functionality (3-4 screens)", "Basic user authentication", "Single API integration", "Deployment assistance", "1-month support"],
      },
      {
        name: "Pro App (Growth)",
        price: "৳ 1,50,000+",
        duration: "12-16 Weeks",
        revisions: "5 feature revisions",
        features: ["Expanded feature set (6-8 screens)", "Analytics integration (Google/Firebase)", "Push notifications", "Complex data handling", "Full QA team testing"],
        popular: true,
      },
      {
        name: "Enterprise Custom",
        price: "৳ 2,50,000+",
        duration: "Custom",
        revisions: "Unlimited",
        features: [
          "Advanced security and encryption",
          "Offline sync capabilities",
          "Custom SDK/Hardware integration",
          "Extended maintenance contract",
          "Guaranteed uptime SLAs",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Time to Market", value: "Avg. 10 Weeks" },
      { icon: Users, label: "Devices Supported", value: "10k+" },
      { icon: Award, label: "5-Star Rating Avg.", value: "4.7" },
    ],
    pricing: "Starting ৳ 75,000",
    color: "from-purple-500/20 to-violet-500/20",
    image: "/3d-animation-production.jpg",
  },
  "custom-3d-web-dev-bd": {
    id: "custom-3d-web-dev-bd",
    icon: Globe,
    title: "Custom 3D Web & XR",
    tagline: "Interactive Digital Experiences for Local Businesses",
    description:
      "Harness the power of WebGL and Three.js to create immersive, interactive 3D websites and virtual tours directly in the browser.",
    longDescription:
      "We combine high-performance rendering with web accessibility to build cutting-edge 3D experiences. Perfect for local e-commerce or architectural firms needing dynamic visualization.",
    features: [
      "WebGL & Three.js Development",
      "Interactive 3D Product Viewers",
      "Virtual Showrooms & Tours",
      "Real-Time Data Visualization in 3D",
      "Cross-Browser Compatibility",
      "Optimized Performance for Web",
    ],
    process: [
      { step: "Asset Prep", description: "Optimizing 3D models and textures for web performance" },
      { step: "Prototyping", description: "Creating a functional 3D scene mockup" },
      { step: "Integration", description: "Connecting 3D scene logic to the web UI and backend" },
      { step: "Optimization", description: "Profiling and optimizing frame rates for smooth user experience" },
      { step: "Launch", description: "Deploying the immersive experience to your server" },
    ],
    packages: [
      {
        name: "Basic 3D Visualizer",
        price: "৳ 55,000",
        duration: "4 Weeks",
        revisions: "2 visual revisions",
        features: ["Single 3D model embed", "Basic camera control", "Static web page integration (3 pages)", "Mobile friendly"],
      },
      {
        name: "Pro Interactive Scene",
        price: "৳ 1,20,000+",
        duration: "6-8 Weeks",
        revisions: "4 visual revisions",
        features: ["Multi-model scene creation", "Custom UI overlays for interaction", "Data-driven model updates", "Performance optimized", "Dedicated 3D Artist and Developer"],
        popular: true,
      },
      {
        name: "Enterprise Configurator",
        price: "৳ 2,50,000+",
        duration: "10+ Weeks",
        revisions: "Unlimited",
        features: [
          "Complex product customization logic",
          "Advanced shading and materials",
          "Integration with e-commerce checkout",
          "VR/AR readiness assessment",
          "Full asset pipeline management",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Asset Pipeline Speed", value: "3 Days" },
      { icon: Users, label: "Scenes Created", value: "70+" },
      { icon: Award, label: "Frame Rate Guarantee", value: "60 FPS" },
    ],
    pricing: "Starting ৳ 55,000",
    color: "from-lime-500/20 to-green-500/20",
    image: "/brand-identity-process.png",
  },
  "desktop-app-solutions-bd": {
    id: "desktop-app-solutions-bd",
    icon: Layers,
    title: "Desktop Application Solutions",
    tagline: "Powerful Local Software for Internal Operations",
    description:
      "We build fast, secure, and reliable desktop applications for Windows and macOS, specializing in internal tools and specialized data management.",
    longDescription:
      "Desktop applications are ideal for performance, security, and offline capabilities. We use modern frameworks to deliver robust solutions for your business's critical internal processes.",
    features: [
      "Windows & macOS Development",
      "Offline Data Storage & Sync",
      "System Resource Optimization",
      "Hardware Integration (e.g., scanners, printers)",
      "Advanced Security Protocols",
      "Internal Tooling & Automation",
    ],
    process: [
      { step: "Requirements", description: "Mapping out system dependencies and user workflows" },
      { step: "Prototyping", description: "Building core functionality and UI structure" },
      { step: "Robustness", description: "Focus on error handling, stability, and security hardening" },
      { step: "Packaging", description: "Creating installers and ensuring smooth deployment across your organization" },
      { step: "Documentation", description: "Providing comprehensive user and technical documentation" },
    ],
    packages: [
      {
        name: "Utility Tool (Basic)",
        price: "৳ 65,000",
        duration: "6 Weeks",
        revisions: "2 feature revisions",
        features: ["Single purpose application", "Local database (SQLite)", "Basic UI/UX", "Installer creation (Windows/Mac)", "1-month bug support"],
      },
      {
        name: "Pro Data Management",
        price: "৳ 1,55,000+",
        duration: "10-14 Weeks",
        revisions: "4 feature revisions",
        features: ["Client-server architecture ready", "Advanced reporting features", "Multi-user security features", "Active Directory integration support", "Dedicated support channel"],
        popular: true,
      },
      {
        name: "Enterprise Custom ERP/CRM",
        price: "৳ 3,00,000+",
        duration: "Custom",
        revisions: "Unlimited",
        features: [
          "Full integration with existing IT infrastructure",
          "Compliance-focused security (Local standards)",
          "Long-term maintenance contract",
          "On-site deployment and training (client cost)",
          "Dedicated 24/7 technical support",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Avg. Performance Score", value: "98/100" },
      { icon: Users, label: "Internal Systems Built", value: "80+" },
      { icon: Award, label: "Security Audit Pass Rate", value: "100%" },
    ],
    pricing: "Starting ৳ 65,000",
    color: "from-indigo-500/20 to-sky-500/20",
    image: "/3d-animation-production.jpg",
  },
}

// Helper function to get all services as an array
export const getAllServices = (): Service[] => {
  return Object.values(servicesData)
}

// Helper function to get a service by ID
export const getServiceById = (id: string): Service | undefined => {
  return servicesData[id]
}

// Helper function to get all service IDs
export const getAllServiceIds = (): string[] => {
  return Object.keys(servicesData)
}