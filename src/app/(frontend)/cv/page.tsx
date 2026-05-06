import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Highlight {
  text: string
  id?: string
}

interface Technology {
  name: string
  id?: string
}

interface Category {
  id: string
  name: string
  slug: string
  order?: number
}

interface Article {
  id: string
  title: string
  subtitle?: string
  date: string
  endDate?: string
  isPresent?: boolean
  summary?: string
  highlights?: Highlight[]
  technologies?: Technology[]
  order?: number
  category: Category | string
}

interface ProfileData {
  name: string
  title?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return {}
  return { Authorization: `JWT ${token}` }
}

async function fetchProfile(headers: Record<string, string>): Promise<ProfileData | null> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/globals/profile`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

async function fetchArticles(headers: Record<string, string>): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/articles?limit=200&sort=-date&depth=1`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}

async function fetchCategories(headers: Record<string, string>): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/categories?limit=50&sort=order`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}

// ─── Helper: format date range ────────────────────────────────────────────────

function formatDateRange(article: Article): string {
  const start = article.date
    ? new Date(article.date).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })
    : ''
  if (article.isPresent) return `${start} – Present`
  if (article.endDate) {
    const end = new Date(article.endDate).toLocaleDateString('en-MY', {
      month: 'short',
      year: 'numeric',
    })
    return `${start} – ${end}`
  }
  return start
}

// ─── Section components ───────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-4">
      {children}
    </h2>
  )
}

function WorkExperienceSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <SectionHeading>Work Experience</SectionHeading>
      <div className="space-y-6">
        {articles.map((a) => (
          <div key={a.id}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
              <h3 className="font-semibold text-slate-800">{a.title}</h3>
              <span className="text-xs text-slate-400 whitespace-nowrap">{formatDateRange(a)}</span>
            </div>
            {a.subtitle && <p className="text-sm text-slate-500 mb-1">{a.subtitle}</p>}
            {a.highlights && a.highlights.length > 0 && (
              <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-slate-700">
                {a.highlights.map((h, i) => (
                  <li key={i}>{h.text}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <SectionHeading>Education</SectionHeading>
      <div className="space-y-4">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5"
          >
            <div>
              <h3 className="font-semibold text-slate-800">{a.title}</h3>
              {a.subtitle && <p className="text-sm text-slate-500">{a.subtitle}</p>}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {a.date ? new Date(a.date).getFullYear() : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <SectionHeading>Technical Skills</SectionHeading>
      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a.id} className="flex flex-col sm:flex-row gap-1">
            <span className="text-sm font-semibold text-slate-700 sm:w-48 shrink-0">
              {a.title}:
            </span>
            <span className="text-sm text-slate-600">{a.summary}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProjectsSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <SectionHeading>Past Projects</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((a) => (
          <div key={a.id} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
              {a.date && (
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(a.date).getFullYear()}
                </span>
              )}
            </div>
            {a.subtitle && (
              <p className="text-xs text-indigo-600 font-medium mt-0.5">{a.subtitle}</p>
            )}
            {a.summary && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.summary}</p>
            )}
            {a.technologies && a.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {a.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function AwardsSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <SectionHeading>Awards &amp; Recognitions</SectionHeading>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.id} className="flex gap-3 items-start">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md whitespace-nowrap mt-0.5">
              {a.date ? new Date(a.date).getFullYear() : ''}
            </span>
            <div>
              <span className="text-sm font-semibold text-slate-800">{a.title}</span>
              {a.subtitle && <span className="text-sm text-slate-500"> — {a.subtitle}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SummarySection({ articles }: { articles: Article[] }) {
  const summary = articles[0]
  if (!summary?.summary) return null
  return (
    <section>
      <SectionHeading>Professional Summary</SectionHeading>
      <p className="text-sm text-slate-700 leading-relaxed">{summary.summary}</p>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CVPage() {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders.Authorization) {
    redirect('/login')
  }

  const [profile, articles, categories] = await Promise.all([
    fetchProfile(authHeaders),
    fetchArticles(authHeaders),
    fetchCategories(authHeaders),
  ])

  if (!profile) {
    redirect('/login')
  }

  // Group articles by category slug
  const bySlug: Record<string, Article[]> = {}
  for (const article of articles) {
    const cat = article.category as Category
    const slug = cat?.slug ?? 'uncategorised'
    if (!bySlug[slug]) bySlug[slug] = []
    bySlug[slug].push(article)
  }

  // Sort articles within each group by date descending
  for (const slug of Object.keys(bySlug)) {
    bySlug[slug].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
          {profile.title && (
            <p className="text-base text-indigo-600 font-medium mt-1">{profile.title}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-indigo-600">
                {profile.email}
              </a>
            )}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600"
              >
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* CV Sections */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-10">
          {bySlug['summary'] && <SummarySection articles={bySlug['summary']} />}

          {bySlug['technical-skills'] && <SkillsSection articles={bySlug['technical-skills']} />}

          {bySlug['work-experience'] && (
            <WorkExperienceSection articles={bySlug['work-experience']} />
          )}

          {bySlug['past-projects'] && <ProjectsSection articles={bySlug['past-projects']} />}

          {bySlug['awards'] && <AwardsSection articles={bySlug['awards']} />}

          {bySlug['education'] && <EducationSection articles={bySlug['education']} />}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pb-4">
          References available upon request
        </footer>
      </div>
    </div>
  )
}
