import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { db } from "./lib/db";
import NextAuth from "next-auth";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log({ user, account });
      //Allow Oauth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      //Prevent login in for non email verified user
      if (user?.id) {
        const existingUser = await getUserById(user?.id);
        if (!existingUser?.emailVerified) return false;
        //TODO: 2AF authentication
        if (existingUser.isTwoFactorEnable) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          console.log({twoFactorConfirmation})

          if(!twoFactorConfirmation) return false;

          //Delete Two factor for next sign in
          await db.twoFactorConfirmation.delete({
            where:{id:twoFactorConfirmation.id}
          })
        }
      }

      return true;
    },

    async session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (token.role && session.user ) {
        session.user.role = token.role;
        session.user.name=token.name;
      
          session.user.isOAuth=token.isOAuth as boolean
        
     
        
          session.user.email=token.email as string;
   
      
      }
      if(session.user){
        session.user.isTwoFactorEnable=token.isTwoFactorEnable as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      const existingAccount=await getAccountByUserId(existingUser.id);
      console.log(existingAccount,"EXITI")
      token.isOAuth=!!existingAccount;
      token.name=existingUser.name;
      token.email=existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnable=existingUser.isTwoFactorEnable
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
