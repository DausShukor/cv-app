import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

interface MediaDoc {
  id: string
  url?: string
  filename?: string
}

interface ProfileData {
  name: string
  title?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  photo?: MediaDoc | string | null
}

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2 className="text-[10.5pt] font-bold uppercase tracking-wider text-slate-900 print:text-black">
        {children}
      </h2>
      <div className="h-[1.5px] bg-slate-800 mt-0.5 print:bg-black" />
    </div>
  )
}

function ProfessionalSummarySection({ articles }: { articles: Article[] }) {
  const summary = articles[0]
  if (!summary?.summary) return null
  return (
    <section className="mb-5">
      <SectionHeading>Professional Summary</SectionHeading>
      <p className="text-[9.5pt] text-slate-700 leading-relaxed print:text-black">
        {summary.summary}
      </p>
    </section>
  )
}

function TechnicalSkillsSection({ articles }: { articles: Article[] }) {
  return (
    <section className="mb-5">
      <SectionHeading>Technical Skills</SectionHeading>
      <ul className="space-y-1">
        {articles.map((a) => (
          <li key={a.id} className="text-[9.5pt] text-slate-700 print:text-black">
            <span className="font-bold text-slate-900 print:text-black">{a.title}:</span>{' '}
            <span className="italic">{a.summary}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function EducationSection({ articles }: { articles: Article[] }) {
  return (
    <section className="mb-5">
      <SectionHeading>Education</SectionHeading>
      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a.id} className="flex justify-between items-baseline gap-2">
            <div>
              <span className="font-bold text-[9.5pt] text-slate-900 print:text-black">
                {a.title}
              </span>
              {a.subtitle && (
                <span className="text-[9.5pt] text-slate-700 print:text-black">
                  {' '}
                  | {a.subtitle}
                </span>
              )}
            </div>
            <span className="text-[9.5pt] text-slate-700 whitespace-nowrap print:text-black">
              {a.date ? new Date(a.date).getFullYear() : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function WorkExperienceSection({ articles }: { articles: Article[] }) {
  return (
    <section className="mb-5">
      <SectionHeading>Work Experience</SectionHeading>
      <div className="space-y-4">
        {articles.map((a) => (
          <div key={a.id}>
            <div className="flex justify-between items-baseline gap-2">
              <span className="font-bold text-[9.5pt] text-slate-900 print:text-black">
                {a.title}
              </span>
              <span className="text-[9pt] text-slate-600 whitespace-nowrap print:text-black">
                {formatDateRange(a)}
              </span>
            </div>
            {a.subtitle && (
              <p className="text-[9.5pt] text-slate-600 italic print:text-black">{a.subtitle}</p>
            )}
            {a.highlights && a.highlights.length > 0 && (
              <ul className="mt-1 space-y-0.5 list-disc list-outside pl-4">
                {a.highlights.map((h, i) => (
                  <li key={i} className="text-[9.5pt] text-slate-700 print:text-black">
                    {h.text.includes(':') ? (
                      <>
                        <strong className="font-semibold text-slate-900 print:text-black">
                          {h.text.split(':')[0]}:
                        </strong>
                        {h.text.substring(h.text.indexOf(':') + 1)}
                      </>
                    ) : (
                      h.text
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function PastProjectsSection({ articles }: { articles: Article[] }) {
  return (
    <section className="mb-5">
      <SectionHeading>Past Projects</SectionHeading>
      <div className="space-y-4">
        {articles.map((a) => (
          <div key={a.id}>
            <div className="flex justify-between items-baseline gap-2">
              <span className="font-bold text-[9.5pt] text-slate-900 print:text-black">
                {a.title}
              </span>
              <span className="text-[9pt] text-slate-600 whitespace-nowrap print:text-black">
                {a.date ? new Date(a.date).getFullYear() : ''}
              </span>
            </div>
            {a.subtitle && (
              <p className="text-[9.5pt] text-slate-600 print:text-black">{a.subtitle}</p>
            )}
            {a.summary && (
              <p className="text-[9.5pt] text-slate-700 mt-0.5 print:text-black">{a.summary}</p>
            )}
            {a.technologies && a.technologies.length > 0 && (
              <p className="text-[9pt] text-slate-600 italic mt-0.5 print:text-black">
                (Technologies: {a.technologies.map((t) => t.name).join(', ')})
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function AwardsSection({ articles }: { articles: Article[] }) {
  return (
    <section className="mb-5">
      <SectionHeading>Awards &amp; Recognitions</SectionHeading>
      <ul className="space-y-1 list-disc list-outside pl-4">
        {articles.map((a) => (
          <li key={a.id} className="text-[9.5pt] text-slate-700 print:text-black">
            <span className="font-bold text-slate-900 print:text-black">
              {a.date ? new Date(a.date).getFullYear() : ''}
            </span>{' '}
            | <span className="font-bold text-slate-900 print:text-black">{a.title}</span>
            {a.subtitle && <span className="text-slate-700 print:text-black">: {a.subtitle}</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function CVPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/login')
  }

  const payload = await getPayload({ config: configPromise })

  const [profileData, articlesData] = await Promise.all([
    payload.findGlobal({ slug: 'profile', depth: 1, overrideAccess: true }),
    payload.find({ collection: 'articles', limit: 200, sort: '-date', depth: 1, overrideAccess: true }),
  ])

  const profile = profileData as unknown as ProfileData
  const articles = (articlesData.docs ?? []) as unknown as Article[]

  if (!profile?.name) {
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

  let photoUrl: string | null = null
  if (profile.photo && typeof profile.photo === 'object') {
    const media = profile.photo as MediaDoc
    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    photoUrl = media.url || (media.filename ? `${base}/api/media/file/${media.filename}` : null)
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* CV document — A4-ish width */}
      <div className="max-w-[794px] mx-auto bg-white shadow-sm mt-6 mb-10 px-10 py-8 print:shadow-none print:mt-0 print:mb-0 print:px-8 print:py-6">
        {/* ── Header ── */}
        <header className="flex gap-6 mb-6">
          <div
            className="shrink-0 overflow-hidden rounded border border-slate-200"
            style={{ width: '90px', aspectRatio: '7/10' }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100" />
            )}
          </div>

          {/* Name + title + contact */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[20pt] font-bold text-slate-900 leading-tight print:text-black">
              {profile.name}
            </h1>
            {profile.title && (
              <p className="text-[10pt] text-slate-700 mt-0.5 leading-snug print:text-black">
                {profile.title}
              </p>
            )}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-2 text-[9pt] text-slate-600 print:text-black">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="hover:underline print:no-underline">
                  {profile.email}
                </a>
              )}
              {profile.phone && <span>| {profile.phone}</span>}
              {profile.location && <span>| {profile.location}</span>}
              {profile.linkedin && (
                <span>
                  |{' '}
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline print:no-underline"
                  >
                    {profile.linkedin}
                  </a>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── CV Body ── */}
        <div>
          {bySlug['summary'] && <ProfessionalSummarySection articles={bySlug['summary']} />}
          {bySlug['technical-skills'] && (
            <TechnicalSkillsSection articles={bySlug['technical-skills']} />
          )}
          {bySlug['education'] && <EducationSection articles={bySlug['education']} />}
          {bySlug['work-experience'] && (
            <WorkExperienceSection articles={bySlug['work-experience']} />
          )}
          {bySlug['past-projects'] && <PastProjectsSection articles={bySlug['past-projects']} />}
          {bySlug['awards'] && <AwardsSection articles={bySlug['awards']} />}

          {/* Reference */}
          <section>
            <SectionHeading>Reference</SectionHeading>
            <p className="text-[9.5pt] text-slate-700 print:text-black">
              References available upon request
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
