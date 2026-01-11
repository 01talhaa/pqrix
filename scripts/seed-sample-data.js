// Script to seed sample insights and job postings for testing
// Run with: node scripts/seed-data.js

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-uri"

const sampleInsights = [
  {
    id: `insight-${Date.now()}-1`,
    title: "The Future of Web Development: WebAssembly and Beyond",
    excerpt: "Explore how WebAssembly is revolutionizing web performance and opening new possibilities for browser-based applications.",
    content: `# The Future of Web Development

WebAssembly (Wasm) is transforming how we build high-performance web applications. This comprehensive guide explores...

## Performance Benefits
- Near-native execution speed
- Smaller bundle sizes
- Better resource utilization

## Use Cases
1. Game Development
2. Video Editing
3. CAD Applications
4. Scientific Computing

Learn how to integrate WebAssembly into your Next.js projects today!`,
    category: "technology",
    author: {
      name: "Sarah Johnson",
      role: "Lead Software Architect",
      avatar: "/team/sarah.jpg"
    },
    coverImage: "/insights/webassembly.jpg",
    slug: "future-web-development-webassembly",
    tags: ["WebAssembly", "Performance", "Web Development", "JavaScript"],
    readTime: 8,
    publishedAt: new Date(),
    featured: true,
    status: "published",
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `insight-${Date.now()}-2`,
    title: "Building Scalable SaaS Platforms: Lessons from the Field",
    excerpt: "Real-world insights on architecture patterns, database design, and scaling strategies for successful SaaS products.",
    content: `# Building Scalable SaaS Platforms

After building dozens of SaaS platforms, we've learned invaluable lessons about scalability...

## Key Principles
- Multi-tenancy architecture
- Database sharding strategies
- Caching layers
- Event-driven design

## Tech Stack Recommendations
- Next.js for frontend
- Node.js/Python for backend
- PostgreSQL for data
- Redis for caching
- RabbitMQ for queuing`,
    category: "product",
    author: {
      name: "Michael Chen",
      role: "CTO",
      avatar: "/team/michael.jpg"
    },
    coverImage: "/insights/saas-architecture.jpg",
    slug: "building-scalable-saas-platforms",
    tags: ["SaaS", "Architecture", "Scalability", "Cloud"],
    readTime: 12,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    featured: true,
    status: "published",
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `insight-${Date.now()}-3`,
    title: "AI-Powered Development: How We Use ChatGPT in Our Workflow",
    excerpt: "Discover how AI tools are accelerating our development process and improving code quality across our teams.",
    content: `# AI-Powered Development

AI is no longer the future—it's here and transforming how we write code...

## Our AI Stack
- GitHub Copilot for code completion
- ChatGPT for architecture discussions
- Cursor for AI-assisted coding
- AI code review tools

## Results
- 40% faster development
- Fewer bugs in production
- Better documentation
- More creative solutions`,
    category: "company",
    author: {
      name: "Emily Rodriguez",
      role: "VP of Engineering",
      avatar: "/team/emily.jpg"
    },
    coverImage: "/insights/ai-development.jpg",
    slug: "ai-powered-development-chatgpt-workflow",
    tags: ["AI", "ChatGPT", "Development", "Productivity"],
    readTime: 6,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    featured: false,
    status: "published",
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const sampleJobs = [
  {
    id: `job-${Date.now()}-1`,
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Dhaka, Bangladesh",
    type: "full-time",
    experience: "5+ years",
    description: "Join our elite engineering team to build cutting-edge web applications that serve millions of users worldwide. You'll work with modern technologies and lead architectural decisions.",
    requirements: [
      "5+ years of professional software development experience",
      "Expert knowledge of React, Next.js, and TypeScript",
      "Strong backend experience with Node.js or Python",
      "Experience with PostgreSQL/MongoDB databases",
      "Solid understanding of system design and architecture",
      "Experience with cloud platforms (AWS/GCP/Azure)",
      "Strong problem-solving and debugging skills"
    ],
    responsibilities: [
      "Design and implement scalable full-stack applications",
      "Lead technical discussions and code reviews",
      "Mentor junior developers",
      "Collaborate with product and design teams",
      "Optimize application performance and scalability",
      "Write clean, maintainable, and well-tested code"
    ],
    niceToHave: [
      "Experience with WebGL/Three.js for 3D applications",
      "Knowledge of DevOps and CI/CD pipelines",
      "Open source contributions",
      "Experience with microservices architecture"
    ],
    benefits: [
      "Competitive salary (৳80,000 - ৳150,000/month)",
      "Performance bonuses",
      "Flexible work hours",
      "Remote work options",
      "Health insurance",
      "Learning and development budget",
      "Modern office with latest equipment"
    ],
    salaryRange: {
      min: 80000,
      max: 150000,
      currency: "BDT"
    },
    status: "active",
    featured: true,
    remote: true,
    applicationsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `job-${Date.now()}-2`,
    title: "UI/UX Designer",
    department: "Design",
    location: "Dhaka, Bangladesh",
    type: "full-time",
    experience: "3+ years",
    description: "We're looking for a creative UI/UX designer to craft beautiful, user-friendly interfaces that delight our clients and their customers.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Expert knowledge of Figma and design systems",
      "Strong portfolio demonstrating exceptional design skills",
      "Understanding of user-centered design principles",
      "Experience with prototyping and user testing",
      "Knowledge of HTML/CSS is a plus"
    ],
    responsibilities: [
      "Create wireframes, mockups, and prototypes",
      "Design user interfaces for web and mobile applications",
      "Conduct user research and usability testing",
      "Collaborate with developers to ensure design implementation",
      "Maintain and evolve design systems",
      "Present design concepts to stakeholders"
    ],
    niceToHave: [
      "Motion design skills",
      "3D design experience",
      "Illustration skills",
      "Experience with design tokens"
    ],
    benefits: [
      "Competitive salary (৳50,000 - ৳100,000/month)",
      "Creative freedom",
      "Latest design tools and software",
      "Collaborative work environment",
      "Professional development opportunities"
    ],
    salaryRange: {
      min: 50000,
      max: 100000,
      currency: "BDT"
    },
    status: "active",
    featured: true,
    remote: false,
    applicationsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `job-${Date.now()}-3`,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Dhaka, Bangladesh",
    type: "full-time",
    experience: "4+ years",
    description: "Help us build and maintain robust infrastructure that powers our applications. You'll work with cutting-edge cloud technologies and automation tools.",
    requirements: [
      "4+ years of DevOps/SRE experience",
      "Strong experience with AWS or GCP",
      "Proficient in Docker and Kubernetes",
      "Experience with CI/CD pipelines (GitHub Actions, GitLab CI)",
      "Knowledge of infrastructure as code (Terraform/CloudFormation)",
      "Strong Linux/Unix administration skills",
      "Scripting skills (Bash, Python)"
    ],
    responsibilities: [
      "Design and maintain cloud infrastructure",
      "Implement CI/CD pipelines",
      "Monitor system performance and reliability",
      "Automate deployment processes",
      "Ensure security and compliance",
      "Troubleshoot production issues"
    ],
    niceToHave: [
      "Kubernetes certification",
      "Experience with service mesh (Istio)",
      "Knowledge of monitoring tools (Prometheus, Grafana)",
      "Experience with serverless architectures"
    ],
    benefits: [
      "Competitive salary (৳70,000 - ৳130,000/month)",
      "Cutting-edge technology stack",
      "Flexible hours",
      "Remote work options",
      "Professional certifications sponsored"
    ],
    salaryRange: {
      min: 70000,
      max: 130000,
      currency: "BDT"
    },
    status: "active",
    featured: false,
    remote: true,
    applicationsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

console.log("Sample Insights:", JSON.stringify(sampleInsights, null, 2))
console.log("\n\nSample Jobs:", JSON.stringify(sampleJobs, null, 2))

console.log("\n\n=== To seed this data ===")
console.log("1. Go to admin panel")
console.log("2. Or use MongoDB Compass/Atlas to insert these documents")
console.log("3. Collection names: 'insights' and 'job_postings'")
