import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User from "./User.model";
import { connectToDatabase } from "./dbConnect";
import axios from "axios";

interface CredentialsProps {
  email: string;
  password: string;
}

interface UserProps {
  user: {
    name?: string;
    password?: string;
    email?: string;
    image?: string;
  };
}

//Função para gerar uma senha aleatória de 10 caracteres
const generateHashedPassword = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let newpassword = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newpassword += characters.charAt(randomIndex);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);
  return hashedPassword;
};

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  //send user social login(Google or Github) to database
  callbacks: {
    async signIn({ user }: UserProps) {
      if (!user || !user.email) {
        throw new Error("Email do usuário não fornecido.");
      }

      try {
        connectToDatabase();

        let dbUser = await User.findOne({ email: user.email });

        //Gera uma senha aleatória
        const hashedPassword = await generateHashedPassword();

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            username: user.name,
            password: hashedPassword,
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
