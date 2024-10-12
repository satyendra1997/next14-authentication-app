"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetMail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";
import { send } from "process";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!!" };
  }

  const { email } = validatedFields?.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }
  //TODO

  const passwordResetToken=await generatePasswordResetToken(email);

  console.log(passwordResetToken,"passwordResetToken")
  await sendPasswordResetMail(passwordResetToken?.email,passwordResetToken?.token)

  return { success: "Reset email sent!" };
};
