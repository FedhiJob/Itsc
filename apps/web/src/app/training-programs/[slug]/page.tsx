import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, GraduationCap, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

const programs: Record<string, {
  title: string;
  category: string;
  duration: string;
  level: string;
  delivery: string;
  description: string;
  fullDescription: string;
  objectives: string[];
  prerequisites: string[];
}> = {
  "ai-foundations": {
    title: "AI Foundations",
    category: "Artificial Intelligence",
    duration: "6 weeks",
    level: "Beginner",
    delivery: "Online",
    description: "Understand core AI concepts, neural networks, and build your first machine learning models.",
    fullDescription: "This comprehensive introductory course covers the fundamental concepts of artificial intelligence, including machine learning, neural networks, natural language processing, and computer vision. Through hands-on projects and real-world case studies, participants will gain practical experience building and deploying AI models.",
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
  "cloud-architect-professional": {
    title: "Cloud Architect Professional",
    category: "Cloud Computing",
    duration: "8 weeks",
    level: "Advanced",
    delivery: "Hybrid",
    description: "Design and implement scalable cloud solutions using AWS, Azure, and GCP.",
    fullDescription: "This advanced program prepares participants to design, implement, and manage complex cloud architectures across multiple cloud providers. Covering AWS, Microsoft Azure, and Google Cloud Platform, the curriculum includes hands-on labs, architecture design workshops, and best practices for enterprise cloud adoption.",
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
  "cybersecurity-essentials": {
    title: "Cybersecurity Essentials",
    category: "Cybersecurity",
    duration: "6 weeks",
    level: "Intermediate",
    delivery: "Online",
    description: "Learn fundamental security principles, threat detection, and defensive strategies.",
    fullDescription: "This intermediate-level course provides a thorough grounding in cybersecurity principles and practices. Participants will learn about threat landscapes, security frameworks, risk management, incident response, and defensive technologies through a combination of theory and practical exercises.",
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
  "full-stack-web-development": {
    title: "Full-Stack Web Development",
    category: "Software Development",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    delivery: "In-Person",
    description: "Build modern web applications from frontend to backend using industry-standard tools.",
    fullDescription: "This intensive program takes participants from the fundamentals of web development to building full-stack applications. Covering frontend technologies (React, Next.js), backend APIs (Node.js, Express), databases (PostgreSQL, Prisma), and deployment, students will build a portfolio of real-world projects.",
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
  "data-analytics-python": {
    title: "Data Analytics with Python",
    category: "Data Science",
    duration: "4 weeks",
    level: "Beginner",
    delivery: "Online",
    description: "Master data manipulation, visualization, and analysis using Python and its ecosystem.",
    fullDescription: "This hands-on course introduces participants to data analytics using Python's powerful ecosystem of libraries including Pandas, NumPy, Matplotlib, and Seaborn. Through real-world datasets and guided projects, participants will learn to clean, analyze, visualize, and derive insights from data.",
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
  "itil-4-foundation": {
    title: "IT Service Management (ITIL 4)",
    category: "IT Management",
    duration: "3 weeks",
    level: "Beginner",
    delivery: "Online",
    description: "Get certified in ITIL 4 and learn best practices for IT service delivery.",
    fullDescription: "This certification-preparation course covers the ITIL 4 framework, including the Service Value System (SVS), the four dimensions of service management, and the ITIL service value chain. Participants will be prepared for the ITIL 4 Foundation certification exam.",
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = programs[slug];

  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: program.title,
    description: program.description
  };
}

export default async function TrainingProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = programs[slug];

  if (!program) {
    notFound();
  }

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container>
          <Link
            href="/training-programs"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to Programs
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-brand-gold">
              <span className="rounded-md bg-brand-gold/10 px-2 py-1">{program.category}</span>
              <span className="rounded-md bg-gray-100 px-2 py-1">{program.level}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              {program.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-500">{program.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Clock aria-hidden="true" className="h-4 w-4" />
              <span>Duration: <strong className="text-gray-900">{program.duration}</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span>Delivery: <strong className="text-gray-900">{program.delivery}</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <GraduationCap aria-hidden="true" className="h-4 w-4" />
              <span>Level: <strong className="text-gray-900">{program.level}</strong></span>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">About This Program</h2>
              <p className="mt-4 text-base leading-7 text-gray-500">
                {program.fullDescription}
              </p>

              <h3 className="mt-10 text-xl font-semibold text-gray-900">Learning Objectives</h3>
              <ul className="mt-4 space-y-3">
                {program.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-500">
                    <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 text-xl font-semibold text-gray-900">Prerequisites</h3>
              <ul className="mt-4 space-y-2">
                {program.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-500">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Ready to enroll?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Contact us to learn more about upcoming cohorts, pricing, and group enrollment options.
              </p>
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full">
                  <Link href="/contact?subject=enrollment">
                    Enroll Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`mailto:${siteConfig.links.email}`}>
                    Email Us
                  </Link>
                </Button>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                  Flexible scheduling available
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
