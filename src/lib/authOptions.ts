import bcrypt from "bcrypt";
import User from "@/database/user.model";

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { AuthOptions } from "next-auth";
import { connectToDatabase } from "./actions/mongoose";

interface CredentialsProps {
  email: string;
  password: string;
}

type AuthorizeRequest = {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  method?: string;
};

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined, req: AuthorizeRequest) {
        connectToDatabase();
        if (!credentials) {
          throw new Error("E-mail ou Password inválidos.");
        }
        const { email, password } = credentials;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("E-mail ou Password inválidos.");
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          throw new Error("E-mail ou Password inválidos.");
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user || !user.email) {
        throw new Error("Email do usuário não fornecido.");
      }

      try {
        connectToDatabase();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            username: user.name,
            email: user.email,
            avatar: user.image,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token }) {
      await connectToDatabase();
      const userByEmail = await User.findOne({ email: token.email }).lean();
      if (userByEmail) {
        token.user = {
          _id: userByEmail._id,
          name: userByEmail.name,
          email: userByEmail.email,
          role: userByEmail.role,
          image: userByEmail.image ?? null,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
