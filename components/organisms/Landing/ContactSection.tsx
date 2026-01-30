"use client";

import { ImagePlaceholder } from "../../atoms/ImagePlaceholder";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Button } from "@/components/atoms/Button";
import React from "react";

export const ContactSection: React.FC = () => {
  return (
    <section className="section-padding bg-white overflow-hidden pt-8 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-brand-secondary" />
              <span className="text-brand-primary/40 font-bold text-xs uppercase tracking-[0.3em]">Hubungi Kami</span>
            </div>
            
            <SectionHeader 
              title="Kunjungi Workshop Kam" 
              subtitle="Kami terbuka untuk diskusi desain secara langsung atau sekadar menyapa dan melihat proses produksi kami."
            />
            
            <div className="space-y-12 mt-16">
              <div className="flex gap-8 group">
                <div className="w-16 h-16 bg-brand-muted rounded-[1.5rem] flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm shadow-brand-primary/5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-brand-primary mb-2 tracking-tight">Alamat Workshop</h4>
                  <p className="text-brand-primary/50 text-lg leading-relaxed">Jl. Mekarwangi No. 21 <br/> Kabupaten Bandung Barat <br/> Jawa Barat 40559</p>
                </div>
              </div>

              <div className="flex gap-8 group">
                <div className="w-16 h-16 bg-brand-muted rounded-[1.5rem] flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm shadow-brand-primary/5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 className="font-display text-2xl font-bold text-brand-primary mb-2 tracking-tight">Email & Support</h4>
                  <p className="text-brand-primary/50 text-lg leading-relaxed">harsy.handmade@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative pt-12 lg:pt-0">
            <div className="absolute inset-0 bg-brand-secondary/10 rounded-[4rem] rotate-3 blur-2xl" />
            <div className="relative bg-brand-muted rounded-[4rem] border-[12px] border-white shadow-2xl p-12 overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 text-brand-primary opacity-[0.03] transform rotate-12 font-display font-black text-9xl italic select-none">DESIGN</div>
               
               <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-brand-secondary rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl shadow-brand-secondary/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-10 h-10 text-brand-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.607-1.308 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.15.26-2.912.557-.788.306-1.457.715-2.122 1.38-.665.665-1.074 1.334-1.38 2.122-.3.762-.501 1.635-.558 2.912-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.26 2.15.557 2.912.306.788.715 1.457 1.38 2.122.665.665 1.334 1.074 2.122 1.38.762.3 1.635.501 2.912.558 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.15-.26 2.912-.557.788-.306 1.457-.715 2.122-1.38.665-.665 1.074-1.334 1.38-2.122.3-.762.501-1.635.558-2.912.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.26-2.15-.557-2.912-.306-.788-.715-1.457-1.38-2.122-.665-.665-1.334-1.074-2.122-1.38-.762-.3-1.635-.501-2.912-.558-1.28-.057-1.688-.072-4.947-.072z"></path></svg>
                  </div>
                  <h3 className="font-display text-3xl md:text-5xl font-black text-brand-primary mb-6 tracking-tighter">Ide Custom?</h3>
                  <p className="text-brand-primary/50 text-lg mb-12 max-w-sm mx-auto leading-relaxed">Konsultasikan desain impianmu langsung via Instagram bersama artisan kami.</p>
                  <Button size="lg" className="w-full h-16 text-lg shadow-2xl shadow-brand-primary/20" onClick={() => window.open('https://instagram.com/harsy.handmade', '_blank')}>
                    Chat via Instagram
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
