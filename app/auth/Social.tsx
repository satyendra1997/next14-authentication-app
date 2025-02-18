"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {signIn} from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const Social = () => {
  const searchParams=useSearchParams();
  const callbackUrl=searchParams.get("callbackUrl");
  const handleLogin = (providers: "google" | "github") => {
    signIn(providers,{
        callbackUrl:callbackUrl||DEFAULT_LOGIN_REDIRECT
    })
  };

  return (
    <div className="flex items-center w-full gap-x-2 ">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleLogin("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleLogin("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
