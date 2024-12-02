"use client";

import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const AuthChecker = ({ children }: PropsWithChildren) => {
  const { data, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoggedIn = data?.id && !isLoading;

  useEffect(() => {
    if (isLoading) return;

    if (isLoggedIn) {
      if (pathname === "/login") {
        router.replace("/");
      }

      return;
    }

    if (!isLoggedIn) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [isLoading, isLoggedIn]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-white z-50 grid place-items-center",
          !isLoading && "fade-out"
        )}
      >
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/asset/Ghost.gif"
            alt=""
            width={400}
            height={400}
            className="mix-blend-multiply w-20 mx-auto"
          />
          <div className="mt-8">
            <div className="h-1.5 w-48 bg-gray-200 rounded-full">
              <div className="loader h-1.5 bg-black rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 text-center text-xl font-medium text-gray-700">
            Task Manager DND
          </div>
        </div>
      </div>
      {children}
    </>
  );
};
