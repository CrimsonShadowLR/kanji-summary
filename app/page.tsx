import Link from 'next/link'

const LEVELS = [
  {
    level: 'n5',
    label: 'N5',
    description: 'Beginner · Basic vocab & kanji',
    available: true,
    items: '217 words · 80 kanji',
  },
  {
    level: 'n4',
    label: 'N4',
    description: 'Elementary · Everyday expressions',
    available: true,
    items: '216 words · 166 kanji',
  },
  {
    level: 'n3',
    label: 'N3',
    description: 'Intermediate · Real-life topics',
    available: false,
    items: 'Coming soon',
  },
  {
    level: 'n2',
    label: 'N2',
    description: 'Upper-intermediate · Near fluency',
    available: false,
    items: 'Coming soon',
  },
  {
    level: 'n1',
    label: 'N1',
    description: 'Advanced · Full proficiency',
    available: false,
    items: 'Coming soon',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">漢</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Kanji Summary</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">JLPT vocab & kanji reference · N5 → N1</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Select your level</h2>
          <p className="text-gray-500 dark:text-gray-400">Choose a JLPT level to browse vocabulary and kanji.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map(({ level, label, description, available, items }) =>
            available ? (
              <Link
                key={level}
                href={`/${level}`}
                className="group bg-white dark:bg-gray-900 border-2 border-red-100 dark:border-red-900/40 rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:border-red-400 dark:hover:border-red-500 hover:shadow-md transition-all duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-black text-red-600">{label}</div>
                  <span className="text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{description}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{items}</div>
                </div>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium group-hover:translate-x-1 transition-transform duration-150">
                  Browse →
                </div>
              </Link>
            ) : (
              <div
                key={level}
                className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-3 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-black text-gray-400 dark:text-gray-600">{label}</div>
                  <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    Soon
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-500 dark:text-gray-400">{description}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{items}</div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
