import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, History, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-secondary transition-all shadow-md">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="font-bold text-sm tracking-wider">
              {getInitials(user.name || "User")}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-primary/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="p-4 border-b border-brand-primary/5 bg-brand-muted/30">
            <p className="font-bold text-brand-primary truncate">{user.name}</p>
            <p className="text-xs text-brand-primary/60 truncate">{user.email}</p>
          </div>
          
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-brand-primary/80 hover:bg-brand-muted hover:text-brand-primary rounded-xl transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Profile User
            </Link>
            <Link
              href="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-brand-primary/80 hover:bg-brand-muted hover:text-brand-primary rounded-xl transition-colors"
            >
              <History className="w-4 h-4" />
              History Order
            </Link>
          </div>

          <div className="p-2 border-t border-brand-primary/5">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
