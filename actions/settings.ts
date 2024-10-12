"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationMail } from "@/lib/mail";
import bcrypt from "bcryptjs"
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  console.log(user, "USER");
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user && user?.id) {
    const dbUser = await getUserById(user?.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnable = undefined;
    }
    if(values.email && values.email !== user.email){
        const existingUser=await getUserByEmail(values.email);
        if(existingUser && existingUser.id!== user.id){
            return {error:"Email is already in use"}
        }

        const verificationToken=await generateVerificationToken(values?.email);

        await sendVerificationMail(verificationToken.email,verificationToken.token);
        return {success:"Verification Email Sent"}
    }
    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch=await bcrypt.compare(values.password,dbUser.password)
        if(!passwordsMatch){
         return{error:"Incorrect Password"}
        }

        const hashedPassword=await bcrypt.hash(values.newPassword,10);
        values.password=hashedPassword;
        values.newPassword=undefined;
    }
    await db.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });
    return { success: "Settings Updated" };
  }
};
