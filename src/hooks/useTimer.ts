import { useState, useRef, useCallback } from 'react'

export function useTimer() {
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const startRef = useRef<number>(0)
  const rafRef   = useRef<number>(0)

  const start = useCallback(() => {
    startRef.current = performance.now()
    setElapsed(null)
    setRunning(true)

    const tick = () => {
      setElapsed(Math.round(performance.now() - startRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setElapsed(Math.round(performance.now() - startRef.current))
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setElapsed(null)
    setRunning(false)
  }, [])

  return { elapsed, running, start, stop, reset }
}
