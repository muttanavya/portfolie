export const PORTRAIT_URL =
  "https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/bid3j9g6_WhatsApp%20Image%202026-07-21%20at%207.51.20%20PM.jpeg";

export const RESUME_URL =
  "https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/axrouqjo_r1%20%281%29.pdf";

export const CONTACT = {
  name: "Mutta Navya",
  title: "B.Tech Computer Science & Machine Learning Student",
  email: "muttanavyna@gmail.com",
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

export type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Credit Card Fraud Detection System",
    description:
      "Machine Learning model using preprocessing, feature engineering, and optimization to detect fraudulent transactions.",
    tech: ["Python", "Scikit-learn", "Pandas", "ML"],
  },
  {
    title: "Browser History Simulator",
    description: "Stack-based Java application that simulates browser back/forward navigation.",
    tech: ["Java", "Data Structures", "Stack"],
  },
  {
    title: "Vehicle Accident Alert System",
    description:
      "IoT-based accident detection system using Arduino, GPS, GSM and vibration sensors to send instant emergency alerts.",
    tech: ["IoT", "Arduino", "GPS", "GSM", "Sensors"],
  },
  {
    title: "Smart Door Lock System",
    description:
      "RFID-based IoT security system with mobile notifications for authorized and unauthorized access attempts.",
    tech: ["IoT", "RFID", "Arduino", "Mobile Alerts"],
  },
];

export const INTERNSHIPS = [
  { title: "Agentic AI Internship", meta: "7 Weeks" },
  { title: "Google AI-ML Virtual Internship", meta: "Virtual Program" },
  { title: "AWS Data Engineering Internship", meta: "Cloud & Data" },
  { title: "Google Android Developer Internship", meta: "Mobile Dev" },
  { title: "Data Structures & Algorithms Internship", meta: "8 Weeks" },
];

export const CERTIFICATIONS = [
  "Microsoft Azure AI Fundamentals",
  "AWS Data Engineering",
  "Google Python Full Stack Developer",
  "Quantum Computing Fundamentals",
  "Celonis Business Analyst",
  "Data Visualization (Forage)",
  "Ethical Hacking – EduSkills",
  "NPTEL Elite – Joy of Computing Using Python",
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
