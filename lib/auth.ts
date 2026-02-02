import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail } from "@/lib/services/user-service";
import { User } from "./types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await getUserByEmail(credentials.email);
        
        if (user && user.password === credentials.password) {
           const { password, ...userWithoutPassword } = user;
           return userWithoutPassword as any;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.role = (user as any).role;
            token.roleId = (user as any).roleId;
            token.address = (user as any).address;
            token.city = (user as any).city;
            token.phone = (user as any).phone;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.role;
            (session.user as any).roleId = token.roleId;
            (session.user as any).address = token.address;
            (session.user as any).city = token.city;
            (session.user as any).phone = token.phone;
        }
        return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
