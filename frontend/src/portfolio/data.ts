export const PORTRAIT_URL =
  "https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/bid3j9g6_WhatsApp%20Image%202026-07-21%20at%207.51.20%20PM.jpeg";

export const RESUME_URL =
  "https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/y27ce0bz_p.resume.pdf";

export const CONTACT = {
  name: "Mutta Navya",
  title: "B.Tech Computer Science & Machine Learning Student",
  email: "muttanavya@gmail.com",
  phone: "+91 6302864849",
  github: "https://github.com/muttanavya",
  linkedin: "https://www.linkedin.com/in/muttanavya-139966266",
};

export const ROLES = [
  "AI & ML Student",
  "Java Developer",
  "Python Developer",
  "Data Analytics Enthusiast",
  "Cloud Learner",
  "Problem Solver",
];

export const ABOUT = `Hi, I'm Mutta Navya, a motivated B.Tech Computer Science & Machine Learning student passionate about Artificial Intelligence, Machine Learning, Data Analytics, Cloud Computing, and Software Development.

I enjoy solving real-world problems, building AI-powered applications, learning emerging technologies, and continuously improving my technical and communication skills. I am seeking Software Engineer and AI/ML Engineer opportunities where I can contribute while continuously growing professionally.`;

export const PROFILE = {
  college: "Dadi Institute of Engineering & Technology (Autonomous)",
  degree: "B.Tech",
  branch: "Computer Science & Machine Learning",
  duration: "2023 – 2027",
  cgpa: "8.45",
  location: "Anakapalli, Andhra Pradesh",
};

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Programming", items: ["Java", "Python", "C", "SQL"] },
  { group: "Cloud", items: ["AWS", "Microsoft Azure AI"] },
  {
    group: "Tools",
    items: ["Git", "GitHub", "Power BI", "Tableau", "Microsoft Excel", "VS Code"],
  },
  {
    group: "Technologies",
    items: ["Machine Learning", "Data Visualization", "Android Development", "DevOps"],
  },
];

// ---------------------------------------------------------------------------
// PROJECTS — full case studies. `slug` drives the /project/[slug] route.
// ---------------------------------------------------------------------------
export type Metric = { label: string; value: string };
export type Project = {
  slug: string;
  title: string;
  tagline: string;
  shortDesc: string;
  overview: string;
  problem: string;
  solution: string;
  tech: string[];
  features: string[];
  outcome: string;
  metrics: Metric[];
  github?: string;
  demo?: string;
  screenshots?: string[]; // easy to add later
  accent: string; // brand accent color per project
  icon: string; // Ionicons name
};

export const PROJECTS: Project[] = [
  {
    slug: "credit-card-fraud-detection",
    title: "Credit Card Fraud Detection System",
    tagline: "ML model that flags fraudulent transactions with 99.95% accuracy.",
    shortDesc:
      "Machine Learning model using preprocessing, feature engineering, and XGBoost to detect fraudulent transactions.",
    overview:
      "An XGBoost-powered classifier that identifies fraudulent credit card transactions on the Kaggle Credit Card Fraud dataset (284,807 transactions) — reaching ~99.95% prediction accuracy on the test set.",
    problem:
      "Online payment fraud drives billions in annual losses. Detecting fraudulent transactions accurately, while minimising false positives on legitimate purchases, is a hard imbalanced-classification problem where the fraud class is only ~0.17% of all transactions.",
    solution:
      "Cleaned and scaled the highly imbalanced dataset, engineered relevant features, applied resampling to balance the fraud class, and trained an XGBoost model with hyperparameter tuning to maximise precision + recall on the minority class.",
    tech: ["Python", "XGBoost", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    features: [
      "Handles severely imbalanced data (fraud class ≈ 0.17%)",
      "Feature engineering and scaling pipeline",
      "XGBoost model with tuned hyperparameters",
      "Confusion matrix and precision-recall evaluation",
      "~99.95% prediction accuracy on the test dataset",
    ],
    outcome:
      "Delivered a highly accurate fraud classifier that demonstrates a complete ML workflow — from raw imbalanced data to a production-ready model.",
    metrics: [
      { label: "Accuracy", value: "99.95%" },
      { label: "Dataset", value: "284,807 txns" },
      { label: "Model", value: "XGBoost" },
    ],
    accent: "#FF3D8A",
    icon: "shield-checkmark",
  },
  {
    slug: "browser-history-simulator",
    title: "Browser History Simulator",
    tagline: "A Java app that mimics browser back/forward using two stacks.",
    shortDesc:
      "Stack-based Java application that simulates browser back / forward navigation.",
    overview:
      "A console Java application that faithfully mimics browser navigation using two stacks — a hands-on way to understand how real browsers implement history.",
    problem:
      "Data-structure fundamentals stick best when applied to a real-world use case. I wanted to internalise how stacks power something people use every day — browser back / forward.",
    solution:
      "Modelled navigation with two stacks (past + future). Visiting a page pushes to 'past'; going back pops from 'past' and pushes to 'future'; forward reverses the operation; visiting any new page clears the 'future' stack.",
    tech: ["Java", "Data Structures", "Stack", "OOP"],
    features: [
      "Visit new pages",
      "Back navigation (pop from history)",
      "Forward navigation (redo)",
      "Clear history",
      "Display the current page",
    ],
    outcome:
      "Built a strong intuition for stack-based problem solving and object-oriented design in Java.",
    metrics: [
      { label: "Language", value: "Java" },
      { label: "DSA Focus", value: "Stack" },
      { label: "Type", value: "Solo Project" },
    ],
    accent: "#00E5FF",
    icon: "arrow-undo",
  },
  {
    slug: "vehicle-accident-alert-system",
    title: "Vehicle Accident Alert System",
    tagline: "IoT device that texts a crash location to your emergency contact.",
    shortDesc:
      "IoT-based accident detection using Arduino, GPS, GSM, and a MEMS sensor to send instant emergency alerts.",
    overview:
      "An IoT prototype that detects a vehicle crash on-board, retrieves the location via GPS, and immediately SMSs the coordinates to a pre-registered emergency contact via GSM.",
    problem:
      "Road-accident victims often experience delays in receiving emergency assistance because no one nearby reports the crash quickly enough. Faster automated alerts can meaningfully improve emergency response times.",
    solution:
      "An Arduino microcontroller reads a MEMS sensor to detect sudden impact. On a crash signal, it triggers the GPS module to fetch the vehicle's coordinates, and the GSM module automatically sends an SMS with the accident location to a predefined emergency contact.",
    tech: ["IoT", "Arduino", "MEMS Sensor", "GPS Module", "GSM Module", "Embedded C"],
    features: [
      "MEMS-based collision detection",
      "Real-time GPS coordinates on impact",
      "Automatic SMS via GSM to a saved emergency contact",
      "Predefined emergency contact configuration",
      "Low-power embedded hardware setup",
    ],
    outcome:
      "A working hardware prototype that demonstrates end-to-end IoT integration across sensing, positioning, and mobile connectivity.",
    metrics: [
      { label: "Domain", value: "IoT · Safety" },
      { label: "Team", value: "Team Project" },
      { label: "Stack", value: "Arduino + GPS + GSM" },
    ],
    accent: "#8A2BE2",
    icon: "car-sport",
  },
];

export const getProjectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);

