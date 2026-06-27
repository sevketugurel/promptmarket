export function GlowBackground() {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #836EFD 0%, transparent 70%)',
          opacity: 0.18,
          filter: 'blur(120px)',
          animation: 'float-glow 8s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #A15EFA 0%, transparent 70%)',
          opacity: 0.14,
          filter: 'blur(100px)',
          animation: 'float-glow 10s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}
