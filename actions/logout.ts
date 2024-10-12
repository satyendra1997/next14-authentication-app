"use server"

import { signOut } from "@/auth"

export const logout =async()=>{
    //Clean anything on server
    await signOut();
}