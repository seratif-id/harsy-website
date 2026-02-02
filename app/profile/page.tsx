"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Lock, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, login } = useAuth(); // Note: login here is just used to refresh session if needed, but optimally we should reload session
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {}),
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate profile");

      setSuccessMessage("Profile berhasil diupdate!");
      // Force reload to update session
      setTimeout(() => {
         window.location.reload();
      }, 1000);

    } catch (err) {
      setError("Terjadi kesalahan saat update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-muted/30 py-40 px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-primary/5">
          <div className="bg-brand-primary p-10 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-4">
                 {user?.image ? (
                    <Image src={user.image} alt={user.name} width={96} height={96} className="rounded-full object-cover w-full h-full" />
                 ) : (
                    <div className="w-full h-full rounded-full bg-brand-muted flex items-center justify-center text-3xl font-bold text-brand-primary">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                 )}
              </div>
              <h1 className="text-3xl font-display font-black text-white">{user?.name}</h1>
              <p className="text-white/70">{user?.email}</p>
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                  {successMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-primary/70 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary/30" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-primary/10 bg-brand-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-primary/70 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary/30" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-primary/10 bg-brand-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-primary/5">
                <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest mb-4">Ganti Password (Opsional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-primary/70 ml-1">Password Baru</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary/30" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-primary/10 bg-brand-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        placeholder="********"
                      />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-primary/70 ml-1">Konfirmasi Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary/30" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-primary/10 bg-brand-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        placeholder="********"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="shadow-lg shadow-brand-primary/20">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