// ---------------------------------------------------------------------------
// INTERNSHIPS
// ---------------------------------------------------------------------------
export const INTERNSHIPS = [
  { title: "Agentic AI Internship", meta: "7 Weeks" },
  { title: "Google AI-ML Virtual Internship", meta: "Virtual Program" },
  { title: "AWS Data Engineering Internship", meta: "Cloud & Data" },
  { title: "Google Android Developer Internship", meta: "Mobile Dev" },
  { title: "Data Structures & Algorithms Internship", meta: "8 Weeks" },
];

// ---------------------------------------------------------------------------
// CERTIFICATIONS — branded + gallery-ready (image + verify URL slots)
// ---------------------------------------------------------------------------
export type Certification = {
  name: string;
  provider: string;
  issueDate?: string;
  description: string;
  skills: string[];
  credentialId?: string;
  verifyUrl?: string;
  pdfPath: any;
  brandColor: string;
  brandTag: string;
  icon: string;
  duration?: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    name: "AWS Data Engineering",
    provider: "Amazon Web Services",
    issueDate: "2026",
    description:
      "Completed AWS Data Engineering certification covering cloud storage, ETL pipelines, analytics, data lakes, and AWS services for modern data engineering.",
    skills: [
      "AWS",
      "S3",
      "Glue",
      "Redshift",
      "Data Engineering",
      "ETL",
      "Cloud Computing",
    ],
    credentialId: "",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/aws-data-engineering.pdf"),
    brandColor: "#FF9900",
    brandTag: "AWS",
    icon: "server",
    duration: "",
  },

  {
    name: "Google Python Full Stack Developer",
    provider: "Google",
    issueDate: "2026",
    description:
      "Completed Full Stack Development program using Python covering frontend, backend, APIs, databases, and deployment.",
    skills: [
      "Python",
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Flask",
      "SQL",
      "Git",
    ],
    credentialId: "",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/python-full-stack.pdf"),
    brandColor: "#4285F4",
    brandTag: "GOOGLE",
    icon: "logo-google",
    duration: "",
  },

  {
    name: "Generative AI Fundamentals",
    provider: "Google Cloud",
    issueDate: "2026",
    description:
      "Successfully completed Generative AI Fundamentals covering LLMs, Prompt Engineering, Responsible AI, Vertex AI, and Generative AI applications.",
    skills: [
      "Generative AI",
      "Prompt Engineering",
      "LLMs",
      "Vertex AI",
      "Google Cloud",
      "Artificial Intelligence",
    ],
    credentialId: "1325af6071550dc7d6d0af8b2c7ae197",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/gen-ai.pdf"),
    brandColor: "#EA4335",
    brandTag: "GEN AI",
    icon: "sparkles",
    duration: "",
  },

  {
    name: "Data Analytics Job Simulation",
    provider: "Deloitte Australia · Forage",
    issueDate: "Nov 2025",
    description:
      "Completed Deloitte Data Analytics Job Simulation involving practical tasks in data analysis and forensic technology.",
    skills: [
      "Data Analytics",
      "Excel",
      "Forensic Technology",
      "Business Analysis",
      "Data Interpretation",
    ],
    credentialId: "u7SLihrTCo8RWjExu",
    verifyUrl:
      "https://www.theforage.com/virtual-internships/prototype/FqL4Ajx9jK5QKXbL2",
    pdfPath: require("../../assets/certificates/deloitte-data-analytics.pdf"),
    brandColor: "#86BC25",
    brandTag: "DELOITTE",
    icon: "briefcase",
  },

  {
    name: "Data Visualisation: Empowering Business with Effective Insights",
    provider: "Tata Group · Forage",
    issueDate: "Feb 2025",
    description:
      "Completed Tata Data Visualisation virtual experience covering business scenarios, dashboards, effective visuals, and communication of insights.",
    skills: [
      "Power BI",
      "Business Intelligence",
      "Data Visualization",
      "Charts",
      "Analytics",
    ],
    credentialId: "XTgEBtFyqWsdqgJvM",
    verifyUrl:
      "https://www.theforage.com/virtual-internships/prototype/cqQY5Jz6bYw",
    pdfPath: require("../../assets/certificates/data-visualization.pdf"),
    brandColor: "#486AFF",
    brandTag: "TATA",
    icon: "bar-chart",
  },

  {
    name: "The Joy of Computing using Python",
    provider: "NPTEL",
    issueDate: "Oct 2025",
    description:
      "Successfully completed the NPTEL course 'The Joy of Computing using Python' with Elite certification.",
    skills: [
      "Python",
      "Programming",
      "Problem Solving",
      "Algorithms",
      "Computational Thinking",
    ],
    credentialId: "NPTEL25CS103S972401856",
    verifyUrl: "https://nptel.ac.in/noc",
    pdfPath: require("../../assets/certificates/nptel-python.pdf"),
    brandColor: "#0EA5E9",
    brandTag: "NPTEL",
    icon: "trophy",
    duration: "12 Weeks",
  },

  {
    name: "Quantum Fundamentals",
    provider: "WISER · Qubitech",
    issueDate: "Feb 2026",
    description:
      "Successfully completed Quantum Fundamentals program introducing quantum computing concepts, qubits, quantum gates, and algorithms.",
    skills: [
      "Quantum Computing",
      "Qubits",
      "Quantum Gates",
      "Quantum Algorithms",
    ],
    credentialId: "2D665BB0",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/quantum-computing.pdf"),
    brandColor: "#8B5CF6",
    brandTag: "QC",
    icon: "flash",
  },

  {
    name: "Business Analyst Virtual Internship",
    provider: "EduSkills · AICTE · Celonis",
    issueDate: "Mar 2025",
    description:
      "Completed Business Analyst Virtual Internship focusing on business process analysis, process mining, and enterprise analytics.",
    skills: [
      "Business Analysis",
      "Celonis",
      "Process Mining",
      "Analytics",
      "Business Intelligence",
    ],
    credentialId: "c315ecc7721033a163cc80d52c9ebc22",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/business-analyst.pdf"),
    brandColor: "#6C4CFF",
    brandTag: "BA",
    icon: "analytics",
  },

  {
    name: "Ethical Hacking",
    provider: "EduSkills",
    issueDate: "Dec 2025",
    description:
      "Completed Ethical Hacking certification covering cybersecurity fundamentals, penetration testing, vulnerabilities, and security practices.",
    skills: [
      "Cyber Security",
      "Ethical Hacking",
      "Network Security",
      "Penetration Testing",
      "OWASP",
    ],
    credentialId: "377639",
    verifyUrl: "",
    pdfPath: require("../../assets/certificates/ethical-hacking.pdf"),
    brandColor: "#EF4444",
    brandTag: "ETHICAL",
    icon: "shield-checkmark",
  },
  {
  name: "Design Thinking",
  provider: "Wingspan",

  issueDate: "Feb 2025",

  description:
    "Successfully completed the Design Thinking course, gaining practical knowledge of human-centered design, innovation, problem-solving, ideation, prototyping, and user experience methodologies.",

  skills: [
    "Design Thinking",
    "Problem Solving",
    "Innovation",
    "User Experience",
    "Ideation",
    "Prototyping",
    "Critical Thinking",
  ],

  credentialId: "",

  verifyUrl: "https://verify.onwingspan.com",

  pdfPath: require("../../assets/certificates/design-thinking.pdf"),
  brandColor: "#0F766E",
  brandTag: "DT",
  icon: "bulb",
},
];
export const ACHIEVEMENTS = [
  "Selected for the CRT Elite Batch at Dadi Institute of Engineering & Technology.",
  "Assisted 100+ individuals in registering for ABHA (Ayushman Bharat Health Account) cards.",
  "Earned Elite Certification from NPTEL in 'The Joy of Computing Using Python'.",
];

export const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "internships", label: "Internships" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];
