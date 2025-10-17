export interface Project {
  id: string
  title: string
  client: string
  category: string
  description: string
  longDescription?: string
  image: string
  images?: string[] // Multiple project images for gallery
  video?: string
  tags: string[]
  year: string
  duration?: string // Project duration
  budget?: string // Project budget range
  status?: "Completed" | "In Progress" | "On Hold"
  teamMembers?: string[] // IDs of team members who worked on this
  deliverables?: string[]
  results?: string[]
  metrics?: {
    label: string
    value: string
  }[]
  challenges?: string[]
  solutions?: string[]
  technologies?: string[] // Tech stack used
  timeline?: {
    phase: string
    duration: string
    description: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  awards?: string[]
  links?: {
    label: string
    url: string
  }[]
}

export const projectsData: Record<string, Project> = {
  "luxury-watch-campaign": {
    id: "luxury-watch-campaign",
    title: "Luxury Watch Campaign",
    client: "TAG Heuer",
    category: "3D Animation",
    description: "Premium 3D product visualization showcasing the new Carrera collection with cinematic quality",
    longDescription:
      "A stunning 3D animation campaign for TAG Heuer's Carrera Day-Date collection. We created photorealistic product visualizations that captured every intricate detail of these luxury timepieces, from the reflective surfaces to the precise movement of the hands. The campaign achieved exceptional engagement across digital platforms.",
    image: "/project-luxury-watch.jpg",
    images: [
      "/project-luxury-watch.jpg",
      "/project-luxury-watch-2.jpg",
      "/project-luxury-watch-3.jpg",
      "/project-luxury-watch-4.jpg",
      "/project-luxury-watch-5.jpg",
    ],
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    tags: ["3D Animation", "Product Viz", "Luxury"],
    year: "2024",
    duration: "8 weeks",
    budget: "৳2,50,000 - ৳3,00,000",
    status: "Completed",
    teamMembers: ["sarah-chen", "marcus-rodriguez", "alex-nguyen"],
    deliverables: [
      "60-second hero animation",
      "15-second social media cuts",
      "Product stills for print",
      "Interactive 360° viewer assets",
    ],
    results: ["3.5M+ video views", "45% increase in product page engagement", "Featured in Luxury Magazine"],
    metrics: [
      { label: "Video Views", value: "3.5M+" },
      { label: "Engagement Rate", value: "+45%" },
      { label: "Social Shares", value: "125K+" },
      { label: "ROI", value: "350%" },
    ],
    challenges: [
      "Capturing photorealistic metal and glass reflections",
      "Rendering complex watch mechanisms in detail",
      "Meeting tight production deadlines for global launch",
    ],
    solutions: [
      "Implemented advanced ray-tracing techniques for realistic reflections",
      "Created detailed 3D models with micro-level precision",
      "Optimized rendering pipeline for faster iteration cycles",
    ],
    technologies: ["Cinema 4D", "Redshift", "After Effects", "Octane Render", "Photoshop"],
    timeline: [
      { phase: "Discovery & Planning", duration: "1 week", description: "Product research, mood boarding, technical planning" },
      { phase: "3D Modeling", duration: "2 weeks", description: "Detailed watch modeling and texturing" },
      { phase: "Animation", duration: "3 weeks", description: "Camera movements, lighting, and animation" },
      { phase: "Rendering & Post", duration: "2 weeks", description: "Final rendering, color grading, and delivery" },
    ],
    testimonial: {
      quote:
        "Pqrix brought our timepieces to life in a way we never thought possible. The attention to detail was remarkable.",
      author: "Jean-Claude Biver",
      role: "Brand Director, TAG Heuer",
    },
    awards: ["Best Product Visualization 2024", "Vimeo Staff Pick"],
    links: [
      { label: "Live Campaign", url: "#" },
      { label: "Case Study", url: "#" },
    ],
  },
  "tech-startup-brand": {
    id: "tech-startup-brand",
    title: "Tech Startup Rebrand",
    client: "Smartpack",
    category: "Brand Identity",
    description: "Complete brand identity redesign for innovative tech startup entering the smart luggage market",
    longDescription:
      "A comprehensive rebranding project for Smartpack, a tech startup revolutionizing the luggage industry. We developed a modern, tech-forward brand identity that appeals to digital nomads and business travelers. The new brand system positioned them as innovators in the smart travel space.",
    image: "/project-tech-startup.jpg",
    images: [
      "/project-tech-startup.jpg",
      "/project-tech-startup-2.jpg",
      "/project-tech-startup-3.jpg",
      "/project-tech-startup-4.jpg",
    ],
    tags: ["Branding", "Logo Design", "Tech"],
    year: "2024",
    duration: "12 weeks",
    budget: "৳1,80,000 - ৳2,20,000",
    status: "Completed",
    teamMembers: ["sarah-chen", "emily-watson", "lisa-patel"],
    deliverables: [
      "Logo and brand mark system",
      "Comprehensive brand guidelines",
      "Marketing collateral design",
      "Website design system",
      "Packaging design",
    ],
    results: ["Successful Series A fundraising", "250% increase in brand recognition", "Featured in TechCrunch"],
    metrics: [
      { label: "Brand Recognition", value: "+250%" },
      { label: "Funding Raised", value: "$5M" },
      { label: "Media Coverage", value: "15+ outlets" },
      { label: "Customer Growth", value: "+180%" },
    ],
    challenges: [
      "Creating a brand that appeals to both tech enthusiasts and traditional travelers",
      "Differentiating from established luggage brands",
      "Building a scalable brand system for rapid growth",
    ],
    solutions: [
      "Developed a modern, minimalist identity with smart technology elements",
      "Created a unique color palette that stands out in the market",
      "Built comprehensive brand guidelines with flexible components",
    ],
    technologies: ["Figma", "Adobe Illustrator", "Adobe InDesign", "Photoshop", "Sketch"],
    timeline: [
      { phase: "Research & Strategy", duration: "3 weeks", description: "Market analysis, competitor research, brand positioning" },
      { phase: "Design Development", duration: "5 weeks", description: "Logo concepts, color systems, typography" },
      { phase: "Brand Application", duration: "3 weeks", description: "Marketing materials, packaging, digital assets" },
      { phase: "Guidelines & Handoff", duration: "1 week", description: "Brand guidelines documentation and team training" },
    ],
    testimonial: {
      quote: "The new brand identity perfectly captures our innovative spirit and helped us stand out in a crowded market.",
      author: "Michael Chen",
      role: "CEO, Smartpack",
    },
    awards: ["Red Dot Design Award 2024", "Best Startup Rebrand - Design Week"],
    links: [
      { label: "Brand Website", url: "#" },
      { label: "Brand Guidelines", url: "#" },
    ],
  },
  "social-media-campaign": {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    client: "Fashion Brand",
    category: "Motion Design",
    description: "Dynamic motion graphics series for Instagram and TikTok campaign driving 2M+ impressions",
    longDescription:
      "An energetic motion graphics campaign designed to captivate Gen Z audiences on Instagram and TikTok. We created a series of eye-catching animations that showcased the brand's new collection while maintaining high engagement through fast-paced, trendy visual styles.",
    image: "/project-social-campaign.jpg",
    images: [
      "/project-social-campaign.jpg",
      "/project-social-campaign-2.jpg",
      "/project-social-campaign-3.jpg",
      "/project-social-campaign-4.jpg",
      "/project-social-campaign-5.jpg",
      "/project-social-campaign-6.jpg",
    ],
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    tags: ["Motion Graphics", "Social Media", "Fashion"],
    year: "2024",
    duration: "6 weeks",
    budget: "৳1,20,000 - ৳1,50,000",
    status: "Completed",
    teamMembers: ["david-kim", "sarah-chen"],
    deliverables: [
      "20+ social media animations",
      "Instagram Stories templates",
      "TikTok-optimized content",
      "Branded transitions and effects",
    ],
    results: ["2.5M+ impressions", "180% increase in engagement rate", "35% boost in website traffic"],
    metrics: [
      { label: "Total Impressions", value: "2.5M+" },
      { label: "Engagement Rate", value: "+180%" },
      { label: "Website Traffic", value: "+35%" },
      { label: "Follower Growth", value: "+42K" },
    ],
    challenges: [
      "Creating content that resonates with Gen Z audience",
      "Optimizing for multiple platform formats and aspect ratios",
      "Maintaining brand consistency across diverse content types",
    ],
    solutions: [
      "Conducted extensive trend research and audience analysis",
      "Developed flexible template system for multi-platform delivery",
      "Created comprehensive brand animation guidelines",
    ],
    technologies: ["After Effects", "Premiere Pro", "Lottie", "Cinema 4D", "Figma"],
    timeline: [
      { phase: "Strategy & Concepts", duration: "1 week", description: "Trend research, content strategy, creative concepts" },
      { phase: "Asset Creation", duration: "3 weeks", description: "Motion design, animation, and template development" },
      { phase: "Platform Optimization", duration: "1 week", description: "Format optimization for each social platform" },
      { phase: "Launch & Iteration", duration: "1 week", description: "Content rollout and performance optimization" },
    ],
    testimonial: {
      quote: "The motion graphics campaign exceeded all our expectations and helped us connect with our younger audience.",
      author: "Sofia Rodriguez",
      role: "Marketing Director, Fashion Brand",
    },
    awards: ["Social Media Campaign of the Year - Marketing Awards"],
  },
  "product-launch-video": {
    id: "product-launch-video",
    title: "Product Launch Video",
    client: "Consumer Electronics",
    category: "3D Animation",
    description: "High-impact 3D animation for flagship product launch reaching 5M+ views",
    longDescription:
      "A cinematic 3D animation created for a major consumer electronics product launch. We showcased the product's innovative features through dynamic camera movements, sleek transitions, and photorealistic rendering that generated massive buzz across social media.",
    image: "/project-product-launch.jpg",
    images: [
      "/project-product-launch.jpg",
      "/project-product-launch-2.jpg",
      "/project-product-launch-3.jpg",
      "/project-product-launch-4.jpg",
    ],
    tags: ["3D Animation", "Product Launch", "Electronics"],
    year: "2024",
    duration: "10 weeks",
    budget: "৳2,80,000 - ৳3,20,000",
    status: "Completed",
    teamMembers: ["marcus-rodriguez", "james-thompson", "alex-nguyen"],
    deliverables: [
      "90-second launch video",
      "Feature highlight clips",
      "Product explainer animations",
      "Social media teasers",
    ],
    results: ["5.2M+ video views", "Successful product launch", "650K social media shares"],
    metrics: [
      { label: "Video Views", value: "5.2M+" },
      { label: "Social Shares", value: "650K+" },
      { label: "Pre-orders", value: "25K+" },
      { label: "Media Mentions", value: "200+" },
    ],
    challenges: [
      "Showcasing technical features in an engaging, non-technical way",
      "Creating cinematic quality with tight deadlines",
      "Coordinating with product team for accurate representation",
    ],
    solutions: [
      "Developed visual metaphors to explain complex technology",
      "Implemented efficient production pipeline with parallel workflows",
      "Established close collaboration with engineering team for accuracy",
    ],
    technologies: ["Blender", "Unreal Engine", "After Effects", "DaVinci Resolve", "Houdini"],
    timeline: [
      { phase: "Pre-production", duration: "2 weeks", description: "Script development, storyboarding, technical planning" },
      { phase: "3D Production", duration: "5 weeks", description: "Modeling, texturing, lighting, and animation" },
      { phase: "Rendering", duration: "2 weeks", description: "High-quality rendering and optimization" },
      { phase: "Post-production", duration: "1 week", description: "Editing, color grading, sound design" },
    ],
    testimonial: {
      quote: "The launch video played a crucial role in our most successful product launch to date.",
      author: "David Park",
      role: "VP of Marketing, Consumer Electronics",
    },
    awards: ["Best Product Launch Video 2024", "Webby Award Honoree"],
    links: [
      { label: "Watch on YouTube", url: "#" },
      { label: "Behind the Scenes", url: "#" },
    ],
  },
  "restaurant-brand-identity": {
    id: "restaurant-brand-identity",
    title: "Restaurant Brand Identity",
    client: "Culinary Collective",
    category: "Brand Identity",
    description: "Modern brand identity for upscale restaurant group with multiple locations",
    longDescription:
      "A sophisticated brand identity system for an upscale restaurant group operating multiple locations. We created a timeless yet contemporary brand that reflects the culinary excellence and ambiance of their establishments, from elegant typography to custom menu designs.",
    image: "/project-restaurant-brand.jpg",
    images: [
      "/project-restaurant-brand.jpg",
      "/project-restaurant-brand-2.jpg",
      "/project-restaurant-brand-3.jpg",
      "/project-restaurant-brand-4.jpg",
      "/project-restaurant-brand-5.jpg",
    ],
    tags: ["Branding", "Hospitality", "Print Design"],
    year: "2023",
    duration: "14 weeks",
    budget: "৳1,50,000 - ৳2,00,000",
    status: "Completed",
    teamMembers: ["nina-martinez", "emily-watson", "lisa-patel"],
    deliverables: [
      "Complete brand identity system",
      "Menu design templates",
      "Interior design guidelines",
      "Tableware branding",
      "Marketing materials",
    ],
    results: ["Successful expansion to 5 new locations", "Award-winning design recognition", "25% increase in reservations"],
    metrics: [
      { label: "New Locations", value: "5" },
      { label: "Reservation Increase", value: "+25%" },
      { label: "Customer Satisfaction", value: "4.9/5" },
      { label: "Revenue Growth", value: "+45%" },
    ],
    challenges: [
      "Creating cohesive brand across diverse restaurant concepts",
      "Balancing modern aesthetics with timeless elegance",
      "Designing for both print and environmental applications",
    ],
    solutions: [
      "Developed flexible brand architecture system",
      "Created elegant, minimalist design language",
      "Built comprehensive guidelines for all touchpoints",
    ],
    technologies: ["Adobe InDesign", "Illustrator", "Photoshop", "Figma"],
    timeline: [
      { phase: "Brand Strategy", duration: "2 weeks", description: "Market positioning, brand values, target audience" },
      { phase: "Visual Identity", duration: "6 weeks", description: "Logo development, color palette, typography system" },
      { phase: "Brand Applications", duration: "4 weeks", description: "Menu design, signage, interior branding" },
      { phase: "Launch & Rollout", duration: "2 weeks", description: "Brand implementation across all locations" },
    ],
    testimonial: {
      quote: "The brand identity captured our culinary philosophy perfectly and elevated our entire guest experience.",
      author: "Chef Antoine Dubois",
      role: "Owner, Culinary Collective",
    },
    awards: ["Restaurant Design Award 2023", "Best Brand Identity - Hospitality"],
  },
  "app-ui-animations": {
    id: "app-ui-animations",
    title: "App UI Animations",
    client: "FinTech Startup",
    category: "Motion Design",
    description: "Smooth UI animations and micro-interactions for mobile banking app",
    longDescription:
      "A comprehensive set of UI animations and micro-interactions for a cutting-edge mobile banking application. We focused on creating delightful user experiences through smooth transitions, intuitive feedback animations, and engaging loading states that made financial management feel effortless.",
    image: "/project-app-animations.jpg",
    images: [
      "/project-app-animations.jpg",
      "/project-app-animations-2.jpg",
      "/project-app-animations-3.jpg",
      "/project-app-animations-4.jpg",
    ],
    tags: ["UI Animation", "Mobile", "FinTech"],
    year: "2023",
    duration: "8 weeks",
    budget: "৳95,000 - ৳1,25,000",
    status: "Completed",
    teamMembers: ["david-kim", "lisa-patel"],
    deliverables: [
      "Custom UI animation library",
      "Micro-interaction guidelines",
      "Loading and transition animations",
      "Success state animations",
      "Lottie animation files",
    ],
    results: ["4.8-star app store rating", "Improved user retention by 40%", "Featured in App Store"],
    metrics: [
      { label: "App Store Rating", value: "4.8★" },
      { label: "User Retention", value: "+40%" },
      { label: "Session Time", value: "+35%" },
      { label: "NPS Score", value: "72" },
    ],
    challenges: [
      "Creating smooth 60fps animations on all devices",
      "Balancing delight with performance",
      "Ensuring accessibility compliance",
    ],
    solutions: [
      "Optimized animations using Lottie for performance",
      "Implemented progressive enhancement strategy",
      "Added reduced-motion support for accessibility",
    ],
    technologies: ["After Effects", "Lottie", "Principle", "ProtoPie", "Figma"],
    timeline: [
      { phase: "UX Research", duration: "1 week", description: "User behavior analysis, interaction patterns" },
      { phase: "Animation Design", duration: "4 weeks", description: "Creating UI animations and micro-interactions" },
      { phase: "Implementation", duration: "2 weeks", description: "Development integration and optimization" },
      { phase: "Testing & Refinement", duration: "1 week", description: "User testing and final adjustments" },
    ],
    testimonial: {
      quote: "The animations transformed our app from functional to delightful. User engagement skyrocketed.",
      author: "Rachel Kim",
      role: "Product Lead, FinTech Startup",
    },
    awards: ["App of the Day - App Store"],
  },
  "automotive-showcase": {
    id: "automotive-showcase",
    title: "Automotive Showcase",
    client: "Luxury Auto Brand",
    category: "3D Animation",
    description: "Photorealistic 3D car visualization for digital showroom experience",
    longDescription:
      "An immersive digital showroom experience featuring photorealistic 3D car visualizations. We created detailed CGI renders that allow customers to explore every angle of the vehicle, customize colors and features, and experience the luxury automotive brand in stunning detail from their devices.",
    image: "/project-automotive.jpg",
    images: [
      "/project-automotive.jpg",
      "/project-automotive-2.jpg",
      "/project-automotive-3.jpg",
      "/project-automotive-4.jpg",
      "/project-automotive-5.jpg",
      "/project-automotive-6.jpg",
    ],
    tags: ["3D Animation", "Automotive", "CGI"],
    year: "2023",
    duration: "16 weeks",
    budget: "৳3,50,000 - ৳4,50,000",
    status: "Completed",
    teamMembers: ["marcus-rodriguez", "james-thompson", "alex-nguyen"],
    deliverables: [
      "Photorealistic car renders",
      "360° interactive viewer",
      "Color customization animations",
      "Feature demonstration videos",
      "VR showroom experience",
    ],
    results: ["60% increase in online inquiries", "Industry award for digital innovation", "Adopted across dealership network"],
    metrics: [
      { label: "Online Inquiries", value: "+60%" },
      { label: "Showroom Visits", value: "+40%" },
      { label: "Configuration Time", value: "5 min avg" },
      { label: "Sales Conversion", value: "+25%" },
    ],
    challenges: [
      "Achieving photorealistic quality for luxury automotive brand",
      "Real-time rendering for interactive customization",
      "Cross-platform VR compatibility",
    ],
    solutions: [
      "Utilized high-end rendering engines for maximum realism",
      "Developed optimized LOD system for real-time interaction",
      "Implemented WebXR for universal VR compatibility",
    ],
    technologies: ["Unreal Engine", "V-Ray", "Substance Painter", "WebXR", "Three.js"],
    timeline: [
      { phase: "3D Modeling", duration: "6 weeks", description: "Detailed car modeling from CAD data" },
      { phase: "Texturing & Materials", duration: "4 weeks", description: "Photorealistic materials and paint finishes" },
      { phase: "Interactive Development", duration: "4 weeks", description: "Real-time viewer and customization tools" },
      { phase: "VR Implementation", duration: "2 weeks", description: "VR showroom experience development" },
    ],
    testimonial: {
      quote: "The digital showroom has revolutionized how we present our vehicles. Customers can now experience luxury from anywhere.",
      author: "Stefan Weber",
      role: "Digital Marketing Director, Luxury Auto Brand",
    },
    awards: ["Automotive Digital Innovation Award 2023", "Best 3D Visualization - CGI Awards"],
    links: [
      { label: "Virtual Showroom", url: "#" },
      { label: "VR Experience", url: "#" },
    ],
  },
  "music-festival-campaign": {
    id: "music-festival-campaign",
    title: "Music Festival Campaign",
    client: "Summer Sounds Festival",
    category: "Motion Design",
    description: "Vibrant motion graphics campaign for annual music festival",
    longDescription:
      "A high-energy motion graphics campaign for a major music festival. We created bold, vibrant animations that captured the electric atmosphere of live music, featuring dynamic typography, colorful transitions, and engaging social media content that drove massive ticket sales.",
    image: "/project-music-festival.jpg",
    images: [
      "/project-music-festival.jpg",
      "/project-music-festival-2.jpg",
      "/project-music-festival-3.jpg",
      "/project-music-festival-4.jpg",
      "/project-music-festival-5.jpg",
    ],
    tags: ["Motion Graphics", "Events", "Entertainment"],
    year: "2023",
    duration: "10 weeks",
    budget: "৳1,60,000 - ৳2,10,000",
    status: "Completed",
    teamMembers: ["david-kim", "sarah-chen", "lisa-patel"],
    deliverables: [
      "Festival trailer animation",
      "Artist announcement videos",
      "Social media campaign assets",
      "Stage visual elements",
      "Mobile app animations",
    ],
    results: ["Sold out in 48 hours", "10M+ social media impressions", "45% year-over-year growth"],
    metrics: [
      { label: "Tickets Sold", value: "50K (Sold Out)" },
      { label: "Social Impressions", value: "10M+" },
      { label: "Ticket Sales Growth", value: "+45%" },
      { label: "Media Value", value: "৳25M" },
    ],
    challenges: [
      "Creating content that resonates across diverse music genres",
      "Coordinating with multiple artist teams and timelines",
      "Producing high-volume content within tight deadlines",
    ],
    solutions: [
      "Developed flexible visual system adaptable to all genres",
      "Implemented efficient template-based workflow",
      "Created modular animation components for rapid production",
    ],
    technologies: ["After Effects", "Cinema 4D", "Premiere Pro", "Illustrator", "TouchDesigner"],
    timeline: [
      { phase: "Creative Development", duration: "2 weeks", description: "Concept creation, style frames, music research" },
      { phase: "Main Trailer", duration: "3 weeks", description: "Hero animation and festival announcement" },
      { phase: "Artist Content", duration: "3 weeks", description: "Individual artist announcement videos" },
      { phase: "Stage Visuals", duration: "2 weeks", description: "Live stage visual elements and LED content" },
    ],
    testimonial: {
      quote: "The visual campaign was instrumental in our fastest sellout ever. The energy was palpable in every frame.",
      author: "Marcus Johnson",
      role: "Festival Director, Summer Sounds",
    },
    awards: ["Best Event Marketing Campaign 2023"],
    links: [
      { label: "Festival Trailer", url: "#" },
      { label: "Highlight Reel", url: "#" },
    ],
  },
}

// Helper function to get all projects as an array
export const getAllProjects = (): Project[] => {
  return Object.values(projectsData)
}

// Helper function to get a project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projectsData[id]
}

// Helper function to get all project IDs
export const getAllProjectIds = (): string[] => {
  return Object.keys(projectsData)
}

// Helper function to get projects by category
export const getProjectsByCategory = (category: string): Project[] => {
  if (category === "All") {
    return getAllProjects()
  }
  return Object.values(projectsData).filter((project) => project.category === category)
}

// Helper function to get all unique categories
export const getAllCategories = (): string[] => {
  const categories = new Set<string>()
  Object.values(projectsData).forEach((project) => categories.add(project.category))
  return ["All", ...Array.from(categories)]
}

// Helper function to get projects by team member
export const getProjectsByTeamMember = (memberId: string): Project[] => {
  return Object.values(projectsData).filter(
    (project) => project.teamMembers && project.teamMembers.includes(memberId)
  )
}
