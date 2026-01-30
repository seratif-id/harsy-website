"use client";

import React, { useState, use } from "react";
import { PRODUCTS } from "@/lib/data";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Mock customization parts based on category
  const customizationParts = product.category === "boneka" 
    ? [
        { name: "Warna Badan", options: ["Cream", "Coklat", "Putih", "Pink"] },
        { name: "Warna Mata", options: ["Hitam", "Biru", "Coklat"] },
        { name: "Warna Sepatu", options: ["Merah", "Kuning", "Hijau"] }
      ]
    : product.category === "tas"
    ? [
        { name: "Warna Tas", options: ["Sky Blue", "Lavender", "Beige", "Black"] },
        { name: "Warna Tali", options: ["Sesuai Tas", "Putih", "Coklat"] }
      ]
    : [
        { name: "Warna Utama", options: ["Warna 1", "Warna 2", "Warna 3"] }
      ];

  const [selections, setSelections] = useState<Record<string, string>>(
    Object.fromEntries(customizationParts.map(p => [p.name, p.options[0]]))
  );

  const handleSelection = (part: string, option: string) => {
    setSelections(prev => ({ ...prev, [part]: option }));
  };

  return (
    <div className="section-padding min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 mb-12">
          <Link href="/" className="hover:text-brand-primary transition-colors">Beranda</Link>
          <span className="opacity-20">/</span>
          <Link href="/products" className="hover:text-brand-primary transition-colors">Katalog</Link>
          <span className="opacity-20">/</span>
          <span className="text-brand-primary italic opacity-60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-brand-muted rounded-[3rem] overflow-hidden relative shadow-2xl shadow-brand-primary/5 border-8 border-white group">
               <ImagePlaceholder text={product.name} className="scale-110 group-hover:scale-125 transition-transform duration-[2s]" />
               <div className="absolute top-6 right-6">
                 <Badge variant="accent" className="shadow-xl">Favorit Ibu</Badge>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-brand-muted rounded-2xl cursor-pointer hover:ring-4 ring-brand-secondary/30 transition-all duration-300 overflow-hidden border-2 border-white shadow-md">
                  <ImagePlaceholder className="scale-150" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-brand-secondary font-black tracking-[0.2em] text-[10px] uppercase block">Product Detail</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-black text-brand-primary mb-4 leading-none tracking-tighter">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 rounded-full">
                <span className="text-yellow-400 text-xs">★★★★★</span>
                <span className="font-black text-brand-primary text-xs">{product.rating}</span>
              </div>
              <span className="text-brand-primary/10 font-bold">•</span>
              <span className="text-brand-primary/40 text-xs font-bold uppercase tracking-widest">{product.sold} Terjual</span>
            </div>

            <div className="glass p-10 rounded-[2.5rem] mb-12 border-none ring-1 ring-brand-primary/5 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-brand-primary/30 uppercase font-black tracking-[0.2em] mb-2">Estimasi Harga</p>
                  <p className="text-4xl font-display font-black text-brand-primary tracking-tight">
                    <span className="text-lg mr-1 opacity-40">Rp</span>{product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] text-brand-primary/30 uppercase font-black tracking-[0.2em] mb-2">Waktu Pengerjaan</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-lg font-bold text-brand-primary">{product.estimatedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12 mb-12">
              <div className="flex items-center gap-4">
                <h3 className="font-display text-2xl font-black text-brand-primary tracking-tight">Custom Warna</h3>
                <div className="h-[1px] flex-grow bg-brand-primary/5" />
              </div>
              
              {customizationParts.map((part) => (
                <div key={part.name} className="space-y-6">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">{part.name}</p>
                  <div className="flex flex-wrap gap-4">
                    {part.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelection(part.name, option)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-500 border-2 ${
                          selections[part.name] === option 
                            ? "bg-brand-primary text-white border-brand-primary shadow-2xl shadow-brand-primary/30 scale-105" 
                            : "bg-white border-brand-primary/5 text-brand-primary/40 hover:border-brand-primary/10"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-brand-primary/5">
              <Link href={`/order?slug=${product.slug}&${new URLSearchParams(selections).toString()}`} className="flex-grow">
                <Button size="lg" className="w-full h-20 text-xl font-black shadow-2xl shadow-brand-primary/20">
                  Mulai Pesanan Custom
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="h-20 px-10 border-2 border-brand-primary/5 hover:border-brand-primary/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 7.105a3 3 0 100 5.368 3 3 0 000-5.368z"></path></svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-brand-secondary font-black tracking-[0.3em] text-[10px] uppercase mb-4">Feedback</span>
            <h3 className="font-display text-4xl md:text-5xl font-black text-brand-primary tracking-tighter">Kata Para Ibu</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-brand-primary/5 border border-brand-primary/5 group hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-brand-muted rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                    <ImagePlaceholder className="scale-150" />
                  </div>
                  <div>
                    <p className="font-display font-black text-brand-primary">Dina Amalia</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-[10px]">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-brand-primary/50 text-base leading-relaxed italic font-medium">
                  "Hasil rajutannya rapi sekali! Bahannya lembut dan aman banget buat anak saya yang masih bayi. Makasih Harsy!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
