import type { PromptCategory, SortMode } from '../types'
import { CATEGORIES, SORT_LABELS, categoryCount, toolOptions } from '../lib/market'

const PRICE_OPTIONS = [
  { value: 'All', label: 'Any price' },
  { value: '0.05', label: '<= 0.05 MON' },
  { value: '0.10', label: '<= 0.10 MON' },
]

const SUCCESS_OPTIONS = [
  { value: 0, label: 'Any success' },
  { value: 90, label: '90%+' },
  { value: 95, label: '95%+' },
]

export function MarketplaceFilters({
  category,
  tool,
  price,
  minimumSuccess,
  sortMode,
  onCategoryChange,
  onToolChange,
  onPriceChange,
  onMinimumSuccessChange,
  onSortModeChange,
}: {
  category: PromptCategory
  tool: string
  price: string
  minimumSuccess: number
  sortMode: SortMode
  onCategoryChange: (category: PromptCategory) => void
  onToolChange: (tool: string) => void
  onPriceChange: (price: string) => void
  onMinimumSuccessChange: (success: number) => void
  onSortModeChange: (sortMode: SortMode) => void
}) {
  return (
    <aside className="filter-rail glass">
      <section>
        <p className="rail-label">Category</p>
        <div className="filter-stack">
          {CATEGORIES.map((item) => (
            <button key={item} className={category === item ? 'is-active' : ''} onClick={() => onCategoryChange(item)}>
              <span>{item}</span>
              <span>{categoryCount(item)}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="rail-label">Tool</p>
        <div className="filter-stack">
          {toolOptions().map((item) => (
            <button key={item} className={tool === item ? 'is-active' : ''} onClick={() => onToolChange(item)}>
              <span>{item}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="rail-label">Price</p>
        <div className="segmented-control">
          {PRICE_OPTIONS.map((item) => (
            <button key={item.value} className={price === item.value ? 'is-active' : ''} onClick={() => onPriceChange(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="rail-label">Trust</p>
        <div className="segmented-control">
          {SUCCESS_OPTIONS.map((item) => (
            <button
              key={item.value}
              className={minimumSuccess === item.value ? 'is-active' : ''}
              onClick={() => onMinimumSuccessChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="rail-label">Sort</p>
        <div className="segmented-control">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
            <button key={mode} className={sortMode === mode ? 'is-active' : ''} onClick={() => onSortModeChange(mode)}>
              {SORT_LABELS[mode]}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
