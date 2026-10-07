import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  text: string
  className?: string
  delay?: number
  stagger?: number
  trigger?: boolean
  as?: keyof JSX.IntrinsicElements
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  trigger = false,
  as: Tag = 'span',
}: Props) {
  const containerRef = useRef<HTMLElement>(null)

  const words = text.split(' ')

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll('.split-char')
    if (!chars?.length) return

    gsap.set(chars, { y: '110%', opacity: 0 })

    const animArgs = {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      stagger,
      delay,
    }

    if (trigger) {
      gsap.to(chars, {
        ...animArgs,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    } else {
      gsap.to(chars, animArgs)
    }
  }, [delay, stagger, trigger])

  const TagElement = Tag as any

  return (
    <TagElement ref={containerRef as any} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden" style={{ marginRight: '0.25em' }}>
          {word.split('').map((char, ci) => (
            <span key={ci} className="split-char inline-block" aria-hidden="true">
              {char}
            </span>
          ))}
        </span>
      ))}
    </TagElement>
  )
}
