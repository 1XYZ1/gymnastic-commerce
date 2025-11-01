import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { CheckAuthProvider } from "@/auth/providers";

const queryClient = new QueryClient();

export const GymShopApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        closeButton
        richColors
        toastOptions={{
          ariaLive: 'polite',
        }}
      />

      {/* Custom Provider */}
      <CheckAuthProvider>
        <RouterProvider router={appRouter} />
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
