"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { ImagePlaceholder } from "../../atoms/ImagePlaceholder";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-muted/30">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[120px] animate-soft-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-brand-primary/5 mb-8 animate-float">
              <span className="flex h-2 w-2 rounded-full bg-brand-secondary" />
              <span className="text-brand-primary/60 font-bold text-xs uppercase tracking-widest">
                Karya Tangan Penuh Cinta
              </span>
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl text-brand-primary font-black mb-8 leading-[0.95] tracking-tighter">
              Seni Rajut <br />
              <span className="text-brand-secondary">Tanpa Batas</span>
            </h1>
            
            <p className="text-brand-primary/50 text-xl md:text-2xl mb-12 max-w-lg leading-relaxed font-medium">
              Menghadirkan kehangatan dalam setiap simpul rajutan untuk menemani tumbuh kembang si buah hati.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Button size="lg" className="h-16 px-10 text-lg shadow-xl shadow-brand-primary/20" onClick={() => window.location.href='/products'}>
                Eksplorasi Koleksi
              </Button>
              <Button variant="ghost" size="lg" className="h-16 px-10 text-lg border-2 border-brand-primary/10 hover:border-brand-primary/20" onClick={() => window.location.href='/order'}>
                Custom Pesanan
              </Button>
            </div>
            
            <div className="mt-16 flex items-center gap-6 p-4 rounded-3xl bg-white/50 border border-brand-primary/5 backdrop-blur-sm">
              <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-brand-muted flex items-center justify-center overflow-hidden shadow-sm">
                    <span className="text-[10px] text-brand-primary/20 font-black italic">H</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-brand-primary font-black text-lg leading-none">1,200+</span>
                <span className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-wider">Pelanggan Bahagia</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
             <div className="relative w-full max-w-lg aspect-[4/5] animate-float">
                <div className="absolute inset-0 bg-brand-secondary/20 rounded-3xl rotate-6 blur-2xl" />
                <div className="absolute inset-0 bg-brand-primary/10 rounded-3xl -rotate-3 blur-xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-[16px] border-white flex items-center justify-center group">
                   <ImagePlaceholder text="Harsy Crochet" className="scale-110 group-hover:scale-125 transition-transform duration-[2s]" />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent" />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-accent rounded-3xl rotate-12 flex items-center justify-center shadow-2xl animate-soft-pulse hidden md:flex">
                  <svg className="w-16 h-16 text-brand-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-24 bg-brand-primary rounded-3xl -rotate-6 flex flex-col items-center justify-center shadow-2xl p-4 hidden md:flex">
                  <span className="text-brand-secondary font-black text-2xl">NEW</span>
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none">Collection</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
