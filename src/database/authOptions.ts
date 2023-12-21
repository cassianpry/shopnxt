import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./User.model";
import { connectToDatabase } from "./dbConnect";

interface CredentialsProps {
  email: string;
  password: string;
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      //@ts-ignore
      async authorize(credentials: CredentialsProps, req: any) {
        connectToDatabase();
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
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
