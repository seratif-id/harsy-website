import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-16 ${centered ? "text-center" : "text-left"}`}>
      <h2 className="font-display text-4xl md:text-6xl text-brand-primary font-black mb-6 tracking-tighter leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-brand-primary/50 text-lg md:text-xl max-w-2xl font-medium leading-relaxed ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
      <div className={`h-2 w-20 bg-brand-secondary rounded-full mt-8 ${centered ? "mx-auto" : ""}`} />
    </div>
  );
};
