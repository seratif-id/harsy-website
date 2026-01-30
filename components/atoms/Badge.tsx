import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = "primary", 
  className = "" 
}) => {
  const variants = {
    primary: "bg-brand-primary text-white",
    secondary: "bg-brand-secondary text-brand-primary",
    accent: "bg-brand-accent text-brand-primary",
    outline: "border border-brand-primary text-brand-primary bg-transparent",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
