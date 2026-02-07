"use client";

import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/lib/redux/ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </SessionProvider>
  );
}
