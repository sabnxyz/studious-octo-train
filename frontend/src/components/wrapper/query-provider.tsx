import { trpc } from "@/lib/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getFetch,
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import { PropsWithChildren, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 1000 } },
});

const url =
  process.env.NEXT_PUBLIC_APP_DOMAIN &&
  !process.env.NEXT_PUBLIC_APP_DOMAIN.includes("localhost")
    ? `https://www.${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/trpc/`
    : "http://localhost:8000/trpc/";

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: unstable_httpSubscriptionLink({
            url,
            eventSourceOptions() {
              return {
                withCredentials: true,
              };
            },
          }),
          false: httpBatchLink({
            url,
            fetch: async (input, init?) => {
              const fetch = getFetch();
              return fetch(input, {
                ...init,
                credentials: "include",
              });
            },
          }),
        }),
      ],
    })
  );

  // httpBatchLink({
  //   url,
  //   fetch: async (input, init?) => {
  //     const fetch = getFetch();
  //     return fetch(input, {
  //       ...init,
  //       credentials: "include",
  //     });
  //   },
  // }),

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
