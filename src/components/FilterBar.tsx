import { PromptCategory } from '../types'

const CATEGORIES: PromptCategory[] = ['All', 'LLMs', 'Image Generation', 'Code']

interface FilterBarProps {
  activeFilter: PromptCategory
  onFilter: (category: PromptCategory) => void
}

export function FilterBar({ activeFilter, onFilter }: FilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {CATEGORIES.map((cat) => {
        const isActive = activeFilter === cat
        return (
          <button
            key={cat}
            onClick={() => onFilter(cat)}
            className={`rounded-lg px-4 py-1.5 text-sm transition-all duration-200 ${
              isActive
                ? 'text-white font-semibold'
                : 'glass text-white/50 hover:text-white/90'
            }`}
            style={
              isActive
                ? { background: 'linear-gradient(135deg, #836EFD, #A15EFA)', border: 'none' }
                : undefined
            }
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
