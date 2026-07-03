export interface ProjectInfo {
  name: string;
  tagline: string;
  description: string;
  period?: string;
  tech: string[];
  highlights: string[];
  repo?: string;
  // Repo exists but is private — render a "private repo" note instead of a link.
  repoPrivate?: boolean;
  live?: string;
  // Card image under public/, e.g. "/projects/filmhub.png".
  image?: string;
}

export interface RepoRef {
  name: string;
  description: string;
  url?: string;
  isPrivate?: boolean;
}

export interface ExperienceEntry {
  role: string;
  org: string;
  location?: string;
  period: string;
  description: string;
  bullets?: string[];
  // Repos produced during this role. Private ones get a badge, no link.
  repos?: RepoRef[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  location?: string;
  period: string;
  notes?: string;
  coursework?: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const aboutContent = {
  name: "Ryan Meyer",
  tagline: "Computer Science · UGA · B.S. May 2026",
  location: "Atlanta, GA",
  bio: "Software engineer building production data pipelines, ML systems, and full-stack web apps. Currently a Computer Science senior at the University of Georgia (Computer Systems emphasis) with two summers as a Data Engineering Intern at Saia LTL Freight, where I shipped enterprise automation and BI platforms used by hundreds of stakeholders. Outside of class I build real things: receipt-scanning mobile apps, attention-based image segmentation, and AI-assisted financial tooling.",
  lookingFor:
    "Open to engineering work that combines data systems, machine learning, and the web. Especially interested in roles where the ML actually ships into production rather than living in a notebook.",
  previousPortfolio: "https://ryanmeyer.dev",
};

export const skillsContent: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Python",
      "Java",
      "C++",
      "C#",
      "SQL",
      "JavaScript",
      "TypeScript",
      "Bash / Shell",
      "HTML5",
      "Tailwind",
    ],
  },
  {
    label: "AI & ML",
    items: [
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Scikit-learn",
      "LangChain",
      "OpenCV",
      "Hugging Face",
      "MLOps",
      "RAG",
    ],
  },
  {
    label: "Web & Backend",
    items: [
      "Next.js",
      "React",
      "Node.js",
      "Django",
      "FastAPI",
      "GraphQL",
      "Prisma",
    ],
  },
  {
    label: "Cloud & DevOps",
    items: [
      "AWS (Lambda, S3, RDS)",
      "Google Cloud",
      "Vercel",
      "Render",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Linux",
    ],
  },
  {
    label: "Data & Databases",
    items: [
      "Pandas",
      "NumPy",
      "Power BI",
      "DAX",
      "XGBoost",
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Cassandra",
      "Neo4j",
    ],
  },
];

