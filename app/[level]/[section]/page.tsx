import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getData } from '@/lib/data/index'
import SectionContent from '@/components/SectionContent'
import { VocabItem, KanjiItem } from '@/lib/data/types'

const AVAILABLE_LEVELS = ['n5', 'n4']
const AVAILABLE_SECTIONS = ['vocabulary', 'kanji']

const LEVEL_LABELS: Record<string, string> = {
  n5: 'N5',
  n4: 'N4',
}

const SECTION_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  kanji: 'Kanji',
}

const SECTION_ICONS: Record<string, string> = {
  vocabulary: '📝',
  kanji: '漢',
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ level: string; section: string }>
}) {
  const { level, section } = await params

  if (!AVAILABLE_LEVELS.includes(level) || !AVAILABLE_SECTIONS.includes(section)) {
    notFound()
  }

  const data = getData(level, section)
  if (!data || data.length === 0) notFound()

  const sectionType = section as 'vocabulary' | 'kanji'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href={`/${level}`}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
          >
            ← Back
          </Link>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-xl">{SECTION_ICONS[section]}</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {LEVEL_LABELS[level]} · {SECTION_LABELS[section]}
            </span>
          </div>
          <div className="ml-auto">
            <span className="text-sm text-gray-400 dark:text-gray-500">{data.length} items</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <SectionContent items={data as (VocabItem | KanjiItem)[]} section={sectionType} />
      </main>
    </div>
  )
}
