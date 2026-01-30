import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const HowToOrder: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Pilih Produk",
      description: "Jelajahi koleksi boneka, tas, dan aksesoris kami yang unik."
    },
    {
      number: "02",
      title: "Kustom Desain",
      description: "Pilih warna dan detail kustom sesuai dengan keinginan Anda."
    },
    {
      number: "03",
      title: "Konsultasi",
      description: "Chat via Instagram untuk detail akhir dan konfirmasi pesanan."
    },
    {
      number: "04",
      title: "Proses Rajut",
      description: "Kami mulai merajut pesanan Anda dengan penuh ketelitian."
    }
  ];

  return (
    <section className="section-padding bg-brand-primary text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(circle at 10px 10px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-brand-secondary font-black tracking-[0.3em] text-[10px] uppercase mb-4">Workflow</span>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter">Cara Pemesanan</h2>
          <div className="w-20 h-1.5 bg-brand-secondary rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[60px] left-[120px] w-full h-[1px] bg-white/10" />
              )}
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-24 h-24 bg-brand-secondary rounded-3xl flex items-center justify-center text-brand-primary font-display text-3xl font-black mb-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-brand-secondary/20">
                  {step.number}
                </div>
                <h4 className="font-display text-2xl font-bold mb-4 text-center lg:text-left">{step.title}</h4>
                <p className="text-white/50 leading-relaxed text-center lg:text-left md:text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