export const projectsContent: ProjectInfo[] = [
  {
    name: "Freshkeep",
    tagline:
      "Mobile receipt-scanning pantry tracker with TF-IDF item matching against 661 USDA FoodKeeper entries.",
    description:
      "Freshkeep started with a familiar ritual: buy groceries with the best intentions, then find half of them liquefying in the crisper two weeks later. So I built the app I wished existed. You scan the receipt on the way in from the car, OCR pulls every line item, and a TF-IDF matcher pairs each one against 661 USDA FoodKeeper entries to learn how long it actually lasts. The app quietly counts down and nudges you before anything turns. Behind it sits a FastAPI backend on Supabase with row-level security and JWT auth, so a whole household can share one pantry, plus a dashboard that shows you what you keep throwing away.",
    period: "Spring 2026",
    tech: [
      "React Native",
      "Expo",
      "FastAPI",
      "Supabase",
      "scikit-learn",
      "TF-IDF",
      "OCR",
    ],
    highlights: [
      "OCR receipt scanning with TF-IDF matching against 661 USDA FoodKeeper entries",
      "Push reminders for upcoming expirations",
      "Household sharing with Supabase RLS plus JWT auth",
      "Waste-tracking analytics dashboard",
    ],
    repoPrivate: true,
  },
  {
    name: "Byte's Bank",
    tagline:
      "PDF bank-statement analyzer with TF-IDF + Naive Bayes categorization and a Gemini-powered financial advisor chat.",
    description:
      "Built in a weekend at UGA Hacks 11, on a simple premise: what if your bank statement could talk back? Drop in the PDF and pdfplumber pries the transactions loose, a TF-IDF and Naive Bayes pipeline sorts them into ten spending categories, and a Gemini-powered advisor reads the result and tells you, kindly, where the money went. Climb wizard ranks as your habits improve, or let ElevenLabs read your monthly summary out loud.",
    period: "Spring 2026",
    tech: [
      "React",
      "Vite",
      "FastAPI",
      "scikit-learn",
      "Gemini API",
      "Supabase",
      "ElevenLabs",
      "pdfplumber",
    ],
    highlights: [
      "PDF transaction parsing with pdfplumber",
      "TF-IDF and Naive Bayes spending categorization across 10 classes",
      "Gemini-powered financial advisor chat",
      "Supabase auth with Row Level Security",
      "Built for UGA Hacks 11",
    ],
    repo: "https://github.com/rpmeyer3/Goose",
    live: "https://byte-bank-mauve.vercel.app",
    image: "/projects/bytes-bank.png",
  },
  {
    name: "Noise-Robust Image Segmentation System",
    tagline:
      "31.5M-parameter Attention U-Net with CBAM and curriculum learning, 92.6% accuracy across 5 noise types.",
    description:
      "Most segmentation models are lab kids: show them a clean image and they shine, add sensor grain or motion blur and they fall apart. I wanted one that kept its footing in the mess. The result is a 31.5 million parameter Attention U-Net with CBAM, trained on a curriculum that ramps the corruption up as the model gets stronger, the way you would add weight to a barbell. It holds 92.6% accuracy across five distinct noise types. The whole thing ships as a containerized FastAPI service with models delivered from Hugging Face, and a Vercel dashboard renders confidence heatmaps so you can watch it decide.",
    period: "Fall 2025",
    tech: [
      "PyTorch",
      "FastAPI",
      "Attention U-Net",
      "CBAM",
      "Docker",
      "Hugging Face",
      "Vercel",
    ],
    highlights: [
      "92.6% accuracy across 5 distinct noise types",
      "31.5M-parameter Attention U-Net with CBAM",
      "Curriculum-learning training schedule",
      "Containerized FastAPI inference plus Hugging Face model delivery",
      "Vercel dashboard with confidence-heatmap overlays",
    ],
    repo: "https://github.com/rpmeyer3/Recognize",
    live: "https://pattern-delineation.vercel.app",
    image: "/projects/segmentation.png",
  },
  {
    name: "Filmhub",
    tagline:
      "Production-ready movie booking SPA with Docker CI/CD, OAuth + JWT auth, and Luhn-validated payments.",
    description:
      "The CSCI 4050 group project at UGA: build a movie booking site that could plausibly go to production, and then actually treat it that way. Next.js and React up front, a Django REST API behind, everything containerized with a Docker CI/CD pipeline. OAuth 2.0 and JWT handle sign-in, role-based access keeps customers and admins in their own lanes, database triggers keep the auth and profile tables honest, and payments pass Luhn validation before anything gets charged.",
    period: "Spring 2025",
    tech: [
      "Next.js",
      "React",
      "Django",
      "PostgreSQL",
      "Docker",
      "OAuth",
      "JWT",
    ],
    highlights: [
      "Docker CI/CD pipeline for both frontend and backend",
      "OAuth 2.0 and JWT auth with role-based access control",
      "Database triggers for user sync between auth and profile tables",
      "Luhn-validated payment integration",
      "CSCI 4050 group project, UGA",
    ],
    repo: "https://github.com/rpmeyer3/Filmhub",
    live: "https://film-hub-theta.vercel.app",
    image: "/projects/filmhub.png",
  },
  {
    name: "Azure 3-Tier Secure Architecture",
    tagline:
      "Production-grade Azure web infra with Terraform, security hardening, and an interactive React explorer.",
    description:
      "Cloud tutorials love to end with a disclaimer: never do this in production. This project starts where those leave off. It is a three-tier web architecture on Azure where security is the baseline rather than the epilogue: NSGs default to deny-all, private endpoints keep the data tier off the public internet entirely, Entra ID and Managed Identities handle auth, and TLS 1.2+ is enforced everywhere, all expressed in Terraform 1.5+ on AzureRM 4.x. And because most reviewers do not have an Azure subscription lying around, a separate React explorer lets you walk the whole architecture from a browser tab.",
    tech: [
      "Terraform",
      "Azure",
      "React 19",
      "TypeScript",
      "Vite",
      "Bash",
    ],
    highlights: [
      "Application Gateway WAF v2 (OWASP 3.2) and Linux VMSS autoscaling 2 to 5 instances",
      "Azure SQL with private endpoints; Bastion for browser SSH (no public VMs)",
      "Centralized Log Analytics, Key Vault Premium, Managed Identities throughout",
      "Interactive React architecture explorer with no subscription required",
    ],
    repo: "https://github.com/rpmeyer3/Mule",
    live: "https://three-tier-web-arch.vercel.app",
    image: "/projects/azure-3tier.png",
  },
  {
    name: "AI-PIP",
    tagline:
      "Serverless AI inference pipeline on Azure with Terraform IaC and an animated React frontend.",
    description:
      "An end-to-end serverless AI inference pipeline on Azure, with the infrastructure written as reusable Terraform modules so the entire environment can be torn down and rebuilt on demand. The front half is a Vite, React 19, and TypeScript app that uses GSAP to animate the pipeline itself: instead of reading about requests moving through the system, you watch them travel.",
    tech: ["Azure", "Terraform", "React 19", "Vite", "TypeScript", "GSAP"],
    highlights: [
      "Modular Terraform with reusable Azure components",
      "GSAP-driven pipeline visualizer",
      "Serverless inference end-to-end",
    ],
    repo: "https://github.com/rpmeyer3/Messina",
    live: "https://ai-pip.vercel.app",
    image: "/projects/ai-pip.png",
  },
];

