"use client";

import { Suspense, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import CartDrawer from "@/components/shop/CartDrawer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import RouteProgress from "@/components/motion/RouteProgress";
import ConfigNotice from "@/components/ui/ConfigNotice";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={null}>
            <SmoothScroll />
            <ScrollProgress />
            <RouteProgress />
          </Suspense>
          {/* Dynamic routes (e.g. /account/orders/[id]) stream in behind this boundary */}
          <Suspense fallback={null}>{children}</Suspense>
          <CartDrawer />
          <ConfigNotice />
        </CartProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
