"use client";

import { PropsWithChildren } from "react";
import { QueryProvider } from "./query-provider";
import { AuthChecker } from "./auth-checker";

export const AppWrapper = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryProvider>
        <AuthChecker>{children}</AuthChecker>
      </QueryProvider>
    </>
  );
};