export const experienceContent: ExperienceEntry[] = [
  {
    role: "Data Engineering Intern",
    org: "Saia LTL Freight",
    location: "Johns Creek, GA",
    period: "May 2025 to Aug. 2025",
    description:
      "Owned an end-to-end RFP automation pipeline backed by a custom ML model, integrated into enterprise CRMs.",
    bullets: [
      "Engineered an end-to-end automation pipeline for RFP data ingestion that cut the processing cycle from over 3 months to just 8 hours, a > 99% reduction, while eliminating manual data entry errors.",
      "Designed and trained a Siamese neural network using Keras for one-shot similarity matching, hitting 0.97 AUC-ROC on production validation sets and successfully automating classification of high-variance RFP documents.",
      "Built a recursive data-generation pipeline using a score-based search across live pricing servers, including a script to produce synthetic training examples for model convergence.",
      "Implemented a robust data-validation module using Pandas and strict schema enforcement, preventing downstream corruption in CRM systems by rejecting malformed records at ingestion.",
      "Re-engineered a legacy C# process to fully integrate the new ML pipeline with enterprise CRMs (Salesforce and Microsoft Dynamics), giving sales teams validated near real-time RFP data.",
    ],
    repos: [
      {
        name: "Penguin",
        description:
          "The RFP pipeline itself: an automated scanner that fuzzy-matches 45K+ file paths against CRM accounts to extract proposal data.",
        isPrivate: true,
      },
      {
        name: "Heron",
        description:
          "Production model for National Accounts RFP data mining. Catalogs the file share and learns file-path patterns to automate account lookups.",
        isPrivate: true,
      },
      {
        name: "Mongoose",
        description:
          "Dynamic reference updater: filters RFP file paths down to data workbooks and matches each to a customer account using fuzzy matching plus sentence-embedding similarity.",
        isPrivate: true,
      },
    ],
  },
  {
    role: "Contractor (Part-Time)",
    org: "Saia LTL Freight",
    location: "Johns Creek, GA",
    period: "Aug. 2024 to May 2025",
    description:
      "Predictive pricing modeling and ad-hoc analytics support during the academic year.",
    bullets: [
      "Collaborated with the Finance team to develop a predictive pricing model using XGBoost, leveraging freight density and lane profitability features to justify discount-tier recommendations.",
      "Provided ad-hoc SQL support and data extraction for the analytics team, resolving urgent data requests for business stakeholders during the academic year.",
    ],
  },
  {
    role: "Data Engineering Intern",
    org: "Saia LTL Freight",
    location: "Johns Creek, GA",
    period: "May 2024 to Aug. 2024",
    description:
      "Built ETL pipelines and BI infrastructure consumed by hundreds of internal users across the company.",
    bullets: [
      "Automated ETL pipelines to process over 50 million records from legacy AS/400 databases into Power BI, reducing manual data extraction and reporting time by 90% for key company reports.",
      "Optimized BI semantic models by authoring complex DAX and SQL queries to calculate critical business metrics (ADR, ADBC), improving underlying report-query performance by over 30%.",
      "Spearheaded development of an interactive Territory Insights dashboard using Azure Maps in Power BI, identifying growth markets projected to capture over $5M in potential revenue.",
      "Implemented a dynamic Row-Level Security model for Power BI reports embedded within a Visualforce IFrame, enabling personalized and secure dashboard access for over 500 end users.",
    ],
    repos: [
      {
        name: "Osprey",
        description:
          "Saia Performance Insights: the Power BI model and report, augmented with SEC EDGAR competitor financial data for benchmarking.",
        isPrivate: true,
      },
    ],
  },
];

export const educationContent: EducationEntry[] = [
  {
    school: "The University of Georgia",
    degree: "B.S. in Computer Science, Emphasis in Computer Systems",
    location: "Athens, GA",
    period: "Expected May 2026",
    notes:
      "Computer Systems track. Coursework spans systems programming, distributed computing, and cloud infrastructure alongside foundational ML and full-stack development.",
    coursework: [
      "Software Engineering (CSCI 4050)",
      "Human-Computer Interaction (CSCI 4800)",
      "Machine Learning and Deep Learning",
      "Cloud and Distributed Systems",
      "Algorithms and Data Structures",
      "Computer Systems",
    ],
  },
];

export const contactContent = {
  email: "ryanpaulmeyer@gmail.com",
  phone: "470-841-9228",
  linkedin: "https://linkedin.com/in/rmeyer3",
  github: "https://github.com/rpmeyer3",
  portfolio: "https://ryanmeyer.dev",
};
