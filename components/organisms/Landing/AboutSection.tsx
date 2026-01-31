import { ImagePlaceholder } from "../../atoms/ImagePlaceholder";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import Image from "next/image";
import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section className="section-padding relative overflow-hidden pt-8 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-primary/10 bg-brand-muted">
                <Image src="/aboutImages/aboutImg1.png" alt="About" width={500} height={500} />
              </div>
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden translate-y-12 shadow-2xl shadow-brand-primary/10 bg-brand-muted">
                <Image src="/aboutImages/aboutImg2.png" alt="About" width={500} height={500} />
              </div>
            </div>
            {/* Stats Badge */}
            <div className="absolute md:-bottom-4 -right-4 -top-20 bg-white opacity-85 p-8 rounded-3xl shadow-2xl max-w-[240px] border-none ring-1 ring-brand-primary/5">
              <p className="font-display text-4xl font-black italic mb-2 text-brand-primary">1+ Tahun</p>
              <p className="text-brand-primary/50 text-xs font-bold uppercase tracking-wider leading-relaxed">
                Menemani momen berharga anak-anak dengan rajutan tangan berkualitas.
              </p>
            </div>
          </div>
          
          <div className="pt-12 lg:pt-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-brand-secondary" />
              <span className="text-brand-primary/40 font-bold text-xs uppercase tracking-[0.3em]">Harsy Story</span>
            </div>
            
            <SectionHeader 
              title="Kisah di Balik Setiap Rajutan" 
              subtitle="Harsy Handmade bermula dari keinginan seorang ibu memberikan kehangatan terbaik untuk sang buah hati."
            />
            
            <div className="space-y-8 text-brand-primary/60 text-lg leading-relaxed">
              <p>
                Setiap produk kami dikerjakan dengan penuh dedikasi. Kami percaya bahwa barang buatan tangan memiliki energi unik yang membawa keceriaan dan kenyamanan bagi si pemakai.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
                <div className="flex flex-col gap-4 p-6 rounded-3xl bg-brand-muted/50 border border-brand-primary/5">
                  <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center text-brand-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <h4 className="font-display text-brand-primary text-xl font-bold">Safe & Pure</h4>
                  <p className="text-sm leading-relaxed">Benang katun premium yang lembut & aman untuk kulit bayi.</p>
                </div>
                
                <div className="flex flex-col gap-4 p-6 rounded-3xl bg-brand-muted/50 border border-brand-primary/5">
                  <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                  </div>
                  <h4 className="font-display text-brand-primary text-xl font-bold">High Detail</h4>
                  <p className="text-sm leading-relaxed">Kerapian rajutan tingkat tinggi dengan kontrol kualitas yang ketat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
