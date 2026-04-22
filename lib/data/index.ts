import { n5Vocabulary } from './n5/vocabulary'
import { n5Kanji } from './n5/kanji'
import { n4Vocabulary } from './n4/vocabulary'
import { n4Kanji } from './n4/kanji'
import { VocabItem, KanjiItem } from './types'

export type SectionData = VocabItem[] | KanjiItem[]

export function getData(level: string, section: string): SectionData | null {
  if (level === 'n5') {
    if (section === 'vocabulary') return n5Vocabulary
    if (section === 'kanji') return n5Kanji
  }
  if (level === 'n4') {
    if (section === 'vocabulary') return n4Vocabulary
    if (section === 'kanji') return n4Kanji
  }
  return null
}

export function isVocabData(data: SectionData): data is VocabItem[] {
  return data.length > 0 && 'word' in data[0]
}

export function isKanjiData(data: SectionData): data is KanjiItem[] {
  return data.length > 0 && 'kanji' in data[0]
}

export { n5Vocabulary, n5Kanji }
export type { VocabItem, KanjiItem }
