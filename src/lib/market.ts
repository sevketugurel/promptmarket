import { CREATORS, PROMPTS } from '../data/prompts'
import type { Creator, Prompt, PromptCategory, SortMode } from '../types'

export const CATEGORIES: PromptCategory[] = ['All', 'LLMs', 'Image Generation', 'Code', 'Marketing', 'Research']

export const SORT_LABELS: Record<SortMode, string> = {
  featured: 'Featured',
  success: 'Highest success',
  newest: 'Newest',
  'price-low': 'Lowest price',
  trending: 'Trending',
}

export function formatUses(uses: number) {
  if (uses >= 1000) return `${(uses / 1000).toFixed(uses >= 10000 ? 0 : 1)}k`
  return uses.toString()
}

export function formatMon(value: number) {
  return `${value.toFixed(2)} MON`
}

export function getCreator(creatorId: string): Creator {
  return CREATORS.find((creator) => creator.id === creatorId) ?? CREATORS[0]
}

export function findPrompt(promptIdOrSlug: string | undefined) {
  if (!promptIdOrSlug) return undefined
  return PROMPTS.find((prompt) => prompt.slug === promptIdOrSlug || prompt.id.toString() === promptIdOrSlug)
}

export function categoryCount(category: PromptCategory) {
  if (category === 'All') return PROMPTS.length
  return PROMPTS.filter((prompt) => prompt.category === category).length
}

export function totalSpentFor(unlockedIds: number[]) {
  return unlockedIds.reduce((sum, id) => {
    const prompt = PROMPTS.find((item) => item.id === id)
    return sum + (prompt?.price ?? 0)
  }, 0)
}

export function filterPrompts({
  searchTerm,
  category,
  tool,
  price,
  minimumSuccess,
  sortMode,
  creatorId,
}: {
  searchTerm: string
  category: PromptCategory
  tool: string
  price: string
  minimumSuccess: number
  sortMode: SortMode
  creatorId?: string
}) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return PROMPTS
    .filter((prompt) => !creatorId || prompt.creatorId === creatorId)
    .filter((prompt) => category === 'All' || prompt.category === category)
    .filter((prompt) => tool === 'All' || prompt.tool === tool)
    .filter((prompt) => {
      if (price === 'All') return true
      if (price === '0.05') return prompt.price <= 0.05
      if (price === '0.10') return prompt.price <= 0.1
      return true
    })
    .filter((prompt) => prompt.successRate >= minimumSuccess)
    .filter((prompt) => {
      if (!normalizedSearch) return true
      const creator = getCreator(prompt.creatorId)
      return [
        prompt.title,
        prompt.description,
        prompt.category,
        prompt.tool,
        prompt.tag,
        prompt.author,
        prompt.authorHandle,
        prompt.teaser,
        creator.bio,
        ...prompt.tags,
        ...creator.specialties,
      ].some((value) => value.toLowerCase().includes(normalizedSearch))
    })
    .sort((a, b) => sortPrompts(a, b, sortMode))
}

export function relatedPrompts(prompt: Prompt, limit = 3) {
  return PROMPTS.filter((candidate) => candidate.id !== prompt.id)
    .sort((a, b) => {
      const aScore = relationScore(prompt, a)
      const bScore = relationScore(prompt, b)
      return bScore - aScore || b.successRate - a.successRate
    })
    .slice(0, limit)
}

export function creatorPrompts(creatorId: string) {
  return PROMPTS.filter((prompt) => prompt.creatorId === creatorId).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.successRate - a.successRate
  )
}

export function toolOptions() {
  return ['All', ...Array.from(new Set(PROMPTS.map((prompt) => prompt.tool))).sort()]
}

function sortPrompts(a: Prompt, b: Prompt, sortMode: SortMode) {
  if (sortMode === 'price-low') return a.price - b.price || b.successRate - a.successRate
  if (sortMode === 'newest') return Date.parse(b.createdAt) - Date.parse(a.createdAt)
  if (sortMode === 'trending') {
    const aRank = a.trendingRank ?? Number.MAX_SAFE_INTEGER
    const bRank = b.trendingRank ?? Number.MAX_SAFE_INTEGER
    return aRank - bRank || b.uses - a.uses
  }
  if (sortMode === 'featured') {
    return Number(b.featured) - Number(a.featured) || b.successRate - a.successRate
  }
  return b.successRate - a.successRate
}

function relationScore(base: Prompt, candidate: Prompt) {
  const tagMatches = candidate.tags.filter((tag) => base.tags.includes(tag)).length
  return (
    (candidate.category === base.category ? 3 : 0) +
    (candidate.creatorId === base.creatorId ? 2 : 0) +
    (candidate.tool === base.tool ? 2 : 0) +
    tagMatches
  )
}
