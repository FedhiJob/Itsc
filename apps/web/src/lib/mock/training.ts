// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the Training Programs pages. It
// conforms to the shared contracts in @itsc/shared so that swapping to API data
// requires no component changes.

import type {
  TrainingCategory,
  TrainingProgramDetail,
  TrainingProgramsContent
} from "@itsc/shared";

export const trainingCategories: TrainingCategory[] = [
  {
    id: "cat-ai",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description:
      "Machine learning, deep learning, NLP, computer vision, and AI application development.",
    count: 6
  },
  {
    id: "cat-cloud",
    name: "Cloud Computing",
    slug: "cloud-computing",
    description:
      "AWS, Azure, Google Cloud, DevOps, containerization, and cloud architecture.",
    count: 5
  },
  {
    id: "cat-sec",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Network security, ethical hacking, incident response, compliance, and risk management.",
    count: 4
  },
  {
    id: "cat-dev",
    name: "Software Development",
    slug: "software-development",
    description:
      "Full-stack development, mobile apps, API design, testing, and agile methodologies.",
    count: 5
  },
  {
    id: "cat-data",
    name: "Data Science",
    slug: "data-science",
    description:
      "Data analysis, visualization, big data tools, statistical modeling, and business intelligence.",
    count: 3
  },
  {
    id: "cat-it",
    name: "IT Management",
    slug: "it-management",
    description:
      "Project management, ITIL, service delivery, governance, and digital transformation leadership.",
    count: 3
  }
];

