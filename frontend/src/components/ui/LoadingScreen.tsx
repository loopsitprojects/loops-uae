import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import LogoWebGL from '@/components/ui/LogoWebGL'

interface Props {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(false)
  const countDoneRef = useRef(false)

  const tryComplete = () => {
    if (!readyRef.current || !countDoneRef.current) return
    const container = containerRef.current
    if (!container) return

    gsap.to(textRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
    gsap.to(container, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete,
    })
  }

  useEffect(() => {
    const counter = { val: 0 }

    gsap.to(counter, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counter.val).toString()
        }
      },
      onComplete() {
        countDoneRef.current = true
        tryComplete()
      },
    })

    // Animate the text labels in
    gsap.from(textRef.current?.children ?? [], {
      y: 10,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    })
  }, [])

  const handleWebGLReady = () => {
    readyRef.current = true
    tryComplete()
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-dark overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123,47,190,0.12) 0%, transparent 70%)',
        }}
      />

      {/* WebGL Logo */}
      <LogoWebGL
        width={260}
        height={260}
        mode="loading"
        onReady={handleWebGLReady}
      />

      {/* Counter + label */}
      <div ref={textRef} className="mt-10 text-center">
        <div className="flex items-end justify-center gap-1 mb-3">
          <span
            ref={counterRef}
            className="font-display text-white tabular-nums"
            style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}
          >
            0
          </span>
          <span className="label text-white/70 mb-1">%</span>
        </div>
        <p className="label text-white/20 tracking-[0.4em]">LOOPS INTEGRATED</p>
      </div>
    </div>
  )
}
