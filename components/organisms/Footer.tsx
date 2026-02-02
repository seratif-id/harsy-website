"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  siteContent?: any;
}

export const Footer: React.FC<FooterProps> = ({ siteContent }) => {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin")) return null;

  const siteData = siteContent || {};
  const footerTagline = siteData.footer?.tagline || "Mewujudkan imajinasi menjadi rajutan tangan yang penuh cinta dan kehangatan untuk Anda dan si buah hati.";
  const contact = siteData.contact || {
    address: "Jl. Mekarwangi No. 21 \n Kabupaten Bandung Barat \n Jawa Barat 40559",
    email: "harsy.handmade@gmail.com",
    socialHandle: "@harsy.handmade"
  };
  const navLinks = siteData.navbar?.links || [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "Order", href: "/order" }
  ];

  return (
    <footer className="bg-brand-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-6 italic text-brand-secondary">Harsy Handmade</h3>
            <p className="text-white/70 max-w-xs leading-relaxed">
              {footerTagline}
            </p>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-white/70">
              {navLinks.slice(0, 3).map((link: any, i: number) => (
                <li key={i}><Link href={link.href} className="hover:text-brand-secondary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-1 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="whitespace-pre-line">{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>{contact.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.607-1.308 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.15.26-2.912.557-.788.306-1.457.715-2.122 1.38-.665.665-1.074 1.334-1.38 2.122-.3.762-.501 1.635-.558 2.912-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.26 2.15.557 2.912.306.788.715 1.457 1.38 2.122.665.665 1.334 1.074 2.122 1.38.762.3 1.635.501 2.912.558 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.15-.26 2.912-.557.788-.306 1.457-.715 2.122-1.38.665-.665 1.074-1.334 1.38-2.122.3-.762.501-1.635.558-2.912.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.26-2.15-.557-2.912-.306-.788-.715-1.457-1.38-2.122-.665-.665-1.334-1.074-2.122-1.38-.762-.3-1.635-.501-2.912-.558-1.28-.057-1.688-.072-4.947-.072z"></path><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z"></path></svg>
                <span>{contact.socialHandle}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <p>© {new Date("2025").getFullYear()} Harsy Handmade. All rights reserved.</p>
          <p>Dibuat dengan ❤️ untuk Ibu & Si Kecil.</p>
        </div>
      </div>
    </footer>
  );
};
