"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import localFont from "next/font/local";
import Image from "next/image";

const geistMono = localFont({
  src: "../../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function LoginPage() {
  return (
    <div className="h-dvh w-dvw grid pic p-12">
      <div
        className="grid place-items-center rounded-3xl"
        style={{
          backgroundImage: "url('/asset/anime-style-clouds.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="bg-gradient-to-b from-blue-300 shadow-lg to-white/10 p-6 rounded-3xl backdrop-blur">
          <div className="grid place-items-center">
            <div className="h-16 w-16 rounded-2xl shadow-lg grid place-items-center bg-white">
              <LogIn className="size-10 text-black" />
            </div>
          </div>
          <p
            className={`${geistMono.className} text-white font-bold text-3xl mt-8`}
          >
            Welcome to DND Task Manager
          </p>
          <p className="text-white font-medium mt-2 text-center">
            You can login with github account to get started.
          </p>
          <div className="grid place-items-center mt-4">
            <Button
              className="h-auto items-center py-3 gap-4 rounded-xl"
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`,
                  "_self"
                );
              }}
            >
              <span className="text-base font-semibold">
                Continue with Github
              </span>
              <Image
                src={"/asset/github-mark-white.png"}
                alt="github"
                height={200}
                width={200}
                className="w-8"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
