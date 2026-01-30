import React from "react";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  className = "", 
  text = "Harsy Handmade" 
}) => {
  return (
    <div className={`relative w-full h-full bg-brand-muted flex items-center justify-center overflow-hidden ${className}`}>
      {/* Decorative Crochet-like pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `radial-gradient(circle at 10px 10px, currentColor 2px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="relative flex flex-col items-center gap-4 text-brand-primary/20 transition-all group-hover:scale-110 duration-700">
        <svg 
          className="w-16 h-16 opacity-30" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span className="font-display font-bold text-xl italic tracking-widest uppercase opacity-20">
          {text}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
    </div>
  );
};
