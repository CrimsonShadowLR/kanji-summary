'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { VocabItem, KanjiItem } from '@/lib/data/types'
import StudyView from './StudyView'

type Item = VocabItem | KanjiItem

interface Props {
  items: Item[]
  section: 'vocabulary' | 'kanji'
}

function isVocab(item: Item): item is VocabItem { return 'word' in item }

const BADGE_COLORS = [
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
]

function categoryColor(cat: string) {
  let hash = 0
  for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash)
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length]
}

export default function SectionContent({ items, section }: Props) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const stickyRef = useRef<HTMLDivElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })
  const [pillsOverflow, setPillsOverflow] = useState({ left: false, right: false })

  const allCategories = useMemo(() => {
    const seen = new Set<string>()
    const cats: string[] = []
    for (const item of items) {
      if (!seen.has(item.category)) { seen.add(item.category); cats.push(item.category) }
    }
    return cats
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase()
      let matchSearch = true
      let matchCat = true

      if (q) {
        if (isVocab(item)) {
          matchSearch = item.word.includes(q) || item.reading.includes(q) || item.meaning.toLowerCase().includes(q)
        } else {
          const k = item as KanjiItem
          matchSearch = k.kanji.includes(q) || k.meanings.some((m) => m.toLowerCase().includes(q)) ||
            k.onReadings.some((r) => r.includes(q)) || k.kunReadings.some((r) => r.includes(q))
        }
      }

      if (categoryFilter !== 'All') {
        matchCat = item.category === categoryFilter
      }

      return matchSearch && matchCat
    })
  }, [items, search, categoryFilter])

  const visibleCategories = useMemo(() => {
    const seen = new Set<string>()
    const cats: string[] = []
    for (const item of filtered) {
      if (!seen.has(item.category)) { seen.add(item.category); cats.push(item.category) }
    }
    return cats
  }, [filtered])

  useEffect(() => {
    const el = pillsRef.current
    if (!el) return
    const check = () => {
      setPillsOverflow({
        left: el.scrollLeft > 0,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      })
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', check); ro.disconnect() }
  }, [visibleCategories])

  const scrollToSection = useCallback((cat: string) => {
    const el = sectionRefs.current[cat]
    if (!el) return
    const stickyHeight = stickyRef.current?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.scrollY - stickyHeight - 8
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveSection(cat)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <div
        ref={stickyRef}
        className="sticky top-0 z-20 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur -mx-6 px-6 pt-3 pb-3 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-3"
      >
        {/* Search + filter */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder={section === 'kanji' ? 'Search kanji, meaning, reading…' : 'Search…'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {section === 'vocabulary' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="All">All</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {filtered.length} items
          </span>
        </div>

        {/* Category pills */}
        {visibleCategories.length > 1 && (
          <div className="relative">
            {pillsOverflow.left && (
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-gray-50/95 dark:from-gray-950/95 to-transparent" />
            )}
            {pillsOverflow.right && (
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-gray-50/95 dark:from-gray-950/95 to-transparent" />
            )}
            <div
              ref={pillsRef}
              className="flex gap-2 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                const el = pillsRef.current!
                dragState.current = { isDragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
              }}
              onMouseMove={(e) => {
                if (!dragState.current.isDragging) return
                e.preventDefault()
                const el = pillsRef.current!
                const x = e.pageX - el.offsetLeft
                el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX)
              }}
              onMouseUp={() => { dragState.current.isDragging = false }}
              onMouseLeave={() => { dragState.current.isDragging = false }}
            >
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToSection(cat)}
                  className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                    activeSection === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        <StudyView
          filteredItems={filtered}
          section={section}
          sectionRefs={sectionRefs}
          categoryColor={categoryColor}
        />
      </div>
    </div>
  )
}
