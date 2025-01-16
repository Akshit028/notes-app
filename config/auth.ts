import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db";

const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/"
    },
    callbacks: {
        session({session, user}) {
            session.user.id = user.id;
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],

};

export default options;
