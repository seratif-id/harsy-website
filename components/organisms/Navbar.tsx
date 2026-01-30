"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../atoms/Button";
import Image from "next/image";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "Tentang", href: "/about" },
    { label: "Kontak", href: "/#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4 m-4 rounded-3xl glass backdrop-blur-xl" : "py-8 bg-transparent"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-brand-primary/20">
             <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-display text-2xl font-bold text-brand-primary tracking-tight leading-none">Harsy</span>
            <span className="font-display text-[10px] uppercase tracking-[0.2em] text-brand-primary/40 font-bold">Handmade</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="font-semibold text-sm text-brand-primary/60 hover:text-brand-primary transition-all relative group/link"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary group-hover/link:w-full transition-all duration-300" />
            </Link>
          ))}
          <Button variant="primary" size="sm" className="shadow-brand-primary/20" onClick={() => window.location.href='/order'}>
            Pesan Sekarang
          </Button>
        </div>

        {/* Mobile Menu Toggle (Simplified) */}
        <button className="md:hidden text-brand-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};
