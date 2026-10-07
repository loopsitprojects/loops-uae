import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative overflow-hidden bg-brand-dark">
      {/* Background radial gradients for dynamic aesthetic look */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-xl mx-auto animate-fade-up">
        {/* Big Neon Typographic 404 */}
        <h1 className="text-[10rem] md:text-[14rem] font-display font-800 leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-teal drop-shadow-[0_10px_20px_rgba(232,0,90,0.15)] select-none">
          404
        </h1>

        {/* Informative message */}
        <h2 className="text-2xl md:text-3xl font-display font-600 mb-4 text-brand-light mt-4">
          Oops! You've drifted off course.
        </h2>
        <p className="text-white/60 font-sans text-sm md:text-base mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist, has been moved, or evaporated into digital space.
        </p>

        {/* Back home CTA button */}
        <Link to="/" className="btn-primary group inline-flex items-center gap-3">
          <svg 
            className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
