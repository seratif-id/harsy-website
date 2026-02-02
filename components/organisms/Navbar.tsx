"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../atoms/Button";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserDropdown } from "../molecules/UserDropdown";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  siteContent?: {
    navbar?: {
      links: NavLink[];
      logo: {
        name: string;
        tagline: string;
        image: string;
      };
    };
  };
}

export const Navbar: React.FC<NavbarProps> = ({ siteContent }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = siteContent?.navbar?.links || [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "Tentang", href: "/about" },
    { label: "Kontak", href: "/#contact" },
  ];

  const logoData = siteContent?.navbar?.logo || {
    name: "Harsy",
    tagline: "Handmade",
    image: "/logo.png"
  };

  // Hide Navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 outline-none ${isScrolled || isMenuOpen ? "py-4 m-4 rounded-3xl  backdrop-blur-xl" : "py-8 bg-transparent"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-brand-primary/20">
               <Image src={logoData.image} alt="Logo" width={50} height={50} />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-display text-2xl font-bold text-brand-primary tracking-tight leading-none">{logoData.name}</span>
              <span className="font-display text-[10px] uppercase tracking-[0.2em] text-brand-primary/40 font-bold">{logoData.tagline}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link: NavLink) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="font-semibold text-sm text-brand-primary/60 hover:text-brand-primary transition-all relative group/link"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary group-hover/link:w-full transition-all duration-300" />
              </Link>
            ))}
            {isAuthenticated && user ? (
               <UserDropdown user={user} />
            ) : (
                <Button variant="primary" size="sm" className="shadow-brand-primary/20" onClick={() => router.push("/login")}>
                  Masuk
                </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-brand-primary relative z-[70] p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end relative overflow-hidden">
              <span className={`w-6 h-0.5 bg-brand-primary transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
              <span className={`w-4 h-0.5 bg-brand-primary transition-all duration-300 ${isMenuOpen ? "opacity-0 translate-x-4" : ""}`} />
              <span className={`w-6 h-0.5 bg-brand-primary transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 p-10 pt-40 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col gap-8">
            <span className="text-brand-secondary font-black tracking-[0.3em] text-md uppercase mb-2">Navigasi Utama</span>
            {navLinks.map((link: NavLink) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="font-display text-2xl font-black text-brand-primary hover:text-brand-secondary transition-colors tracking-tighter"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-brand-primary/5 my-4" />
            {isAuthenticated ? (
               <div className="flex flex-col gap-4">
                  <Button size="lg" className="w-full h-16 text-md shadow-2xl shadow-brand-primary/20" onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/profile");
                  }}>
                    Profile User
                  </Button>
                   <Button variant="ghost" size="lg" className="w-full h-16 text-md border-2 border-brand-primary/10" onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/history");
                  }}>
                    History Order
                  </Button>
               </div>
            ) : (
                <Button 
                  size="lg" 
                  className="w-full h-16 text-md shadow-2xl shadow-brand-primary/20"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Masuk
                </Button>
            )}
            
            <div className="mt-auto pt-20">
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em] mb-4">Ikuti Kami</p>
              <div className="flex gap-4">
                <a href="https://instagram.com/harsy.handmade" target="_blank" rel="noreferrer" className="rounded-xl flex flex-row items-center justify-center text-brand-primary hover:bg-brand-secondary transition-colors">
                  <div className="flex flex-row items-center gap-2">
                    <Instagram className="w-6 h-6" /> 
                    <p className="text-brand-primary text-sm font-bold">harsy.handmade</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
