"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  const handleGoogleLogin = () => {
    login("bunda@gmail.com"); 
  };

  return (
    <div className="min-h-screen bg-brand-muted/30 pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border-2 border-white ring-1 ring-brand-primary/5">
                <div className="text-center mb-8">
                    <span className="text-brand-secondary font-black tracking-[0.2em] text-[10px] uppercase block mb-3">Selamat Datang</span>
                    <h1 className="font-display text-3xl font-black text-brand-primary tracking-tight">Masuk ke Harsy</h1>
                    <p className="text-brand-primary/40 text-sm mt-3 font-medium">
                        Simpan riwayat pesanan dan dapatkan penawaran spesial untuk si kecil.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-primary ml-2">Email Bunda</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full h-14 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
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
                                className="w-full h-14 px-6 rounded-2xl bg-brand-muted/20 border-2 border-transparent focus:bg-white focus:border-brand-primary/20 outline-none transition-all text-brand-primary font-bold placeholder:text-brand-primary/20"
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-brand-primary border-brand-primary" : "border-brand-primary/20 bg-white group-hover:border-brand-primary/40"}`}>
                                {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <span className="text-xs font-bold text-brand-primary/60 group-hover:text-brand-primary transition-colors">Ingat Saya</span>
                        </label>
                        <Link href="#" className="text-xs font-bold text-brand-secondary hover:underline">Lupa Kata Sandi?</Link>
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-brand-primary/20 hover:translate-y-[-2px]">
                        Masuk Sekarang
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-brand-primary/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="bg-white px-4 text-brand-primary/20">Atau Masuk Dengan</span>
                    </div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-14 rounded-2xl border-2 border-brand-primary/5 hover:border-brand-primary/10 hover:bg-brand-muted/10 flex items-center justify-center gap-3 transition-all font-bold text-brand-primary group"
                >
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                   </svg>
                   Google
                </button>

                <div className="mt-8 pt-6 border-t border-brand-primary/5 text-center">
                    <p className="text-xs font-bold text-brand-primary/40 mb-4">Belum punya akun?</p>
                    <Link href="/register" className="inline-block text-brand-primary font-black text-sm hover:text-brand-secondary transition-colors uppercase tracking-widest border-b-2 border-brand-primary/10 hover:border-brand-secondary">
                        Daftar Gratis
                    </Link>
                </div>
            </div>
            
            <div className="mt-8 text-center flex items-center justify-center gap-2 opacity-50">
                <span className="text-xl">🌸</span>
                <span className="font-display font-bold text-brand-primary text-sm">Aman & Terpercaya untuk Ibu & Anak</span>
                <span className="text-xl">🧸</span>
            </div>
        </div>
    </div>
  );
}
