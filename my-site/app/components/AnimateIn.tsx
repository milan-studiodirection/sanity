'use client'
import {useRef, useEffect, type ReactNode} from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimateIn({children, className = '', delay = 0}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove('animate-in-hidden')
            el.classList.add('animate-in-visible')
          }, delay)
          observer.unobserve(el)
        }
      },
      {threshold: 0.08, rootMargin: '0px 0px -40px 0px'},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`animate-in-hidden ${className}`}>
      {children}
    </div>
  )
}
