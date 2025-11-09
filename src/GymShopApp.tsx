import { useEffect } from 'react';
import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { CheckAuthProvider } from "@/auth/providers";
import { useGuestCartStore } from "@/cart/store/guestCart.store";
import { queryClient } from "@/config/react-query.config";

export const GymShopApp = () => {
  const initializeGuestCart = useGuestCartStore((state) => state.initialize);

  // Initialize guest cart from localStorage on app mount
  useEffect(() => {
    initializeGuestCart();
  }, [initializeGuestCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" closeButton richColors toastOptions={{}} />

      {/* Custom Provider */}
      <CheckAuthProvider>
        <RouterProvider router={appRouter} />
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
