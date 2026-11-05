"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import StoreClosed from "@/components/shop/StoreClosed";

/** Sends signed-out visitors to /login and brings them back afterwards. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, configured, signingOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (configured && !loading && !user && !signingOut) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [configured, loading, user, router, pathname, signingOut]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <StoreClosed />
      </div>
    );
  }
  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#A77B4D]" />
      </div>
    );
  }
  return <>{children}</>;
}
