import NextAuth, { type DefaultSession } from "next-auth";
import UserRole from "@prisma/client"


export type ExtendedUser=DefaultSession['user'] & {
    role:UserRole
    isTwoFactorEnable:boolean
    isOAuth:boolean
}

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: ExtendedUser
    }
  }


