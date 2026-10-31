import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";

loadEnv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
  override: true
});

const prisma = new PrismaClient();

interface VendorData {
  name: string;
  slug: string;
  sortOrder: number;
  description: string;
}

interface SubcategoryData {
  name: string;
  slug: string;
  parentSlug: string;
  sortOrder: number;
  description: string;
}

interface CourseData {
  vendor: string;
  vendorSlug: string;
  subcategory: string;
  subcategorySlug: string;
  title: string;
  slug: string;
  code?: string;
  duration: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  prerequisites: string[];
  deliveryMode: string;
  level: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface CatalogueJson {
  vendors: VendorData[];
  subcategories: SubcategoryData[];
  courses: CourseData[];
}

export async function importLegacyCatalogue() {
  console.log("=== ITSC Legacy Course Catalogue & Company Profile Import ===");

  const dataPath = resolve(dirname(fileURLToPath(import.meta.url)), "legacy-catalogue-data.json");
  const rawData = readFileSync(dataPath, "utf-8");
  const data: CatalogueJson = JSON.parse(rawData);

  // 1. Get or create author (System Administrator)
  let admin = await prisma.administrator.findFirst({
    where: { role: "SUPER_ADMIN" }
  });
  if (!admin) {
    admin = await prisma.administrator.findFirst();
  }
  const authorId = admin?.id ?? null;

  // 2. Import 19 Vendor Categories (Top-level)
  console.log(`\nImporting ${data.vendors.length} Top-Level Vendor Categories...`);
  const vendorIdMap = new Map<string, string>();

  for (const v of data.vendors) {
    const record = await prisma.trainingCategory.upsert({
      where: { slug: v.slug },
      update: {
        name: v.name,
        sortOrder: v.sortOrder,
        description: v.description,
        parentId: null
      },
      create: {
        name: v.name,
        slug: v.slug,
        sortOrder: v.sortOrder,
        description: v.description,
        parentId: null
      }
    });
    vendorIdMap.set(v.slug, record.id);
  }
  console.log(`✓ ${vendorIdMap.size} Top-Level Categories successfully upserted.`);

  // 3. Import 35 Subcategories (Nested)
  console.log(`\nImporting ${data.subcategories.length} Nested Subcategories...`);
  const subcatIdMap = new Map<string, string>();

  for (const s of data.subcategories) {
    const parentId = vendorIdMap.get(s.parentSlug);
    if (!parentId) {
      console.warn(`Warning: Parent category not found for subcategory ${s.slug} (parent: ${s.parentSlug})`);
      continue;
    }

    const record = await prisma.trainingCategory.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        sortOrder: s.sortOrder,
        description: s.description,
        parentId
      },
      create: {
        name: s.name,
        slug: s.slug,
        sortOrder: s.sortOrder,
        description: s.description,
        parentId
      }
    });
    subcatIdMap.set(s.slug, record.id);
  }
  console.log(`✓ ${subcatIdMap.size} Nested Subcategories successfully upserted.`);

  // 4. Import 268 Courses
  console.log(`\nImporting ${data.courses.length} Courses...`);
  let importedCourses = 0;

  for (const c of data.courses) {
    const categoryId = subcatIdMap.get(c.subcategorySlug) || vendorIdMap.get(c.vendorSlug);
    if (!categoryId) {
      console.warn(`Warning: No category found for course ${c.slug}`);
      continue;
    }

    await prisma.trainingProgram.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        code: c.code ?? null,
        categoryId,
        shortDescription: c.shortDescription,
        fullDescription: c.fullDescription,
        duration: c.duration,
        deliveryMode: c.deliveryMode,
        level: c.level,
        objectives: c.objectives,
        prerequisites: c.prerequisites,
        status: "PUBLISHED"
      },
      create: {
        title: c.title,
        slug: c.slug,
        code: c.code ?? null,
        categoryId,
        authorId,
        shortDescription: c.shortDescription,
        fullDescription: c.fullDescription,
        duration: c.duration,
        deliveryMode: c.deliveryMode,
        level: c.level,
        objectives: c.objectives,
        prerequisites: c.prerequisites,
        status: "PUBLISHED"
      }
    });
    importedCourses++;
  }
  console.log(`✓ ${importedCourses} Courses successfully upserted.`);

  // 5. Populate / Upsert Trust Logos
  console.log("\nPopulating International Partners and Corporate Clients (Trust Logos)...");
  const partnerLogos = [
    { name: "Cisco Systems", logoUrl: "/companies/cisco.png", websiteUrl: "https://www.cisco.com", type: "PARTNER" as const, sortOrder: 1 },
    { name: "Microsoft", logoUrl: "/companies/microsoft.png", websiteUrl: "https://www.microsoft.com", type: "PARTNER" as const, sortOrder: 2 },
    { name: "CompTIA", logoUrl: "/companies/comptia.png", websiteUrl: "https://www.comptia.org", type: "PARTNER" as const, sortOrder: 3 },
    { name: "EC-Council", logoUrl: "/companies/ec-council.png", websiteUrl: "https://www.eccouncil.org", type: "PARTNER" as const, sortOrder: 4 },
    { name: "Huawei", logoUrl: "/companies/huawei.png", websiteUrl: "https://www.huawei.com", type: "PARTNER" as const, sortOrder: 5 },
    { name: "Pearson VUE", logoUrl: "/companies/pearson-vue.png", websiteUrl: "https://home.pearsonvue.com", type: "PARTNER" as const, sortOrder: 6 },
    { name: "PECB", logoUrl: "/companies/pecb.png", websiteUrl: "https://pecb.com", type: "PARTNER" as const, sortOrder: 7 },
    { name: "(ISC)2", logoUrl: "/companies/isc2.png", websiteUrl: "https://www.isc2.org", type: "PARTNER" as const, sortOrder: 8 },
    { name: "Android ATC", logoUrl: "/companies/android-atc.png", websiteUrl: "https://androidatc.com", type: "PARTNER" as const, sortOrder: 9 },
    { name: "Linux Professional Institute (LPI)", logoUrl: "/companies/LPI.png", websiteUrl: "https://www.lpi.org", type: "PARTNER" as const, sortOrder: 10 },
    { name: "Certiport", logoUrl: "/companies/certiport.png", websiteUrl: "https://certiport.pearsonvue.com", type: "PARTNER" as const, sortOrder: 11 },
    { name: "Prometric", logoUrl: "/companies/prometric.png", websiteUrl: "https://www.prometric.com", type: "PARTNER" as const, sortOrder: 12 }
  ];

  const clientLogos = [
    { name: "Ethio Telecom", logoUrl: "/logos/ethio-telecom.png", websiteUrl: "https://www.ethiotelecom.et", type: "CLIENT" as const, sortOrder: 1 },
    { name: "Commercial Bank of Ethiopia (CBE)", logoUrl: "/logos/cbe.png", websiteUrl: "https://www.combanketh.et", type: "CLIENT" as const, sortOrder: 2 },
    { name: "Ministry of Innovation and Technology (MINT)", logoUrl: "/logos/mint.png", websiteUrl: "https://mint.gov.et", type: "CLIENT" as const, sortOrder: 3 },
    { name: "Ministry of National Defence (MoND)", logoUrl: "/logos/defense.png", type: "CLIENT" as const, sortOrder: 4 },
    { name: "Awash Bank", logoUrl: "/logos/awash-bank.png", websiteUrl: "https://awashbank.com", type: "CLIENT" as const, sortOrder: 5 },
    { name: "Dashen Bank", logoUrl: "/logos/dashen.png", websiteUrl: "https://dashenbanksc.com", type: "CLIENT" as const, sortOrder: 6 },
    { name: "Nib International Bank", logoUrl: "/logos/nib.png", websiteUrl: "https://www.nibbanksc.com", type: "CLIENT" as const, sortOrder: 7 },
    { name: "United Nations Development Programme (UNDP)", logoUrl: "/logos/undp.png", websiteUrl: "https://www.undp.org", type: "CLIENT" as const, sortOrder: 8 },
    { name: "Coca Cola Ethiopia", logoUrl: "/logos/coca-cola.png", type: "CLIENT" as const, sortOrder: 9 }
  ];

  let trustLogosUpserted = 0;
  for (const item of [...partnerLogos, ...clientLogos]) {
    const existing = await prisma.trustLogo.findFirst({
      where: { name: item.name, type: item.type }
    });
    if (existing) {
      await prisma.trustLogo.update({
        where: { id: existing.id },
        data: item
      });
    } else {
      await prisma.trustLogo.create({
        data: item
      });
    }
    trustLogosUpserted++;
  }
  console.log(`✓ ${trustLogosUpserted} Trust Logos successfully registered.`);

  // 6. Populate / Upsert Company Profile into website_settings
  console.log("\nPopulating Company Profile into website_settings...");

  const homepageSettings = {
    hero: {
      eyebrow: "ITSC — Information Technology Support Center",
      title: "Pioneering IT Excellence, Professional Training & Solutions Since 1999.",
      subtitle:
        "Equipping Ethiopian professionals, enterprises, and government institutions with official vendor certifications, enterprise networking, and cybersecurity mastery.",
      primaryCta: { label: "Explore Course Catalogue", href: "/training-programs", variant: "primary" },
      secondaryCta: { label: "Corporate Training Solutions", href: "/corporate-training", variant: "outline" },
      highlights: [
        { label: "Experience", value: "25+ Years in Ethiopian IT Market" },
        { label: "Catalogue", value: "260+ Documented Certification Courses" },
        { label: "Accreditation", value: "Official Cisco, CompTIA, Huawei & EC-Council Partner" }
      ]
    },
    stats: [
      { value: "25+", label: "Years of Excellence (Est. 1999)" },
      { value: "260+", label: "Official Courses" },
      { value: "150+", label: "Corporate & Govt Clients" },
      { value: "12+", label: "International Testing & Training Affiliations" }
    ],
    services: [
      {
        title: "Vendor-Certified Training",
        description: "Official authorized curricula from Cisco, Microsoft, CompTIA, Huawei, EC-Council, and (ISC)2.",
        icon: "graduation-cap"
      },
      {
        title: "Corporate Capacity Building",
        description: "Customized workforce upskilling for banking, telecom, defense, and public agencies.",
        icon: "building"
      },
      {
        title: "Networking & Security Consultancy",
        description: "Enterprise network design, infrastructure optimization, and rigorous security assessments.",
        icon: "shield"
      },
      {
        title: "International Testing Center",
        description: "Authorized testing facility for Pearson VUE, Prometric, and Certiport certification exams.",
        icon: "award"
      }
    ],
    partners: partnerLogos.map((p) => ({ src: p.logoUrl, alt: p.name, href: p.websiteUrl })),
    clients: clientLogos.map((c) => ({ src: c.logoUrl, alt: c.name })),
    missionVision: {
      mission:
        "To foster enduring professional relationships with clients by delivering cutting-edge, dependable IT solutions and practical training that optimize operational efficiency and business productivity.",
      vision:
        "To be the premier Ethiopian and regional center of excellence for vendor-certified IT education, technology consultancy, and enterprise capacity building."
    },
    cta: {
      title: "Advance Your Career or Elevate Your Organization",
      description: "Browse our comprehensive 2022-2025 course catalogue or contact our advisory team for tailored training schedules.",
      primaryCta: { label: "Explore Courses", href: "/training-programs", variant: "primary" },
      secondaryCta: { label: "Contact Us", href: "/contact", variant: "outline" }
    }
  };

  const aboutSettings = {
    eyebrow: "Company Profile",
    title: "About ITSC PLC",
    intro:
      "Founded in 1999, ITSC PLC has solidified its reputation as a leading force in the Ethiopian Information Technology service and training market. Based in Addis Ababa (Mega Building, Suite 902), our certified professional team delivers industry-standard solutions and world-class certification training.",
    values: [
      {
        title: "Established Foundation (1999)",
        description: "Over 25 years of continuous dedication to Ethiopia's digital transformation, training thousands of IT professionals across East Africa.",
        icon: "building"
      },
      {
        title: "Certified Instructors & Leadership",
        description: "Led by certified instructors including Microsoft Certified Trainers (MCT), Cisco Certified Systems Instructors (CCSI), and Huawei Certified Systems Instructors (HCSI).",
        icon: "award"
      },
      {
        title: "Hands-on Practical Methodology",
        description: "State-of-the-art lab environments featuring original hardware, live network simulation racks, and official vendor courseware.",
        icon: "target"
      },
      {
        title: "International Affiliations",
        description: "Authorized Learning Partner for Huawei (HALP), Cisco Sponsored Organization (CSO), CompTIA Delivery Partner, and Pearson VUE Authorized Center.",
        icon: "globe"
      },
      {
        title: "Enterprise Client Trust",
        description: "Trusted training provider for Ethio Telecom, Commercial Bank of Ethiopia, Ministry of Innovation and Technology, and Ethiopian Airlines.",
        icon: "users"
      }
    ],
    cta: {
      title: "Partner with Ethiopia's Foremost IT Training Institution",
      description: "Discover how ITSC's certified programs can empower your technical workforce.",
      primaryCta: { label: "View All Programmes", href: "/training-programs", variant: "primary" },
      secondaryCta: { label: "Speak with an Advisor", href: "/contact", variant: "outline" }
    }
  };

  const corporateTrainingSettings = {
    eyebrow: "Corporate Capacity Building",
    title: "Tailored IT Solutions for Enterprise & Government",
    intro:
      "ITSC designs and executes high-impact corporate training and capability-building programs for Ethiopia's leading financial institutions, telecommunication providers, government ministries, and international organizations.",
    primaryCta: {
      label: "Request Corporate Consultation",
      href: "/contact?subject=corporate-training&source=%2Fcorporate-training&sourceLabel=Corporate%20Training",
      variant: "primary"
    },
    benefits: [
      {
        title: "Customized Corporate Syllabi",
        description: "Training programs structured specifically to address your organizational architecture, infrastructure goals, and skill benchmarks.",
        icon: "users"
      },
      {
        title: "Flexible Delivery Models",
        description: "On-site delivery at client premises, high-tech training at ITSC's Bole Mega Building facilities, or live interactive virtual classes.",
        icon: "building"
      },
      {
        title: "Official Certification Prep",
        description: "Curricula mapped to global vendor examinations with in-house testing through Pearson VUE and Prometric test centers.",
        icon: "award"
      },
      {
        title: "Proven Institutional Track Record",
        description: "Decades of successful capacity building for Ethio Telecom, CBE, Ministry of Innovation & Technology, and Defence Engineering College.",
        icon: "clipboard-check"
      }
    ],
    services: [
      {
        title: "Cybersecurity & Ethical Hacking",
        description: "Enterprise defense, threat intelligence, incident response, and regulatory compliance (CEH, CISA, CISSP, CySA+).",
        areas: ["Penetration testing & ethical hacking", "Security audit & governance", "Threat hunting & incident response", "SOC analyst upskilling"]
      },
      {
        title: "Enterprise Networking & Cloud Infrastructure",
        description: "Design, deployment, and optimization across Cisco, Huawei, Microsoft Azure, and VMware environments.",
        areas: ["Cisco CCNA/CCNP routing & switching", "Huawei Datacom & Cloud solutions", "Azure hybrid cloud administration", "VMware vSphere datacenter virtualization"]
      },
      {
        title: "Database Administration & Big Data Analytics",
        description: "Mission-critical database clustering, performance tuning, and BI analytics across Oracle, SQL Server, and Power BI.",
        areas: ["Oracle 12c/19c high-availability clustering", "Microsoft SQL Server AlwaysOn", "Data warehousing & ETL pipelines", "Executive Power BI dashboards"]
      },
      {
        title: "IT Service Management & Project Governance",
        description: "Industry-standard frameworks for operational service quality and agile delivery (ITIL v4, PMP, Scrum Master).",
        areas: ["ITIL 4 Foundation & Specialist tracks", "PMP & Agile certification preparation", "DevOps fundamentals", "Risk management & service lifecycle"]
      }
    ],
    cta: {
      title: "Elevate Your Corporate IT Capabilities",
      description: "Contact our enterprise accounts team to request customized course proposals, syllabus adaptations, and group pricing.",
      primaryCta: { label: "Request Corporate Proposal", href: "/contact", variant: "primary" },
      secondaryCta: { label: "Download Course Catalogue", href: "/training-programs", variant: "outline" }
    }
  };

  const siteConfigSettings = {
    name: "ITSC",
    fullName: "ITSC PLC — Information Technology Support Center",
    description: "Pioneering IT training, corporate capacity building, and vendor certification in Ethiopia since 1999.",
    url: "https://www.itsc.com.et",
    apiUrl: "http://localhost:5000/api/v1",
    links: {
      email: "info@itsc.com.et",
      phone: "+251-115-507150",
      address: "Bole Road, Mega Building, Suite 902, Addis Ababa, Ethiopia"
    }
  };

  await prisma.websiteSetting.upsert({
    where: { key: "homepage" },
    update: { value: homepageSettings },
    create: { key: "homepage", value: homepageSettings }
  });

  await prisma.websiteSetting.upsert({
    where: { key: "about" },
    update: { value: aboutSettings },
    create: { key: "about", value: aboutSettings }
  });

  await prisma.websiteSetting.upsert({
    where: { key: "corporate_training" },
    update: { value: corporateTrainingSettings },
    create: { key: "corporate_training", value: corporateTrainingSettings }
  });

  await prisma.websiteSetting.upsert({
    where: { key: "site_config" },
    update: { value: siteConfigSettings },
    create: { key: "site_config", value: siteConfigSettings }
  });

  console.log("✓ Website settings (homepage, about, corporate_training, site_config) successfully upserted.");

  console.log("\n============================================================");
  console.log(`SUMMARY OF IMPORT:`);
  console.log(`- Top-level Vendors: ${vendorIdMap.size}`);
  console.log(`- Nested Subcategories: ${subcatIdMap.size}`);
  console.log(`- Courses Imported: ${importedCourses}`);
  console.log(`- Trust Logos: ${trustLogosUpserted}`);
  console.log(`- Website Settings: 4 modules configured`);
  console.log("============================================================\n");
}

importLegacyCatalogue()
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