export const trainingPrograms: TrainingProgramDetail[] = [
  {
    id: "prog-ai-foundations",
    title: "AI Foundations",
    slug: "ai-foundations",
    shortDescription:
      "Understand core AI concepts, neural networks, and build your first machine learning models.",
    fullDescription:
      "This comprehensive introductory course covers the fundamental concepts of artificial intelligence, including machine learning, neural networks, natural language processing, and computer vision. Through hands-on projects and real-world case studies, participants will gain practical experience building and deploying AI models.",
    duration: "6 weeks",
    deliveryMode: "Online",
    level: "Beginner",
    isFeatured: true,
    category: { id: "cat-ai", name: "Artificial Intelligence", slug: "artificial-intelligence" },
    objectives: [
      "Understand the core principles of artificial intelligence and machine learning",
      "Build and train neural networks using popular frameworks",
      "Apply supervised and unsupervised learning techniques to real datasets",
      "Evaluate model performance and implement improvements",
      "Deploy machine learning models to production environments"
    ],
    prerequisites: [
      "Basic programming knowledge (Python recommended)",
      "Familiarity with basic mathematics (algebra and statistics)",
      "No prior AI/ML experience required"
    ]
  },
  {
    id: "prog-cloud-architect",
    title: "Cloud Architect Professional",
    slug: "cloud-architect-professional",
    shortDescription: "Design and implement scalable cloud solutions using AWS, Azure, and GCP.",
    fullDescription:
      "This advanced program prepares participants to design, implement, and manage complex cloud architectures across multiple cloud providers. Covering AWS, Microsoft Azure, and Google Cloud Platform, the curriculum includes hands-on labs, architecture design workshops, and best practices for enterprise cloud adoption.",
    duration: "8 weeks",
    deliveryMode: "Hybrid",
    level: "Advanced",
    isFeatured: true,
    category: { id: "cat-cloud", name: "Cloud Computing", slug: "cloud-computing" },
    objectives: [
      "Design highly available and scalable cloud architectures",
      "Implement multi-cloud strategies and migration plans",
      "Configure cloud security, identity, and compliance controls",
      "Optimize cloud costs and performance",
      "Automate infrastructure deployment using Infrastructure as Code"
    ],
    prerequisites: [
      "Experience with at least one cloud platform (AWS, Azure, or GCP)",
      "Understanding of networking, virtualization, and storage concepts",
      "Completion of a foundational cloud course or equivalent experience"
    ]
  },
  {
    id: "prog-cyber-essentials",
    title: "Cybersecurity Essentials",
    slug: "cybersecurity-essentials",
    shortDescription: "Learn fundamental security principles, threat detection, and defensive strategies.",
    fullDescription:
      "This intermediate-level course provides a thorough grounding in cybersecurity principles and practices. Participants will learn about threat landscapes, security frameworks, risk management, incident response, and defensive technologies through a combination of theory and practical exercises.",
    duration: "6 weeks",
    deliveryMode: "Online",
    level: "Intermediate",
    isFeatured: true,
    category: { id: "cat-sec", name: "Cybersecurity", slug: "cybersecurity" },
    objectives: [
      "Identify common cybersecurity threats, vulnerabilities, and attack vectors",
      "Implement security controls and defense-in-depth strategies",
      "Conduct risk assessments and vulnerability scans",
      "Develop incident response plans and procedures",
      "Apply security best practices to network, application, and cloud environments"
    ],
    prerequisites: [
      "Basic understanding of networking and operating systems",
      "Familiarity with IT infrastructure concepts",
      "Some programming experience is helpful but not required"
    ]
  },
  {
    id: "prog-fullstack",
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    shortDescription:
      "Build modern web applications from frontend to backend using industry-standard tools.",
    fullDescription:
      "This intensive program takes participants from the fundamentals of web development to building full-stack applications. Covering frontend technologies (React, Next.js), backend APIs (Node.js, Express), databases (PostgreSQL, Prisma), and deployment, students will build a portfolio of real-world projects.",
    duration: "12 weeks",
    deliveryMode: "In-Person",
    level: "Beginner to Intermediate",
    isFeatured: true,
    category: { id: "cat-dev", name: "Software Development", slug: "software-development" },
    objectives: [
      "Build responsive user interfaces with React and Next.js",
      "Design and implement RESTful APIs and database schemas",
      "Manage application state and handle data flow",
      "Implement authentication, authorization, and security",
      "Deploy applications to production environments"
    ],
    prerequisites: [
      "No prior web development experience required",
      "Basic computer literacy and problem-solving skills",
      "Willingness to learn and dedicate time to hands-on practice"
    ]
  },
  {
    id: "prog-data-analytics",
    title: "Data Analytics with Python",
    slug: "data-analytics-python",
    shortDescription:
      "Master data manipulation, visualization, and analysis using Python and its ecosystem.",
    fullDescription:
      "This hands-on course introduces participants to data analytics using Python's powerful ecosystem of libraries including Pandas, NumPy, Matplotlib, and Seaborn. Through real-world datasets and guided projects, participants will learn to clean, analyze, visualize, and derive insights from data.",
    duration: "4 weeks",
    deliveryMode: "Online",
    level: "Beginner",
    isFeatured: false,
    category: { id: "cat-data", name: "Data Science", slug: "data-science" },
    objectives: [
      "Manipulate and clean datasets using Pandas",
      "Perform statistical analysis and data exploration",
      "Create compelling visualizations to communicate insights",
      "Work with real-world datasets from multiple domains",
      "Present data-driven findings effectively"
    ],
    prerequisites: [
      "Basic programming knowledge is helpful but not required",
      "Familiarity with spreadsheets (Excel) is beneficial",
      "No prior data analytics experience required"
    ]
  },
  {
    id: "prog-itil4",
    title: "IT Service Management (ITIL 4)",
    slug: "itil-4-foundation",
    shortDescription: "Get certified in ITIL 4 and learn best practices for IT service delivery.",
    fullDescription:
      "This certification-preparation course covers the ITIL 4 framework, including the Service Value System (SVS), the four dimensions of service management, and the ITIL service value chain. Participants will be prepared for the ITIL 4 Foundation certification exam.",
    duration: "3 weeks",
    deliveryMode: "Online",
    level: "Beginner",
    isFeatured: false,
    category: { id: "cat-it", name: "IT Management", slug: "it-management" },
    objectives: [
      "Understand the ITIL 4 framework and its key concepts",
      "Learn the Service Value System and the service value chain",
      "Apply ITIL practices to improve IT service delivery",
      "Prepare for the ITIL 4 Foundation certification exam",
      "Implement continual improvement in IT operations"
    ],
    prerequisites: [
      "No prior ITIL knowledge required",
      "Experience in IT operations or service delivery is helpful",
      "Basic understanding of IT service concepts"
    ]
  }
];

export const trainingProgramsContent: TrainingProgramsContent = {
  eyebrow: "Programs",
  title: "Training Programs",
  intro:
    "Discover practical, hands-on training across technology domains. Our programs are designed for students, professionals, and teams.",
  categories: trainingCategories,
  programs: trainingPrograms.map(({ fullDescription, objectives, prerequisites, ...summary }) => summary)
};