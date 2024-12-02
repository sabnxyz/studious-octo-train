"use client";

import { PropsWithChildren } from "react";
import { QueryProvider } from "./query-provider";

export const AppWrapper = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
};
