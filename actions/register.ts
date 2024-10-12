"use server"
import { RegisterSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import * as z from 'zod'
import { generateVerificationToken } from '@/lib/token'
import { sendVerificationMail } from '@/lib/mail'


export const register=async(values: z.infer<typeof RegisterSchema> )=>{
    const validatedFields=RegisterSchema .safeParse(values);
    console.log(values)
    if(!validatedFields.success){
        return {error:"Invalid fields!"}
    }
   
    const {email,password,name}=validatedFields.data;
    console.log(email,"Current Registeration")
    const hasPassword=await bcrypt.hash(password,10);
    const existingUser=await db.user.findUnique({
      where:{
        email,
      }
    })

    if(existingUser){
      return {error:"This email is already in use"}
    }

    await db.user.create({
      data:{
        name,email,password:hasPassword
      }
    })

    const verificationToken=await generateVerificationToken(email);
    console.log(verificationToken,"SATYA")

    //TODO: Send verification token email
    await sendVerificationMail(verificationToken.email,verificationToken.token)

    return {success:"Confirmation email sent"}
 
}