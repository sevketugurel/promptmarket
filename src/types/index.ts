export type PromptCategory = 'All' | 'LLMs' | 'Image Generation' | 'Code'

export interface Prompt {
  id: number
  title: string
  description: string
  category: Exclude<PromptCategory, 'All'>
  price: number
  author: string
  authorHandle: string
  secretPrompt: string
  tag: string
  tool: string
  successRate: number
  uses: number
  tags: string[]
}

export interface PerformanceRecord {
  promptId: number
  startMs: number
  endMs: number | null
  gasEstimate: string
}
