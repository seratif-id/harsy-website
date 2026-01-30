"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import Link from "next/link";

function OrderFormContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("slug");
  const product = PRODUCTS.find((p) => p.slug === productSlug);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    request: "",
    customization: ""
  });

  useEffect(() => {
    // Collect all search params except 'slug' as customization
    const custom: string[] = [];
    searchParams.forEach((value, key) => {
      if (key !== "slug") {
        custom.push(`${key}: ${value}`);
      }
    });
    setFormData(prev => ({ ...prev, customization: custom.join(", ") }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct Instagram Message
    const instagramUsername = "harsy.handmade"; // Change to actual username
    const baseMsg = `Halo Harsy Handmade! Saya ingin memesan:\n\n` +
                 `Produk: ${product?.name || "Custom Design"}\n` +
                 `Custom: ${formData.customization}\n` +
                 `Request Tambahan: ${formData.request}\n\n` +
                 `Nama saya: ${formData.name}\n` +
                 `WA: ${formData.whatsapp}`;
    
    const encodedMsg = encodeURIComponent(baseMsg);
    // Note: Instagram doesn't support direct message pre-filling via URL as well as WhatsApp,
    // but we can direct them to the profile or use a web-based intent if available.
    // For now, redirecting to profile or a generic link.
    window.open(`https://www.instagram.com/${instagramUsername}/`, "_blank");
    
    // Alternatively, if the user prefers WhatsApp for easier pre-filling:
    // window.open(`https://wa.me/PHONE_NUMBER?text=${encodedMsg}`, "_blank");
    
    alert("Anda akan diarahkan ke Instagram Harsy Handmade. Silakan kirim pesan ke kami!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
      {/* Product Summary */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-brand-primary/5 border border-brand-primary/5 sticky top-32 group">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-brand-secondary font-black tracking-[0.2em] text-[10px] uppercase block">Ringkasan</span>
        </div>
        
        <h3 className="font-display text-3xl font-black text-brand-primary mb-10 tracking-tight">Pesanan Anda</h3>
        
        {product ? (
          <div className="flex gap-8 mb-10">
            <div className="w-32 h-32 bg-brand-muted rounded-[2rem] flex-shrink-0 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
              <ImagePlaceholder text={product.name} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-brand-primary/30 text-[10px] font-bold uppercase tracking-widest mb-1">{product.category}</span>
              <h4 className="font-display text-2xl font-black text-brand-primary leading-tight mb-2">{product.name}</h4>
              <p className="text-xl font-display font-bold text-brand-primary"><span className="text-sm opacity-40 mr-1">Rp</span>{product.price.toLocaleString("id-ID")}</p>
            </div>
          </div>
        ) : (
          <div className="mb-10 p-8 bg-brand-muted rounded-[2rem] border-2 border-dashed border-brand-primary/10">
            <p className="text-brand-primary/40 text-sm font-medium">Pesanan Custom / Tidak ada produk terpilih.</p>
          </div>
        )}

        {formData.customization && (
          <div className="space-y-4 mb-10 bg-brand-secondary/5 p-8 rounded-[2rem] border border-brand-secondary/10">
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Pilihan Detail:</p>
            <p className="text-brand-primary/60 font-bold leading-relaxed">{formData.customization}</p>
          </div>
        )}

        <div className="space-y-6 text-sm text-brand-primary/50 bg-brand-muted/30 p-8 rounded-[2rem]">
          <p className="flex items-center gap-4 font-medium">
            <span className="w-6 h-6 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center text-xs">✓</span> 
            Pembayaran Transfer Bank/E-Wallet
          </p>
          <p className="flex items-center gap-4 font-medium">
            <span className="w-6 h-6 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center text-xs">✓</span> 
            Pengerjaan: {product?.estimatedTime || "7-10 Hari"}
          </p>
          <p className="flex items-center gap-4 font-medium">
            <span className="w-6 h-6 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center text-xs">✓</span> 
            Pengiriman dari Jakarta Selatan
          </p>
        </div>
      </div>

      {/* Order Form */}
      <div className="pt-12 lg:pt-0">
        <form onSubmit={handleOrder} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-2">Identitas Anda</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full h-20 px-8 rounded-3xl bg-white border-2 border-brand-primary/5 focus:border-brand-primary/20 focus:bg-white outline-none transition-all duration-300 shadow-sm text-lg font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-2">Nomor WhatsApp</label>
            <input 
              type="tel" 
              name="whatsapp"
              required
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className="w-full h-20 px-8 rounded-3xl bg-white border-2 border-brand-primary/5 focus:border-brand-primary/20 focus:bg-white outline-none transition-all duration-300 shadow-sm text-lg font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-2">Request Khusus (Opsional)</label>
            <textarea 
              name="request"
              rows={5}
              value={formData.request}
              onChange={handleChange}
              placeholder="Apakah ada detail tambahan yang ingin ditambahkan? (misal: kartu ucapan, box kado, dll)"
              className="w-full px-8 py-6 rounded-[2.5rem] bg-white border-2 border-brand-primary/5 focus:border-brand-primary/20 focus:bg-white outline-none transition-all duration-300 shadow-sm resize-none text-lg font-medium"
            />
          </div>

          <div className="pt-8">
            <Button size="lg" className="w-full h-24 text-xl font-black shadow-2xl shadow-brand-primary/20" type="submit">
              Konfirmasi via Instagram
            </Button>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-secondary animate-soft-pulse" />
              <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Aman • Konsultasi Gratis • Terpercaya</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="section-padding min-h-screen bg-brand-muted/20">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Lengkapi Pesanan Anda" 
          subtitle="Hampir selesai! Selesaikan detail pesanan Anda dan artisan kami akan membantu melalui Instagram."
          centered
        />
        
        <Suspense fallback={<div className="text-center py-20 font-display text-brand-primary animate-pulse">Memuat Formulir...</div>}>
          <OrderFormContent />
        </Suspense>
      </div>
    </div>
  );
}
