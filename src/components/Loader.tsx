'use client'

export default function Loader({ text }: { text?: string }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[var(--sand)]/30 border-t-[var(--sand)] rounded-full animate-spin" />
      {text && <p className="text-[var(--text-muted)] text-sm">{text}</p>}
    </div>
  )
}
