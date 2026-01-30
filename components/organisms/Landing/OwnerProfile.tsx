import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";

export const OwnerProfile: React.FC = () => {
  return (
    <section className="py-24 bg-brand-muted">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-brand-primary/5">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-brand-secondary/30 relative flex-shrink-0 order-2 lg:order-1">
               <div className="absolute inset-4 rounded-full bg-brand-muted border-4 border-white animate-pulse" />
               <div className="absolute -bottom-2 -right-2 bg-brand-accent p-4 rounded-2xl shadow-lg font-display font-bold text-brand-primary rotate-12">
                 Owner & Maker
               </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <span className="text-brand-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Siapa di Balik Harsy?</span>
              <SectionHeader 
                title="Halo, Saya Harsy" 
                subtitle="Pembuat di balik setiap boneka dan tas yang Anda lihat di sini."
              />
              <p className="text-brand-primary/70 text-lg mb-8 leading-relaxed italic">
                "Bagi saya, merajut bukan sekadar membuat barang, tapi menenun emosi dan kasih sayang ke dalam sesuatu yang bisa dipeluk dan dibawa ke mana saja."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="font-display font-bold text-brand-primary">Harsy Rahayu</p>
                  <p className="text-sm text-brand-primary/40">Founder Harsy Handmade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
