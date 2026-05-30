/**
 * Comprehensive SEO Configuration for CodebySRS
 * Optimized for Google Search Console and maximum search visibility
 */

export const SEO_CONFIG = {
  // Site Information
  siteName: "CodebySRS",
  siteUrl: "https://codebysrs.com", // Update with your actual domain
  author: "CodebySRS",
  
  // Default Meta
  defaultTitle: "CodebySRS - Professional Web Development & 3D Solutions",
  defaultDescription: "CodebySRS delivers cutting-edge web development, 3D web experiences, and full-stack solutions. Expert in React, Three.js, WebGL, Node.js, and modern web technologies. Transform your digital presence with immersive, high-performance web applications.",
  
  // Admin Panel
  adminTitle: "CodebySRS | Admin",
  adminDescription: "Admin dashboard for CodebySRS portfolio management. Manage projects, skills, testimonials, and content.",
  
  // Comprehensive Keywords (100+ keywords for maximum visibility)
  keywords: [
    // Core Services
    "web development",
    "web developer",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "software engineer",
    "web designer",
    "UI/UX developer",
    
    // Technologies - Frontend
    "React developer",
    "React.js development",
    "Next.js developer",
    "Vue.js developer",
    "Angular developer",
    "TypeScript developer",
    "JavaScript developer",
    "HTML5 developer",
    "CSS3 developer",
    "Tailwind CSS",
    "responsive web design",
    "mobile-first design",
    "progressive web app",
    "PWA development",
    
    // Technologies - 3D & Graphics
    "Three.js developer",
    "WebGL developer",
    "3D web development",
    "3D website design",
    "interactive 3D experiences",
    "WebGL animation",
    "GLSL shader programming",
    "3D visualization",
    "immersive web experiences",
    "3D portfolio website",
    "WebXR development",
    "virtual reality web",
    "augmented reality web",
    
    // Technologies - Backend
    "Node.js developer",
    "Express.js developer",
    "REST API development",
    "GraphQL developer",
    "PostgreSQL developer",
    "MongoDB developer",
    "database design",
    "API integration",
    "microservices architecture",
    "serverless development",
    
    // Technologies - Tools & Platforms
    "Git version control",
    "Docker containerization",
    "AWS cloud services",
    "Vercel deployment",
    "Firebase development",
    "CI/CD pipeline",
    "Webpack configuration",
    "Vite build tool",
    
    // Project Types
    "portfolio website",
    "e-commerce development",
    "SaaS application",
    "web application development",
    "custom web solutions",
    "enterprise web development",
    "startup web development",
    "landing page design",
    "corporate website",
    "business website",
    
    // Services
    "website development services",
    "web app development",
    "custom software development",
    "web design services",
    "UI/UX design",
    "website redesign",
    "website maintenance",
    "web performance optimization",
    "SEO optimization",
    "website speed optimization",
    
    // Specializations
    "interactive websites",
    "animated websites",
    "creative web development",
    "modern web design",
    "minimalist web design",
    "brutalist web design",
    "experimental web design",
    "award-winning web design",
    
    // Industry Terms
    "freelance web developer",
    "remote web developer",
    "web development agency",
    "digital solutions",
    "web technology",
    "web innovation",
    "cutting-edge web development",
    "professional web services",
    
    // Location-based (customize for your location)
    "web developer near me",
    "local web developer",
    "web development company",
    
    // Problem-solving Keywords
    "hire web developer",
    "web development expert",
    "experienced web developer",
    "skilled web developer",
    "reliable web developer",
    "affordable web development",
    "quality web development",
    "fast web development",
    
    // Specific Solutions
    "real-time web applications",
    "data visualization",
    "dashboard development",
    "admin panel development",
    "CMS development",
    "headless CMS",
    "JAMstack development",
    
    // Performance & Quality
    "high-performance websites",
    "scalable web applications",
    "secure web development",
    "accessible web design",
    "WCAG compliance",
    "cross-browser compatibility",
    "mobile responsive design",
    
    // Emerging Technologies
    "AI integration",
    "machine learning web apps",
    "blockchain web development",
    "Web3 development",
    "NFT platform development",
    
    // Content Types
    "web development portfolio",
    "developer portfolio",
    "creative portfolio",
    "case studies",
    "web development projects",
    
    // Brand
    "CodebySRS",
    "Code by SRS",
    "SRS developer",
    "SRS web solutions",
  ],
  
  // Social Media
  social: {
    twitter: "@codebysrs",
    github: "codebysrs",
    linkedin: "codebysrs",
  },
  
  // Structured Data
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodebySRS",
    url: "https://codebysrs.com",
    logo: "https://codebysrs.com/logo.png",
    sameAs: [
      "https://github.com/codebysrs",
      "https://linkedin.com/in/codebysrs",
      "https://twitter.com/codebysrs",
    ],
  },
  
  // Person Schema (for personal portfolio)
  person: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "CodebySRS",
    url: "https://codebysrs.com",
    jobTitle: "Full Stack Developer & 3D Web Specialist",
    description: "Professional web developer specializing in React, Three.js, and modern web technologies",
    sameAs: [
      "https://github.com/codebysrs",
      "https://linkedin.com/in/codebysrs",
      "https://twitter.com/codebysrs",
    ],
  },
};

// Generate keywords string
export const getKeywordsString = () => SEO_CONFIG.keywords.join(", ");

// Get page-specific SEO
export const getPageSEO = (page: string) => {
  const baseKeywords = SEO_CONFIG.keywords.slice(0, 50); // Use top 50 keywords for all pages
  
  switch (page) {
    case "home":
      return {
        title: SEO_CONFIG.defaultTitle,
        description: SEO_CONFIG.defaultDescription,
        keywords: getKeywordsString(),
      };
    
    case "admin":
      return {
        title: SEO_CONFIG.adminTitle,
        description: SEO_CONFIG.adminDescription,
        keywords: baseKeywords.join(", "),
      };
    
    case "projects":
      return {
        title: `Projects - ${SEO_CONFIG.siteName}`,
        description: "Explore our portfolio of web development projects featuring React, Three.js, WebGL, and modern web technologies. View case studies and live demos.",
        keywords: [
          ...baseKeywords,
          "web development projects",
          "portfolio projects",
          "case studies",
          "project showcase",
        ].join(", "),
      };
    
    case "about":
      return {
        title: `About - ${SEO_CONFIG.siteName}`,
        description: "Learn about CodebySRS - a professional web developer specializing in full-stack development, 3D web experiences, and modern web technologies.",
        keywords: [
          ...baseKeywords,
          "about developer",
          "web developer bio",
          "developer experience",
        ].join(", "),
      };
    
    case "contact":
      return {
        title: `Contact - ${SEO_CONFIG.siteName}`,
        description: "Get in touch with CodebySRS for web development services, project inquiries, and collaboration opportunities. Let's build something amazing together.",
        keywords: [
          ...baseKeywords,
          "contact developer",
          "hire developer",
          "web development inquiry",
        ].join(", "),
      };
    
    default:
      return {
        title: SEO_CONFIG.defaultTitle,
        description: SEO_CONFIG.defaultDescription,
        keywords: getKeywordsString(),
      };
  }
};
