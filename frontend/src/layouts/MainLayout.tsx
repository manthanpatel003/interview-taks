"use client";
import { CircularProgress } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <CircularProgress size={50} className="text-primary" />
              </div>
            }
          >
            {children}
          </Suspense>
        </AppRouterCacheProvider>
        <Toaster position="top-right" duration={5000} />
      </QueryClientProvider>
    </>
  );
}
