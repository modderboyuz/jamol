"use client";

import { useAuth } from "@/hooks/use-auth";
import { useBottomNav } from "@/hooks/use-bottom-nav";
import { usePathname, useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { CartBar } from "@/components/layout/cart-bar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isVisible } = useBottomNav();
  const { user } = useAuth();
  const router = useRouter();

  const handleCartOrder = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      {isVisible && <BottomNavigation />}
      <CartBar onOrderClick={handleCartOrder} />
    </div>
  );
}