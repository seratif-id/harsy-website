"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Kata sandi tidak cocok!");
      return;
    }
    
    login(email);
  };

  return (
    <div className="min-h-screen bg-brand-muted/30 pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border-2 border-white ring-1 ring-brand-primary/5">
                <div className="text-center mb-8">
                    <span className="text-brand-secondary font-black tracking-[0.2em] text-[10px] uppercase block mb-3">Bergabung Bersama Kami</span>
                    <h1 className="font-display text-3xl font-black text-brand-primary tracking-tight">Buat Akun Baru</h1>
                    <p className="text-brand-primary/40 text-sm mt-3 font-medium">
                        Dapatkan akses ke koleksi eksklusif dan kemudahan berbelanja.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary ml-2">Nama Lengkap</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama Bunda"
                            className="w-full h-12 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary ml-2">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full h-12 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary ml-2">Kata Sandi</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-12 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-primary transition-colors p-2"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary ml-2">Konfirmasi Kata Sandi</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-12 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary/30 hover:text-brand-primary transition-colors p-2"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full h-14 mt-4 rounded-2xl text-lg font-black shadow-lg shadow-brand-primary/20 hover:translate-y-[-2px]">
                        Daftar Sekarang
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-brand-primary/5 text-center">
                    <p className="text-xs font-bold text-brand-primary/40 mb-4">Sudah punya akun?</p>
                    <Link href="/login" className="inline-block text-brand-primary font-black text-sm hover:text-brand-secondary transition-colors uppercase tracking-widest border-b-2 border-brand-primary/10 hover:border-brand-secondary">
                        Masuk Disini
                    </Link>
                </div>
            </div>
            
             <div className="mt-8 text-center flex items-center justify-center gap-2 opacity-50">
                <span className="text-xl">☀️</span>
                <span className="font-display font-bold text-brand-primary text-sm">Bergabung dengan Komunitas Kami</span>
                <span className="text-xl">✨</span>
            </div>
        </div>
    </div>
  );
}
