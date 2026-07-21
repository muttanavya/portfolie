# Mutta Navya — Portfolio Mobile App (PRD)

## Overview
A premium, futuristic, recruiter-friendly personal portfolio mobile app for **Mutta Navya**, a B.Tech CSE & ML student at Dadi Institute of Engineering & Technology (Autonomous). Built as a single-scroll Expo (React Native) app with anchored sections, glassmorphism, neon glow, and animated visuals.

## Tech
- Expo (React Native) with Expo Router
- `expo-blur` for glassmorphism, `expo-linear-gradient` for gradients
- `expo-web-browser` (View Resume in-app) and `Linking` (Download / mailto / tel / social)
- `react-native-safe-area-context` for insets
- Animated API + Reanimated (particles, floating icons, portrait float, typing cursor, FAB)

## Sections (single scroll)
1. **Hero** — Glowing floating circular portrait, name, title, typing animation of 6 roles (AI & ML Student, Java Developer, Python Developer, Data Analytics Enthusiast, Cloud Learner, Problem Solver), animated particle background, floating tech icons, CTAs (View Resume, Download Resume, Contact Me), social icons (GitHub, LinkedIn, scroll-down).
2. **About Me** — Bio in a glass card.
3. **Education** — College, Degree, Duration (2023–2027), CGPA 8.45, Location.
4. **Skills** — Grouped chips: Programming, Cloud, Tools, Technologies.
5. **Projects** — 4 glass cards (Credit Card Fraud Detection, Browser History Simulator, Vehicle Accident Alert System, Smart Door Lock System) with description + tech chips. GitHub button is rendered only when a URL is provided (none currently supplied).
6. **Internships** — Vertical timeline with 5 items and neon connector.
7. **Certifications** — 8 items in a 2-column glassmorphic grid.
8. **Achievements** — CRT Elite Batch selection, 100+ ABHA card registrations, NPTEL Elite (Joy of Computing Using Python).
9. **Contact** — Email (mailto), phone (tel), GitHub, LinkedIn. Copyright footer.

## Global UX
- Sticky blurred top header with horizontally scrollable section links + dark/light theme toggle.
- Live scroll progress bar (neon accent) below the header.
- Floating back-to-top FAB appears after scrolling past 400px.
- Dark theme default (Black + Navy + Purple gradients); Light theme toggle available.

## Assets (verbatim URLs used)
- Portrait: `https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/bid3j9g6_WhatsApp%20Image%202026-07-21%20at%207.51.20%20PM.jpeg`
- Resume PDF: `https://customer-assets-rejwkqb3.emergentagent.net/job_navya-recruit/artifacts/axrouqjo_r1%20%281%29.pdf`

## Contact
- Email: muttanavyna@gmail.com
- Phone: +91 6302864849
- GitHub: https://github.com/muttanavya
- LinkedIn: https://www.linkedin.com/in/muttanavya-139966266

## Non-Goals / Guardrails
- No fake stats or fabricated content (e.g. no "12+ Projects", no fake testimonials).
- No backend — portfolio content is fully static in `/app/frontend/src/portfolio/data.ts`.
- No authentication, no push notifications.

## Files
- `/app/frontend/app/index.tsx` — main portfolio screen (sections, header, FAB).
- `/app/frontend/src/portfolio/data.ts` — content (skills, projects, internships, certs, achievements, contact).
- `/app/frontend/src/portfolio/theme.ts` — dark/light palettes + ThemeContext.
