import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Dynamic imports AFTER env is loaded — prevents ESM hoisting from
// initialising Payload config before PAYLOAD_SECRET / DATABASE_URI are set.
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config.js')

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Starting seed...')

  // ─── 1. Profile global ────────────────────────────────────────────────────
  console.log('📝 Seeding Profile global...')
  await payload.updateGlobal({
    slug: 'profile',
    data: {
      name: 'Ts. Muhammad Firdaus Bin Abdul Shukor',
      title:
        'Full Stack AI Engineer | React, Python, Typescript, GCP, Firebase, VercelAI, Genkit | Architecting AI-Driven Digital Ecosystems',
      email: 'daus.shukor@gmail.com',
      phone: '+6013-4883287',
      location: 'Puncak Alam, Selangor',
      linkedin: 'https://www.linkedin.com/in/dausshukor',
    },
  })
  console.log('✅ Profile done')

  // ─── 2. Categories ────────────────────────────────────────────────────────
  console.log('📂 Seeding Categories...')
  const categoryDefs = [
    { name: 'Professional Summary', slug: 'summary', order: 1 },
    { name: 'Technical Skills', slug: 'technical-skills', order: 2 },
    { name: 'Work Experience', slug: 'work-experience', order: 3 },
    { name: 'Past Projects', slug: 'past-projects', order: 4 },
    { name: 'Awards & Recognitions', slug: 'awards', order: 5 },
    { name: 'Education', slug: 'education', order: 6 },
  ]

  const catMap: Record<string, string> = {}
  for (const def of categoryDefs) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: def.slug } },
      limit: 1,
    })
    const doc =
      existing.docs.length > 0
        ? existing.docs[0]
        : await payload.create({ collection: 'categories', data: def })
    catMap[def.slug] = doc.id as string
    console.log(`  ✅ ${def.name}`)
  }

  // ─── 3. Articles ─────────────────────────────────────────────────────────
  console.log('📄 Seeding Articles...')

  // Helper
  const upsertArticle = async (data: Record<string, unknown>) => {
    const existing = await payload.find({
      collection: 'articles',
      where: { title: { equals: data.title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return payload.update({ collection: 'articles', id: existing.docs[0].id as string, data })
    }
    return payload.create({ collection: 'articles', data })
  }

  // — Professional Summary
  await upsertArticle({
    title: 'Professional Summary',
    category: catMap['summary'],
    date: '2025-01-01',
    summary:
      'Professional Technologist (Ts.) and Full-Stack Developer with 10+ years of experience architecting scalable web and mobile ecosystems serving 180,000+ users at UiTM across HR, healthcare, faculty, and governance systems. Master of Science (IT) graduate and Graduate Excellence Award recipient, with multiple university, national, and international innovation awards. Currently advancing AI-integrated digital solutions by combining deep full-stack expertise with intelligent automation.',
    order: 1,
  })
  console.log('  ✅ Professional Summary')

  // — Technical Skills (one article per skill group)
  const skills = [
    { title: 'Programming Languages', summary: 'PHP, Dart, JavaScript, TypeScript, Python', order: 1 },
    { title: 'Web Development', summary: 'Laravel, Angular, React, Node.js, Meilisearch, Moodle, Joomla, WordPress', order: 2 },
    { title: 'Mobile Development', summary: 'Flutter, Ionic, Capacitor, Apache Cordova', order: 3 },
    { title: 'Cloud Computing', summary: 'GCP, Firebase, Supabase, Netlify, DigitalOcean', order: 4 },
    { title: 'Databases', summary: 'MySQL, MariaDB, PostgreSQL, Firestore, MongoDB', order: 5 },
    { title: 'Frontend & UI/UX', summary: 'Progressive Web App (PWA), Responsive Web Design, Material Design', order: 6 },
    { title: 'AI', summary: 'LangChain, LangSmith, Google AI Studio, Google Genkit, Vercel AI SDK', order: 7 },
  ]
  for (const s of skills) {
    await upsertArticle({ ...s, category: catMap['technical-skills'], date: '2025-01-01' })
    console.log(`  ✅ Skills: ${s.title}`)
  }

  // — Work Experience
  const workExp = [
    {
      title: 'Senior Assistant IT Officer',
      subtitle: 'Digital Department, UiTM Shah Alam',
      date: '2024-03-01',
      isPresent: true,
      order: 1,
      highlights: [
        { text: 'Architected digital inclusivity by developing the AllCareYou module, automating financial aid and health service workflows for 500+ Persons with Disabilities (PWD) users, reducing manual processing time by 60%.' },
        { text: 'Streamlined campus governance through the MyHEP platform, engineering automated approval and tracking systems for 1000+ student associations to boost operational efficiency.' },
        { text: 'Unified the university ecosystem by enhancing AppsWarga, integrating 10+ legacy services into a single high-traffic platform to improve accessibility for 18,000+ users.' },
      ],
    },
    {
      title: 'Assistant IT Officer',
      subtitle: "Vice-Chancellor's Office, UiTM Shah Alam",
      date: '2023-01-01',
      endDate: '2024-03-01',
      order: 2,
      highlights: [
        { text: 'Transformed executive operations by designing the Unified VCO Platform, merging 5+ administrative modules into a secure hub that eliminated data silos and increased transparency.' },
        { text: 'Upheld strict regulatory compliance with Ministry of Higher Education (KPT) standards by architecting automated systems for Overseas Travel and Leadership Appointments across 34 campuses.' },
      ],
    },
    {
      title: 'Assistant IT Officer',
      subtitle: 'Hospital Al-Sultan Abdullah, UiTM Puncak Alam',
      date: '2021-02-01',
      endDate: '2023-01-01',
      order: 3,
      highlights: [
        { text: 'Digitalized patient-centric healthcare via the HASA Mobile Application, implementing secure authentication for real-time prescription tracking and digital check-ins for 5,000+ patients.' },
      ],
    },
    {
      title: 'Assistant IT Officer',
      subtitle: "Registrar's Office, UiTM Shah Alam",
      date: '2013-02-01',
      endDate: '2021-01-01',
      order: 4,
      highlights: [
        { text: 'Optimized human capital planning by developing the Workforce Optimization System, automating staff distribution and warrant request handling to JPA for 18,000+ employees.' },
        { text: 'Revolutionized recruitment protocols by building a cloud-based Online Examination System, utilizing randomized sequencing and auto-scoring to cut administrative workload by 60%.' },
      ],
    },
    {
      title: 'Assistant IT Officer (Contract)',
      subtitle: 'INeD, UiTM Shah Alam',
      date: '2011-11-01',
      endDate: '2013-01-01',
      order: 5,
      highlights: [
        { text: 'Systematized academic performance tracking through the Teaching Portfolio System, centralizing faculty documentation to improve data accessibility and reporting speed.' },
      ],
    },
  ]
  for (const w of workExp) {
    await upsertArticle({ ...w, category: catMap['work-experience'] })
    console.log(`  ✅ Work: ${w.title} @ ${w.subtitle}`)
  }

  // — Past Projects
  const projects = [
    {
      title: 'Case Management System + AI (CASE.AI)',
      subtitle: 'GAMUDA AI Academy',
      date: '2026-01-01',
      summary: 'Pioneered a CSI-inspired framework using AI to streamline multi-modal evidence documentation and automate incident reconstruction timelines and narratives. Built on Responsible AI principles with a "Human-in-the-loop" design.',
      technologies: [
        { name: 'React' }, { name: 'Firebase' }, { name: 'Python' },
        { name: 'TypeScript' }, { name: 'Gemini' }, { name: 'Genkit' }, { name: 'VercelAI' },
      ],
      order: 1,
    },
    {
      title: 'UiTM Happiness Walk',
      subtitle: 'UiTM',
      date: '2025-01-01',
      summary: 'Engineered a cross-platform mobile app for 34 campuses featuring real-time geolocation for automated checkpoint check-ins and gamified dashboards; supported university-wide wellness for 18,000+ users.',
      technologies: [{ name: 'Flutter' }, { name: 'Firebase' }],
      order: 2,
    },
    {
      title: 'Financial Literacy Platform for IPR BMT (FLIKE)',
      subtitle: 'Ministry of Economy and UiTM',
      date: '2025-01-01',
      summary: 'Developed a structured educational portal for the Ministry of Economy (IPR/BMT) to enhance national financial literacy, providing interactive resource management tools for sustainable income planning.',
      technologies: [{ name: 'DigitalOcean' }, { name: 'Laravel PHP' }, { name: 'MariaDB' }],
      order: 3,
    },
    {
      title: 'JIWE: Shariah-Compliant Caregiving Ecosystem',
      subtitle: 'UiTM (Master\'s Research)',
      date: '2024-01-01',
      summary: 'Conceptualized a service-on-demand caregiving architecture adapted from childcare-sharing models to provide Shariah-compliant matching and Active Aging modules for holistic elderly wellness through hobby-based engagement.',
      technologies: [{ name: 'Service Architecture' }, { name: 'Social Innovation' }, { name: 'User-Centric Design' }],
      order: 4,
    },
    {
      title: 'Med4u + EMA: QR-Based Medication Interoperability',
      subtitle: 'UiTM (Master\'s Research)',
      date: '2023-01-01',
      summary: 'Formulated the Electronic Medication Attributes (EMA) format as an HL7-inspired data structure designed to eliminate manual data entry for elderly users through QR-scannable transport. Developed the Med4u mobile application using HCI principles.',
      technologies: [{ name: 'Health Data Interoperability' }, { name: 'HL7 Standards' }, { name: 'Information Architecture' }],
      order: 5,
    },
    {
      title: 'Idea Bina Negara',
      subtitle: "Prime Minister's Office and UiTM",
      date: '2023-01-01',
      summary: 'Built a high-traffic engagement platform for the Prime Minister\'s Office to crowdsource Budget 2023 insights, implementing secure authentication and voting systems to bridge communication between youth and policymakers.',
      technologies: [{ name: 'Ionic Angular' }, { name: 'Firebase' }],
      order: 6,
    },
    {
      title: 'Maths for Rural Kids (MARK)',
      subtitle: 'Maybank Foundation, Yayasan Pelajaran MARA, and UiTM',
      date: '2022-01-01',
      summary: 'Customized an interactive e-learning ecosystem in collaboration with Maybank Foundation to bridge educational gaps, providing structured assessment tools and progress tracking for underserved rural communities.',
      technologies: [{ name: 'Moodle' }, { name: 'PHP' }, { name: 'MySQL' }],
      order: 7,
    },
    {
      title: 'Resident College Staff Management System (MySRK)',
      subtitle: 'UiTM',
      date: '2022-01-01',
      summary: 'Architected a Progressive Web App (PWA) featuring an intelligent scheduling algorithm to automate duty rosters for residential staff, eliminating manual paperwork and ensuring 24/7 high availability via cloud deployment.',
      technologies: [{ name: 'PWA' }, { name: 'Ionic Angular' }, { name: 'Firebase' }],
      order: 8,
    },
    {
      title: 'Networked-Integrated Legal Office Affairs Management System (NILAMS)',
      subtitle: 'UiTM',
      date: '2021-01-01',
      summary: 'Developed a specialized activity-tracking module for the Office of Legal Advisor to monitor MOA/MOU compliance and industry partnerships, ensuring real-time reporting and structured documentation.',
      technologies: [{ name: 'Laravel PHP' }, { name: 'MySQL' }],
      order: 9,
    },
    {
      title: 'Training Management System for University Leadership Directory (UniLeaD)',
      subtitle: 'AKEPT',
      date: '2020-01-01',
      summary: 'Designed a strategic leadership development platform for AKEPT to manage talent directories and certification issuance, streamlining the end-to-end training workflow for higher education leaders.',
      technologies: [{ name: 'Ionic Angular' }, { name: 'Capacitor' }, { name: 'Firebase' }],
      order: 10,
    },
  ]
  for (const p of projects) {
    await upsertArticle({ ...p, category: catMap['past-projects'] })
    console.log(`  ✅ Project: ${p.title}`)
  }

  // — Awards & Recognitions
  const awards = [
    { title: 'Champion Capstone Demo Day', subtitle: 'Gamuda AI Academy Cohort 5 (KL Campus)', date: '2026-01-01', order: 1 },
    { title: 'Graduate Excellence Award (ASC)', subtitle: "Master's Degree, 103rd UiTM Convocation", date: '2025-01-01', order: 2 },
    { title: 'Professional Technologist (Ts.)', subtitle: 'Malaysia Board of Technologists (MBOT)', date: '2025-01-01', order: 3 },
    { title: 'Best Administrator Award', subtitle: 'UiTM Administrator Award (APU)', date: '2025-01-01', order: 4 },
    { title: 'Best Award & 3 Gold Medals', subtitle: '3rd International Competition of Entrepreneurship Business Innovation (ICEBIV)', date: '2024-01-01', order: 5 },
    { title: 'Gold Award', subtitle: 'Disability Invention, Design and Innovation Award (DIDI)', date: '2024-01-01', order: 6 },
    { title: '1st Placing, Gold Award & Jury Award', subtitle: '5th National Symposium on Human-Computer Interaction (FUSION)', date: '2023-01-01', order: 7 },
    { title: 'Best Video Award & Gold Award', subtitle: 'INVENTOPIA: FBM-Seremban International Innovation Competition', date: '2023-01-01', order: 8 },
    { title: 'Gold Award (Creative & Innovative Administrator)', subtitle: 'UiTM Administrator Award (APU)', date: '2023-01-01', order: 9 },
    { title: 'Runner-up & Gold Award', subtitle: 'Innovative & Creative Group (KIK) Convention', date: '2022-01-01', order: 10 },
    { title: 'Gold & Silver Medal', subtitle: 'International Student Invention, Innovation & Development Exhibition', date: '2022-01-01', order: 11 },
  ]
  for (const a of awards) {
    await upsertArticle({ ...a, category: catMap['awards'] })
    console.log(`  ✅ Award: ${a.title}`)
  }

  // — Education
  await upsertArticle({
    title: 'Master of Science (Information Technology)',
    subtitle: 'Universiti Teknologi MARA',
    date: '2025-01-01',
    category: catMap['education'],
    order: 1,
  })
  console.log('  ✅ Education: MSc IT')

  // ─── 4. Frontend User ─────────────────────────────────────────────────────
  console.log('👤 Creating Frontend User...')
  const existing = await payload.find({
    collection: 'frontend-users',
    where: { email: { equals: 'viewer@cvapp.local' } },
    limit: 1,
  })
  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'frontend-users',
      data: {
        name: 'Demo Viewer',
        email: 'viewer@cvapp.local',
        password: 'ViewCV2026!',
      },
    })
    console.log('  ✅ Frontend User created: viewer@cvapp.local / ViewCV2026!')
  } else {
    console.log('  ℹ️  Frontend User already exists')
  }

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
