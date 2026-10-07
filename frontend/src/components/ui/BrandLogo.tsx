import { resolveImageUrl } from '@/lib/api'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'mobile' | 'lg'
  className?: string
}

export default function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const heights = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    mobile: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
  }[size]

  return (
    <img
      src={resolveImageUrl('/images/logo.png')}
      alt="LOOPS INTEGRATED"
      className={`${heights} w-auto object-contain select-none ${className}`}
    />
  )
}
