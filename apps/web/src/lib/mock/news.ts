// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the News pages. It conforms to the
// shared contracts in @itsc/shared so that swapping to API data requires no
// component changes.

import type { NewsArticleDetail, NewsContent } from "@itsc/shared";

export const newsArticles: NewsArticleDetail[] = [
  {
    id: "news-ai-training",
    title: "ITSC Launches New AI Training Program",
    summary:
      "Our comprehensive AI Foundations program is now open for enrollment, covering machine learning, neural networks, and practical AI applications.",
    date: "2024-03-15",
    slug: "ai-training-launch",
    category: "Programs",
    author: "ITSC Communications Team",
    content: [
      "ITSC is proud to announce the launch of our new AI Foundations training program, now open for enrollment. This comprehensive course is designed to equip learners with the fundamental knowledge and practical skills needed to understand and apply artificial intelligence in real-world scenarios.",
      "The program covers a wide range of topics including machine learning, neural networks, natural language processing, and computer vision. Through a combination of interactive lectures, hands-on labs, and project-based learning, participants will gain practical experience building and deploying AI models.",
      "Our curriculum has been developed in collaboration with industry experts to ensure it reflects the latest advancements in the field. Whether you are a complete beginner or a professional looking to upskill, the AI Foundations program offers a structured learning path that meets you where you are.",
      "Enrollment is now open for the upcoming cohort. Spaces are limited, so we encourage interested candidates to apply early. For more information about the program, curriculum, and enrollment process, please visit our training programs page or contact our admissions team."
    ]
  },
  {
    id: "news-corporate-partnership",
    title: "Corporate Training Partnership with Leading Tech Firms",
    summary:
      "ITSC partners with major technology companies to deliver customized training solutions for enterprise teams.",
    date: "2024-02-28",
    slug: "corporate-partnership-announcement",
    category: "Partnerships",
    author: "ITSC Communications Team",
    content: [
      "ITSC is excited to announce new strategic partnerships with several leading technology companies to deliver customized training solutions for enterprise teams. These collaborations will enable us to offer tailored programs that address the specific needs of modern organizations.",
      "Through these partnerships, our corporate clients will gain access to specialized curricula, industry-recognized certifications, and expert instructors with deep domain knowledge. We will work closely with each partner to design training programs that align with their strategic goals and workforce development objectives.",
      "The partnership also opens up new opportunities for our students, including access to industry tools, mentorship programs, and potential career pathways with our partner organizations.",
      "We believe that collaboration between education and industry is essential for building a skilled and future-ready workforce. These partnerships represent a significant step forward in our mission to bridge the gap between training and employment."
    ]
  },
  {
    id: "news-cyber-workshop",
    title: "Cybersecurity Workshop Series Announced",
    summary:
      "Register for our upcoming cybersecurity workshop series covering threat detection, incident response, and security best practices.",
    date: "2024-02-10",
    slug: "cybersecurity-workshop-series",
    category: "Events",
    author: "ITSC Communications Team",
    content: [
      "ITSC is pleased to announce a new series of hands-on cybersecurity workshops designed for professionals and enthusiasts alike. The series will cover critical topics including threat detection, incident response, and security best practices.",
      "Each workshop is led by experienced security practitioners and combines theoretical instruction with practical, real-world exercises. Participants will have the opportunity to work with industry-standard tools and techniques used in modern security operations.",
      "The workshop series is ideal for IT professionals looking to strengthen their security skills, as well as individuals considering a career in cybersecurity. No prior security experience is required for the introductory sessions, while advanced workshops will build on foundational knowledge.",
      "Registration is now open. Seats are limited to ensure a high-quality learning experience, so we recommend registering early to secure your place."
    ]
  },
  {
    id: "news-fall-graduation",
    title: "Graduation Ceremony for Fall 2024 Cohort",
    summary:
      "Congratulations to our graduates who completed intensive training in cloud architecture, full-stack development, and data analytics.",
    date: "2024-01-20",
    slug: "fall-2024-graduation",
    category: "Community",
    author: "ITSC Communications Team",
    content: [
      "ITSC celebrated the graduation of its Fall 2024 cohort in a ceremony held at our main campus. The graduating class completed intensive training programs in cloud architecture, full-stack development, and data analytics.",
      "Over the course of their training, our graduates demonstrated exceptional dedication and skill, completing challenging projects and earning industry-recognized certifications. Their achievements reflect the quality and rigor of ITSC's training programs.",
      "We are incredibly proud of our graduates and the hard work they have put into their education. Many have already secured positions with leading companies, while others are pursuing further specialization in their chosen fields.",
      "We extend our heartfelt congratulations to all our graduates and wish them continued success in their careers. We look forward to seeing the impact they will make in the technology industry."
    ]
  },
  {
    id: "news-facility-expansion",
    title: "ITSC Expands Training Facilities",
    summary:
      "New state-of-the-art training labs equipped with the latest technology to provide an enhanced hands-on learning experience.",
    date: "2024-01-05",
    slug: "facility-expansion",
    category: "Announcements",
    author: "ITSC Communications Team",
    content: [
      "ITSC is excited to announce the expansion of our training facilities with the addition of new state-of-the-art labs. These facilities are equipped with the latest technology to provide an enhanced, hands-on learning experience for our students.",
      "The new labs feature high-performance workstations, advanced networking equipment, and dedicated spaces for collaborative projects and group work. They have been designed to support a wide range of training programs, from software development to cybersecurity and cloud computing.",
      "This expansion reflects our ongoing commitment to providing world-class training environments that prepare our students for the demands of the modern technology industry. The new facilities will enable us to accommodate more students and offer an even broader range of programs.",
      "We invite prospective students and partners to visit our campus and see the new facilities for themselves. We believe these investments will significantly enhance the learning experience and outcomes for all our students."
    ]
  }
];

export const newsContent: NewsContent = {
  eyebrow: "Updates",
  title: "News & Events",
  intro:
    "Stay updated with the latest from ITSC — program launches, events, partnerships, and community initiatives.",
  articles: newsArticles.map(({ content, author, ...summary }) => summary)
};