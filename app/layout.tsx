import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL('https://pqrix.com'),
  title: {
    default: "Pqrix | Best Software Development Company in Bangladesh | #1 Web, Mobile & Desktop Solutions | Top Tech Company",
    template: "%s | Pqrix - Leading Tech Company Bangladesh"
  },
  description:
    "🏆 Best & Top-rated software development company in Bangladesh. Expert tech solutions: Web Development, Mobile Apps, SaaS, Cloud, AI/ML, Blockchain, IoT, Desktop Software, 3D/XR. Award-winning IT company with 500+ projects. Local payment (bKash/Nagad). Affordable pricing from ৳8,500. Trusted by leading brands. #1 Technology partner for startups & enterprises.",
  keywords: [
    // Company & Location
    "software development company Bangladesh",
    "software company in Bangladesh",
    "IT company Bangladesh",
    "software development firm BD",
    "tech company Bangladesh",
    "software house Bangladesh",
    "software development agency",
    "custom software company",
    "software solutions provider",
    "IT solutions company",
    "technology partner",
    "digital transformation company",
    
    // Discovery & Strategy - General
    "discovery and strategy",
    "software project planning",
    "technical blueprint",
    "scope of work",
    "product roadmap",
    "software consultation",
    "project scope definition",
    "wireframing services",
    "UX flowchart",
    "software requirements analysis",
    "technical feasibility study",
    "product discovery phase",
    "project estimation",
    "software proposal",
    "technical documentation",
    "system architecture design",
    "software specification",
    "proof of concept",
    "MVP planning",
    "software audit",
    
    // Web & SaaS Development - Extensive
    "web development",
    "web application development",
    "SaaS development",
    "software as a service",
    "custom CRM development",
    "custom ERP development",
    "enterprise software",
    "business software",
    "e-commerce development",
    "online store development",
    "payment gateway integration",
    "bKash payment integration",
    "Nagad payment integration",
    "stripe integration",
    "paypal integration",
    "web portal development",
    "corporate website",
    "business website development",
    "responsive web design",
    "progressive web app",
    "PWA development",
    "API development",
    "REST API",
    "GraphQL API",
    "API integration",
    "third party integration",
    "cloud hosting",
    "cloud migration",
    "cloud infrastructure",
    "devops services",
    "continuous integration",
    "continuous deployment",
    "full stack development",
    "backend development",
    "frontend development",
    "MEAN stack",
    "MERN stack",
    "LAMP stack",
    "node.js development",
    "react development",
    "angular development",
    "vue.js development",
    "laravel development",
    "django development",
    "php development",
    "python development",
    "ruby on rails",
    "dotnet development",
    
    // Mobile App Development - Comprehensive
    "mobile app development",
    "iOS app development",
    "iPhone app development",
    "iPad app development",
    "Android app development",
    "cross-platform app development",
    "hybrid app development",
    "native app development",
    "mobile application company",
    "app development company",
    "Flutter development",
    "React Native development",
    "ionic development",
    "xamarin development",
    "swift development",
    "kotlin development",
    "mobile app design",
    "app UI UX design",
    "app store optimization",
    "app store submission",
    "play store submission",
    "mobile backend",
    "push notification",
    "in-app purchase",
    "mobile analytics",
    "app maintenance",
    "app testing",
    "QA testing",
    "beta testing",
    "mobile security",
    "app monetization",
    
    // Custom 3D Web & XR - Extensive
    "3D web development",
    "WebGL development",
    "Three.js development",
    "3D website",
    "interactive 3D",
    "3D visualization",
    "virtual tour",
    "360 virtual tour",
    "3D product viewer",
    "product configurator",
    "immersive web experience",
    "XR development",
    "augmented reality",
    "AR development",
    "virtual reality",
    "VR development",
    "mixed reality",
    "metaverse development",
    "3D modeling for web",
    "real-time 3D",
    "browser-based 3D",
    "canvas development",
    "babylon.js",
    "A-frame development",
    "webXR",
    
    // Desktop Application - Comprehensive
    "desktop application development",
    "Windows app development",
    "macOS app development",
    "linux app development",
    "cross-platform desktop",
    "electron development",
    "desktop software",
    "enterprise application",
    "internal tools development",
    "data management software",
    "inventory management",
    "POS system",
    "point of sale software",
    "accounting software",
    "billing software",
    "CRM desktop",
    "ERP desktop",
    "desktop automation",
    "legacy software modernization",
    "software migration",
    "desktop to web migration",
    
    // Services & Features - Universal
    "fixed price software development",
    "affordable software development",
    "cost-effective development",
    "budget-friendly software",
    "custom software solutions",
    "bespoke software",
    "tailor-made software",
    "software outsourcing",
    "offshore development",
    "nearshore development",
    "remote development team",
    "dedicated development team",
    "software MVP development",
    "minimum viable product",
    "rapid prototyping",
    "agile development",
    "scrum development",
    "waterfall methodology",
    "software maintenance",
    "software support",
    "bug fixing",
    "software updates",
    "feature enhancement",
    "software optimization",
    "performance tuning",
    "code refactoring",
    "technical debt reduction",
    "software scaling",
    "load balancing",
    
    // Industry Solutions - Broad
    "fintech development",
    "financial software",
    "banking software",
    "insurance software",
    "e-commerce solutions",
    "retail software solutions",
    "healthcare software",
    "hospital management system",
    "telemedicine platform",
    "education software",
    "e-learning platform",
    "LMS development",
    "learning management system",
    "logistics software",
    "supply chain management",
    "warehouse management",
    "fleet management",
    "real estate software",
    "property management",
    "hospitality software",
    "hotel management system",
    "restaurant software",
    "food delivery app",
    "social media platform",
    "marketplace development",
    "booking system",
    "appointment scheduling",
    "CMS development",
    "content management system",
    "HR management software",
    "payroll software",
    "project management software",
    "task management",
    "collaboration tools",
    
    // Technology Stack - Keywords
    "javascript development",
    "typescript development",
    "html5 development",
    "css3 development",
    "bootstrap development",
    "tailwind css",
    "material design",
    "sass development",
    "webpack",
    "vite",
    "next.js development",
    "nuxt.js development",
    "gatsby development",
    "express.js",
    "nest.js",
    "fastify",
    "spring boot",
    "mysql development",
    "postgresql",
    "mongodb",
    "redis",
    "elasticsearch",
    "firebase development",
    "supabase",
    "aws development",
    "azure development",
    "google cloud",
    "docker",
    "kubernetes",
    "microservices",
    "serverless",
    "lambda functions",
    
    // Software Types
    "web application",
    "mobile application",
    "desktop application",
    "cloud application",
    "enterprise software",
    "business intelligence",
    "data analytics",
    "dashboard development",
    "admin panel",
    "user portal",
    "customer portal",
    "vendor portal",
    "B2B software",
    "B2C software",
    "B2B2C platform",
    "multi-tenant software",
    "white label software",
    "franchise software",
    
    // Development Processes
    "software development lifecycle",
    "SDLC",
    "requirement gathering",
    "system design",
    "database design",
    "UI design",
    "UX design",
    "user interface",
    "user experience",
    "interaction design",
    "prototyping",
    "mockup design",
    "coding",
    "programming",
    "testing",
    "quality assurance",
    "deployment",
    "go-live",
    "post-launch support",
    
    // Business Terms
    "digital solution",
    "business automation",
    "workflow automation",
    "process automation",
    "digital transformation",
    "software integration",
    "system integration",
    "data migration",
    "software upgrade",
    "technology consulting",
    "IT consulting",
    "software architect",
    "solution architect",
    "technical lead",
    "software engineer",
    "programmer",
    "developer",
    "coder",
    
    // Quality & Security
    "secure software",
    "data security",
    "encryption",
    "authentication",
    "authorization",
    "RBAC",
    "role based access",
    "two factor authentication",
    "OAuth integration",
    "GDPR compliant",
    "HIPAA compliant",
    "PCI DSS",
    "penetration testing",
    "security audit",
    "vulnerability assessment",
    "code review",
    "peer review",
    "clean code",
    "best practices",
    "coding standards",
    "software quality",
    "high performance",
    "scalable software",
    "reliable software",
    "maintainable code",
    
    // Client-focused
    "software for startups",
    "startup software",
    "SME software",
    "small business software",
    "enterprise solutions",
    "corporate software",
    "government software",
    "NGO software",
    "non-profit software",
    "software for agencies",
    "white label solutions",
    
    // Best/Top Rankings - Critical for "best software company" searches
    "best software company in Bangladesh",
    "best software development company Bangladesh",
    "top software company in Bangladesh",
    "top software development company BD",
    "best IT company Bangladesh",
    "top IT company Bangladesh",
    "best tech company Bangladesh",
    "top tech company Bangladesh",
    "leading software company Bangladesh",
    "top rated software company",
    "best web development company Bangladesh",
    "best mobile app development company Bangladesh",
    "best software house Bangladesh",
    "top software firm Bangladesh",
    "award winning software company",
    "trusted software company Bangladesh",
    "reliable software company",
    "professional software company",
    "#1 software company Bangladesh",
    "number 1 software company",
    "premier software company",
    "elite software company",
    
    // Technology Keywords - Broad Coverage for ANY tech search
    "technology",
    "tech",
    "IT",
    "information technology",
    "software",
    "hardware",
    "computer science",
    "computer engineering",
    "IT solutions",
    "tech solutions",
    "technology solutions",
    "digital solutions",
    "innovation",
    "tech innovation",
    "digital innovation",
    
    // Emerging Tech - AI, ML, Blockchain, IoT, etc.
    "artificial intelligence",
    "AI development",
    "machine learning",
    "ML development",
    "deep learning",
    "neural networks",
    "natural language processing",
    "NLP",
    "computer vision",
    "chatbot development",
    "AI chatbot",
    "conversational AI",
    "blockchain development",
    "cryptocurrency",
    "smart contracts",
    "web3 development",
    "NFT development",
    "DeFi platform",
    "IoT development",
    "Internet of Things",
    "IoT solutions",
    "smart home",
    "industrial IoT",
    "edge computing",
    "quantum computing",
    "big data",
    "data science",
    "data analytics",
    "business intelligence",
    "predictive analytics",
    "data visualization",
    "data warehouse",
    "ETL development",
    
    // Cloud & DevOps - Comprehensive
    "cloud computing",
    "cloud solutions",
    "cloud services",
    "AWS",
    "Amazon Web Services",
    "Microsoft Azure",
    "Google Cloud Platform",
    "GCP",
    "cloud migration",
    "cloud architecture",
    "cloud native",
    "serverless computing",
    "function as a service",
    "FaaS",
    "platform as a service",
    "PaaS",
    "infrastructure as a service",
    "IaaS",
    "DevOps",
    "CI/CD",
    "continuous integration",
    "continuous deployment",
    "docker containers",
    "kubernetes orchestration",
    "microservices architecture",
    "containerization",
    "infrastructure automation",
    "configuration management",
    "terraform",
    "ansible",
    "jenkins",
    "gitlab CI",
    "github actions",
    
    // Cybersecurity & Privacy
    "cybersecurity",
    "information security",
    "network security",
    "application security",
    "web security",
    "mobile security",
    "cloud security",
    "data protection",
    "privacy compliance",
    "GDPR compliance",
    "HIPAA compliance",
    "ISO 27001",
    "penetration testing",
    "ethical hacking",
    "security audit",
    "vulnerability assessment",
    "threat detection",
    "incident response",
    "security monitoring",
    "firewall",
    "intrusion detection",
    "encryption services",
    "SSL certificate",
    "two-factor authentication",
    "biometric authentication",
    
    // Database & Storage
    "database development",
    "database design",
    "database optimization",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "NoSQL database",
    "SQL database",
    "Redis",
    "Elasticsearch",
    "Cassandra",
    "Oracle database",
    "SQL Server",
    "database migration",
    "database administration",
    "DBA services",
    "data modeling",
    "database tuning",
    "query optimization",
    "data storage",
    "cloud storage",
    "object storage",
    "block storage",
    
    // UI/UX & Design
    "UI UX design",
    "user interface design",
    "user experience design",
    "graphic design",
    "web design",
    "mobile app design",
    "product design",
    "interaction design",
    "visual design",
    "design thinking",
    "wireframing",
    "prototyping",
    "figma design",
    "adobe XD",
    "sketch design",
    "responsive design",
    "mobile-first design",
    "accessibility design",
    "usability testing",
    "A/B testing",
    "conversion optimization",
    "branding",
    "logo design",
    "brand identity",
    
    // E-commerce & Digital Marketing
    "e-commerce development",
    "online store",
    "shopping cart",
    "payment gateway",
    "digital payment",
    "mobile payment",
    "bKash integration",
    "Nagad integration",
    "Rocket integration",
    "Stripe payment",
    "PayPal integration",
    "SSL Commerz",
    "payment processing",
    "inventory management system",
    "order management",
    "shipping integration",
    "marketplace platform",
    "multi-vendor marketplace",
    "B2B marketplace",
    "B2C ecommerce",
    "headless commerce",
    "shopify development",
    "woocommerce development",
    "magento development",
    "digital marketing",
    "SEO services",
    "search engine optimization",
    "SEM",
    "search engine marketing",
    "social media marketing",
    "content marketing",
    "email marketing",
    "marketing automation",
    "CRM integration",
    "analytics integration",
    "Google Analytics",
    "Facebook Pixel",
    
    // Gaming & Entertainment
    "game development",
    "mobile game",
    "web game",
    "2D game",
    "3D game",
    "Unity development",
    "Unreal Engine",
    "game design",
    "multiplayer game",
    "casual games",
    "AR games",
    "VR games",
    "esports platform",
    "gaming server",
    "video streaming",
    "live streaming",
    "OTT platform",
    "media streaming",
    "content delivery network",
    "CDN",
    "video processing",
    "audio processing",
    
    // Enterprise & Business Tools
    "enterprise resource planning",
    "ERP system",
    "customer relationship management",
    "CRM system",
    "human resource management",
    "HRMS",
    "payroll management",
    "attendance system",
    "leave management",
    "performance management",
    "recruitment software",
    "ATS",
    "applicant tracking system",
    "project management tool",
    "time tracking",
    "expense management",
    "invoice management",
    "accounting software",
    "financial management",
    "budgeting software",
    "reporting dashboard",
    "business analytics",
    "KPI dashboard",
    "workflow management",
    "document management system",
    "DMS",
    "electronic signature",
    "contract management",
    "vendor management",
    "procurement system",
    
    // Automation & Integration
    "automation",
    "business process automation",
    "robotic process automation",
    "RPA",
    "workflow automation",
    "task automation",
    "email automation",
    "marketing automation",
    "sales automation",
    "API integration",
    "third-party integration",
    "webhook integration",
    "Zapier integration",
    "IFTTT",
    "middleware development",
    "integration platform",
    "iPaaS",
    "data integration",
    "system integration",
    "legacy system integration",
    
    // Location-specific & Local SEO
    "software company Dhaka",
    "IT company Dhaka",
    "tech company Dhaka",
    "Dhaka software development",
    "Bangladesh software industry",
    "Bangladeshi IT company",
    "Bangladesh tech startup",
    "outsourcing to Bangladesh",
    "offshore development Bangladesh",
    "nearshore Bangladesh",
    "Bangladesh IT sector",
    "South Asian software company",
    "Asian IT company",
    "affordable software development Asia",
    "quality software Bangladesh",
    
    // Service Delivery & Quality
    "agile methodology",
    "scrum framework",
    "kanban",
    "lean development",
    "DevOps culture",
    "continuous improvement",
    "code quality",
    "clean code",
    "SOLID principles",
    "design patterns",
    "software architecture patterns",
    "test-driven development",
    "TDD",
    "behavior-driven development",
    "BDD",
    "unit testing",
    "integration testing",
    "end-to-end testing",
    "automated testing",
    "manual testing",
    "performance testing",
    "load testing",
    "stress testing",
    "security testing",
    "regression testing",
    "smoke testing",
    "sanity testing",
    
    // Support & Maintenance
    "technical support",
    "IT support",
    "software maintenance",
    "application maintenance",
    "bug fixing service",
    "software updates",
    "version upgrade",
    "patch management",
    "monitoring service",
    "24/7 support",
    "helpdesk",
    "IT helpdesk",
    "incident management",
    "problem management",
    "change management",
    "release management",
    "SLA",
    "service level agreement",
    
    // Consultation & Advisory
    "IT consultation",
    "technology consultation",
    "software consultation",
    "digital transformation consulting",
    "cloud consulting",
    "security consulting",
    "architecture consulting",
    "strategy consulting",
    "technical advisory",
    "technology advisory",
    "CTO as a service",
    "fractional CTO",
    "IT audit",
    "technology assessment",
    "vendor selection",
    "technology evaluation"
  ],
  authors: [{ name: "Pqrix Studio" }],
  creator: "Pqrix",
  publisher: "Pqrix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pqrix.com",
    siteName: "Pqrix",
    title: "Pqrix | Professional Software Development Company in Bangladesh",
    description: "Expert software development services in Bangladesh: Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, Desktop Applications. Local payment integration (bKash/Nagad). Starting ৳8,500.",
    images: [
      {
        url: "/icons/pqrix-logo.png",
        width: 1200,
        height: 630,
        alt: "Pqrix - Software Development Company Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pqrix | Software Development Company in Bangladesh",
    description: "Leading software development company offering Web/SaaS, Mobile Apps, 3D Web/XR, and Desktop Solutions in Bangladesh. bKash/Nagad integration available.",
    images: ["/icons/pqrix-logo.png"],
    creator: "@pqrix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/pqrix-ico.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icons/pqrix-ico.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icons/pqrix-ico.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/pqrix-ico.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    apple: [
      { url: "/icons/pqrix-icon.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/icons/pqrix-ico.ico", sizes: "192x192", type: "image/x-icon" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/pqrix-icon.svg",
        color: "#10B981",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://pqrix.com",
  },
  category: "Software Development Services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Font Preload */}
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />

        {/* Structured Data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Pqrix",
              alternateName: ["Pqrix Software", "Pqrix Tech", "Pqrix Bangladesh"],
              url: "https://pqrix.com",
              logo: "https://pqrix.com/icons/pqrix-logo.png",
              description: "Best and top-rated software development company in Bangladesh. Expert in Web Development, Mobile Apps, SaaS, AI/ML, Blockchain, IoT, Cloud Computing, Desktop Software, and 3D/XR solutions. Award-winning technology partner serving 500+ clients worldwide.",
              foundingDate: "2020",
              slogan: "Premium Custom Software Solutions For Your Business",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix",
                "https://linkedin.com/company/pqrix",
                "https://facebook.com/pqrix",
                "https://github.com/pqrix"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+880-1401-658685",
                contactType: "customer service",
                contactOption: ["TollFree", "HearingImpairedSupported"],
                availableLanguage: ["English", "Bengali"],
                areaServed: ["BD", "US", "GB", "CA", "AU", "SG", "AE"],
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "00:00",
                  closes: "23:59"
                }
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka",
                addressLocality: "Dhaka"
              },
              areaServed: [
                { "@type": "Country", name: "Bangladesh" },
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "Australia" },
                { "@type": "Country", name: "Singapore" },
                { "@type": "Country", name: "United Arab Emirates" }
              ],
              serviceType: [
                "Software Development",
                "Web Development",
                "Mobile App Development",
                "SaaS Development",
                "Cloud Computing",
                "AI & Machine Learning",
                "Blockchain Development",
                "IoT Solutions",
                "Desktop Application Development",
                "3D Web Development",
                "WebGL Development",
                "AR/VR Development",
                "E-commerce Development",
                "Digital Transformation",
                "IT Consulting",
                "DevOps Services",
                "Cybersecurity",
                "UI/UX Design",
                "API Development",
                "Database Development"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Software Development Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Discovery & Strategy",
                      description: "Technical blueprint, wireframing, and project planning"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Web & SaaS Development",
                      description: "Custom web applications, CRM, ERP, and cloud solutions"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mobile App Development",
                      description: "iOS, Android, and cross-platform applications"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI & ML Solutions",
                      description: "Artificial Intelligence and Machine Learning implementation"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Blockchain Development",
                      description: "Smart contracts, DeFi, NFT, and Web3 solutions"
                    }
                  }
                ]
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "500",
                bestRating: "5",
                worstRating: "1"
              },
              priceRange: "৳৳৳",
              paymentAccepted: ["bKash", "Nagad", "Rocket", "Bank Transfer", "Cash", "Credit Card", "PayPal"],
              currenciesAccepted: "BDT, USD, EUR, GBP"
            })
          }}
        />

        {/* Structured Data for Professional Service */}
        <Script
          id="service-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Pqrix Software Development",
              image: "https://pqrix.com/icons/pqrix-logo.png",
              "@id": "https://pqrix.com",
              url: "https://pqrix.com",
              telephone: "+880-1401-658685",
              priceRange: "৳8,500 - ৳5,00,000+",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka",
                addressLocality: "Dhaka"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 23.8103,
                longitude: 90.4125
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                opens: "00:00",
                closes: "23:59"
              },
              paymentAccepted: ["bKash", "Nagad", "Rocket", "Bank Transfer", "Cash", "Credit Card"],
              currenciesAccepted: "BDT, USD",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Tech Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Web Development",
                      provider: { "@type": "Organization", name: "Pqrix" },
                      areaServed: "Worldwide",
                      availableChannel: { "@type": "ServiceChannel", serviceUrl: "https://pqrix.com/services" }
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mobile App Development",
                      provider: { "@type": "Organization", name: "Pqrix" },
                      areaServed: "Worldwide"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Cloud Computing",
                      provider: { "@type": "Organization", name: "Pqrix" },
                      areaServed: "Worldwide"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI & Machine Learning",
                      provider: { "@type": "Organization", name: "Pqrix" },
                      areaServed: "Worldwide"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* LocalBusiness Schema for Bangladesh Local SEO */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Pqrix - Best Software Company in Bangladesh",
              description: "Top-rated software development company in Bangladesh. Expert in web, mobile, cloud, AI/ML, and blockchain solutions.",
              image: "https://pqrix.com/icons/pqrix-logo.png",
              telephone: "+880-1401-658685",
              email: "info@pqrix.com",
              address: {
                "@type": "PostalAddress",
                addressCountry: "Bangladesh",
                addressRegion: "Dhaka Division",
                addressLocality: "Dhaka"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 23.8103,
                longitude: 90.4125
              },
              url: "https://pqrix.com",
              priceRange: "৳৳৳",
              openingHours: "Mo-Su 00:00-23:59",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "500"
              }
            })
          }}
        />

        {/* BreadcrumbList for better navigation understanding */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://pqrix.com"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: "https://pqrix.com/services"
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Projects",
                  item: "https://pqrix.com/projects"
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Team",
                  item: "https://pqrix.com/team"
                }
              ]
            })
          }}
        />

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>

        {/* Theme initialization script - prevents flash */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.add(theme);
            } catch (e) {
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
      </head>
      <body>
        <Providers>
          {/* Plasma background - hidden on mobile devices for better performance */}
          <div className="fixed inset-0 z-0 bg-white dark:bg-black">
            {/* <div className="hidden min-[500px]:block h-full w-full">
              <Plasma
                color="#8b5cf6"
                speed={0.8}
                direction="forward"
                scale={1.5}
                opacity={0.4}
                mouseInteractive={true}
              />
            </div> */}
          </div>
          <div className="relative z-10">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
