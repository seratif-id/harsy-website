import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}) => {
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-opacity-90 shadow-md",
    secondary: "bg-brand-secondary text-brand-primary hover:bg-opacity-90 shadow-sm",
    accent: "bg-brand-accent text-brand-primary hover:bg-opacity-90 shadow-sm",
    ghost: "bg-transparent text-brand-primary hover:bg-brand-muted",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
