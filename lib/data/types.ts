export type Level = 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
export type Section = 'vocabulary' | 'kanji'

export interface VocabItem {
  id: string
  word: string
  reading: string
  meaning: string
  category: string
  example?: string
  exampleReading?: string
  exampleMeaning?: string
}

export interface KanjiItem {
  id: string
  kanji: string
  onReadings: string[]
  kunReadings: string[]
  meanings: string[]
  examples: { word: string; reading: string; meaning: string }[]
  strokeCount: number
  category: string
}
