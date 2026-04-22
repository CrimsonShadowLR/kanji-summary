'use client'

import { useMemo, useState } from 'react'
import { VocabItem, KanjiItem } from '@/lib/data/types'

type Item = VocabItem | KanjiItem

interface Props {
  filteredItems: Item[]
  section: 'vocabulary' | 'kanji'
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  categoryColor: (cat: string) => string
}

function isVocab(item: Item): item is VocabItem { return 'word' in item }
function isKanji(item: Item): item is KanjiItem { return 'kanji' in item }

function getItemCategory(item: Item): string {
  return item.category
}

function VocabCard({ item, categoryColor }: { item: VocabItem; categoryColor: (c: string) => string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{item.word}</div>
          {item.word !== item.reading && (
            <div className="text-base text-gray-500 dark:text-gray-400">{item.reading}</div>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${categoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
      <div className="text-base text-gray-700 dark:text-gray-300 font-medium">{item.meaning}</div>
      {item.example && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-1 text-sm">
          <div className="text-gray-800 dark:text-gray-200">{item.example}</div>
          {item.exampleReading && (
            <div className="text-gray-500 dark:text-gray-400 text-xs">{item.exampleReading}</div>
          )}
          {item.exampleMeaning && (
            <div className="text-gray-600 dark:text-gray-400 italic">{item.exampleMeaning}</div>
          )}
        </div>
      )}
    </div>
  )
}

function KanjiCard({ item }: { item: KanjiItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 leading-none w-20 text-center">{item.kanji}</div>
        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold text-gray-800 dark:text-gray-200">{item.meanings.join(', ')}</div>
          {item.onReadings.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">On: </span>
              {item.onReadings.join('、')}
            </div>
          )}
          {item.kunReadings.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-green-600 dark:text-green-400">Kun: </span>
              {item.kunReadings.join('、')}
            </div>
          )}
          <div className="text-xs text-gray-400 dark:text-gray-500">{item.strokeCount} strokes</div>
        </div>
      </div>
      {item.examples.length > 0 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-left"
          >
            {open ? '▲ Hide examples' : '▼ Show examples'}
          </button>
          {open && (
            <div className="flex flex-col gap-2">
              {item.examples.map((ex, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex gap-3 text-sm items-baseline">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{ex.word}</span>
                  <span className="text-gray-500 dark:text-gray-400">{ex.reading}</span>
                  <span className="text-gray-600 dark:text-gray-400 italic">{ex.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function StudyView({ filteredItems, section, sectionRefs, categoryColor }: Props) {
  const groupedItems = useMemo(() => {
    const groups: { category: string; items: Item[] }[] = []
    const map = new Map<string, Item[]>()
    for (const item of filteredItems) {
      const cat = getItemCategory(item)
      if (!map.has(cat)) {
        map.set(cat, [])
        groups.push({ category: cat, items: map.get(cat)! })
      }
      map.get(cat)!.push(item)
    }
    return groups
  }, [filteredItems])

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        No items match your search.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {groupedItems.map(({ category, items: groupItems }) => (
        <div
          key={category}
          ref={(el) => { sectionRefs.current[category] = el }}
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${categoryColor(category).split(' ')[0]}`} />
            {category}
            <span className="font-normal normal-case tracking-normal text-gray-400 dark:text-gray-600">
              — {groupItems.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groupItems.map((item) => {
              if (isVocab(item)) return <VocabCard key={item.id} item={item} categoryColor={categoryColor} />
              if (isKanji(item)) return <KanjiCard key={item.id} item={item} />
              return null
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
