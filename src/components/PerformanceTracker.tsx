interface PerformanceTrackerProps {
  elapsed: number | null
  running: boolean
  promptTitle: string | null
}

export function PerformanceTracker({ elapsed, running, promptTitle }: PerformanceTrackerProps) {
  const visible = promptTitle !== null

  return (
    <div
      className={`glass rounded-2xl p-4 w-64 fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <p
        className="text-xs text-white/50 mb-3"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        ⚡ Monad Speed
      </p>

      {running && elapsed !== null && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span
            className="text-3xl font-bold neon-text"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {elapsed} ms
          </span>
        </div>
      )}

      {running && elapsed === null && (
        <p className="text-xs text-white/30 italic">Counting...</p>
      )}

      {!running && elapsed !== null && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-white/50">✓ Settled in</p>
          <p
            className="text-3xl font-bold neon-text"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {elapsed} ms
          </p>
          <p className="text-xs text-white/40 mt-1">Gas Cost: ~0.0002 MON</p>
          <p className="text-xs text-red-400/70">vs Ethereum: ~15,000 ms + $2.00</p>
        </div>
      )}

      {!running && elapsed === null && (
        <p className="text-xs text-white/30 italic">Waiting for transaction...</p>
      )}
    </div>
  )
}
