import { ClockCounterClockwise } from '@phosphor-icons/react'

export function MoltenField() {
  return (
    <div className="molten-field" aria-hidden>
      <div className="heat-plane" />
      <div className="grid-plane" />
      <ClockCounterClockwise className="field-mark" size={420} weight="thin" />
    </div>
  )
}
