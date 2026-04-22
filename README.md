# Kanji Summary

JLPT vocabulary and kanji reference — N5 through N1.

## Stack

- **Next.js 16** · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **pnpm**

## Features

- Browse JLPT levels N5 and N4 (N3–N1 coming soon)
- Vocabulary section: word, reading, meaning, example sentences grouped by category
- Kanji section: on/kun readings, meanings, stroke count, expandable example words
- Sticky search bar with live filtering by text and category
- Draggable category pill nav that jumps to sections
- Dark mode

## Data

| Level | Vocabulary | Kanji |
|-------|-----------|-------|
| N5    | 217 words | 80    |
| N4    | 216 words | 166   |

Static TypeScript data in `lib/data/n5/` and `lib/data/n4/`. Types in `lib/data/types.ts`.

## Routes

```
/               — level picker
/[level]        — section picker (vocabulary / kanji)
/[level]/[section] — study view
```

## Dev

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build
pnpm lint
```
