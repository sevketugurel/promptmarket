export type PromptCategory = 'All' | 'LLMs' | 'Image Generation' | 'Code' | 'Marketing' | 'Research'

export type SortMode = 'featured' | 'success' | 'newest' | 'price-low' | 'trending'

export type RevealPhase = 'idle' | 'committing' | 'revealed' | 'failed'

export interface Prompt {
  id: number
  slug: string
  title: string
  description: string
  category: Exclude<PromptCategory, 'All'>
  price: number
  creatorId: string
  author: string
  authorHandle: string
  secretPrompt: string
  teaser: string
  tag: string
  tool: string
  successRate: number
  uses: number
  createdAt: string
  featured: boolean
  trendingRank: number | null
  refundRate: number
  tags: string[]
}

export interface Creator {
  id: string
  handle: string
  displayName: string
  bio: string
  avatar: string
  verified: boolean
  totalSales: number
  successRate: number
  refundRate: number
  specialties: string[]
  joinedAt: string
}

export interface PerformanceRecord {
  promptId: number
  startMs: number
  endMs: number | null
  gasEstimate: string
}
