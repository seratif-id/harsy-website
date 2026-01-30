"use client";

import React from "react";
import { AboutSection } from "@/components/organisms/Landing/AboutSection";
import { OwnerProfile } from "@/components/organisms/Landing/OwnerProfile";

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <div className="pt-20"> {/* Offset for the fixed Navbar */}
        <AboutSection />
        <OwnerProfile /> 
      </div>
    </main>
  );
}
