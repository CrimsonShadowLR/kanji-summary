import Link from 'next/link'
import { notFound } from 'next/navigation'

const AVAILABLE_LEVELS = ['n5', 'n4']

const SECTIONS = [
  {
    section: 'vocabulary',
    label: 'Vocabulary',
    icon: '📝',
    description: 'Words, readings, and meanings',
  },
  {
    section: 'kanji',
    label: 'Kanji',
    icon: '漢',
    description: 'Characters, readings, and examples',
  },
]

const LEVEL_LABELS: Record<string, string> = {
  n5: 'N5 — Beginner',
  n4: 'N4 — Elementary',
  n3: 'N3 — Intermediate',
  n2: 'N2 — Upper-Intermediate',
  n1: 'N1 — Advanced',
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params

  if (!AVAILABLE_LEVELS.includes(level)) notFound()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm">
            ← Back
          </Link>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">漢</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{LEVEL_LABELS[level] ?? level.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">What would you like to browse?</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Pick a section to review content.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECTIONS.map(({ section, label, icon, description }) => (
            <Link
              key={section}
              href={`/${level}/${section}`}
              className="group bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all duration-150"
            >
              <div className="text-4xl">{icon}</div>
              <div className="flex flex-col gap-1">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 font-medium group-hover:translate-x-1 transition-transform duration-150 mt-auto">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
