"use client";

import React, { useState, use } from "react";
import { PRODUCTS } from "@/lib/data";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import Link from "next/link";
import Image from "next/image";
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

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="section-padding min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/30 mb-12">
          <Link href="/" className="hover:text-brand-primary transition-colors">Beranda</Link>
          <span className="opacity-20">/</span>
          <Link href="/products" className="hover:text-brand-primary transition-colors">Katalog</Link>
          <span className="opacity-20">/</span>
          <span className="text-brand-primary italic opacity-60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-16 items-start lg:h-[calc(100vh-20rem)] lg:min-h-[600px]">
          <div className="space-y-6 lg:max-w-md mx-auto w-full h-full flex flex-col justify-center">
            <div className="aspect-[3/4] lg:aspect-auto lg:flex-1 bg-brand-muted rounded-[2rem] overflow-hidden relative shadow-xl shadow-brand-primary/5 border-[6px] border-white group w-full">
               <Image 
                 src={product.image[selectedImageIndex]} 
                 alt={product.name} 
                 fill 
                 className="object-cover scale-110 group-hover:scale-125 transition-transform duration-[2s]" 
               />
               <div className="absolute top-6 right-6 z-10">
                 <Badge variant="accent" className="shadow-xl">Favorit Ibu</Badge>
               </div>
            </div>
            <div className="flex-none flex px-2 p-2 gap-3 overflow-x-auto pb-2  [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-brand-primary/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-brand-primary/30 transition-colors">
              {product.image.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square flex-none w-[calc(25%-0.75rem)] rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border-2 shadow-md relative snap-start  ${
                    selectedImageIndex === index 
                      ? "ring-4 ring-brand-primary border-brand-primary/20 scale-105" 
                      : "border-white hover:ring-4 ring-brand-secondary/30"
                  }`}
                >
                  <Image src={product.image[index]} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col h-full pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-brand-primary/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-brand-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-brand-secondary font-black tracking-[0.2em] text-[10px] uppercase block">Product Detail</span>
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-black text-brand-primary mb-2 leading-none tracking-tighter">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 rounded-full">
                <span className="text-yellow-400 text-xs">★★★★★</span>
                <span className="font-black text-brand-primary text-xs">{product.rating}</span>
              </div>
              <span className="text-brand-primary/10 font-bold">•</span>
              <span className="text-brand-primary/40 text-xs font-bold uppercase tracking-widest">{product.sold} Terjual</span>
            </div>

            <div className="glass p-4 rounded-[1.5rem] mb-6 border-none ring-1 ring-brand-primary/5 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-brand-primary/30 uppercase font-black tracking-[0.2em] mb-1">Estimasi Harga</p>
                  <p className="text-2xl font-display font-black text-brand-primary tracking-tight">
                    <span className="text-lg mr-1 opacity-40">Rp</span>{product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] text-brand-primary/30 uppercase font-black tracking-[0.2em] mb-1">Waktu Pengerjaan</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-base font-bold text-brand-primary">{product.estimatedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="font-display text-2xl font-black text-brand-primary tracking-tight">Custom Warna</h3>
                <div className="h-[1px] flex-grow bg-brand-primary/5" />
              </div>
              
              {customizationParts.map((part) => (
                <div key={part.name} className="space-y-3">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">{part.name}</p>
                  <div className="flex flex-wrap gap-3">
                    {part.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelection(part.name, option)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-500 border-2 ${
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-primary/5 mt-auto pb-6">
              <Link href={`/order?slug=${product.slug}&${new URLSearchParams(selections).toString()}`} className="flex-grow">
                <Button size="lg" className="w-full h-14 text-base font-black shadow-lg shadow-brand-primary/20 rounded-xl">
                  Mulai Pesanan Custom
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="h-14 px-6 border-2 border-brand-primary/5 hover:border-brand-primary/10 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 7.105a3 3 0 100 5.368 3 3 0 000-5.368z"></path></svg>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-brand-secondary font-black tracking-[0.3em] text-[10px] uppercase mb-3">Feedback</span>
            <h3 className="font-display text-3xl md:text-4xl font-black text-brand-primary tracking-tighter">Kata Para Ibu</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-lg shadow-brand-primary/5 border border-brand-primary/5 group hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-muted rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
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
