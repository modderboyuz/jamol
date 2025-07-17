import * as React from "react";
import { Home, Grid3X3, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "@/components/auth/login-modal";

const navigation = [
  { name: "Bosh sahifa", href: "/", icon: Home },
  { name: "Katalog", href: "/catalog", icon: Grid3X3 },
  { name: "Buyurtmalarim", href: "/orders", icon: ShoppingBag, requireAuth: true },
  { name: "Profil", href: "/profile", icon: User, requireAuth: true },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { user, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  const handleNavigation = (item: typeof navigation[0]) => {
    if (item.requireAuth && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    setLocation(item.href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2 pb-safe">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "flex flex-col items-center py-3 px-4 transition-all duration-300 ease-out",
                  "relative rounded-2xl min-w-[60px]",
                  isActive 
                    ? "text-gray-900 bg-gray-100/80 scale-110 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                )}
              >
                <div className={cn(
                  "p-1 rounded-xl transition-all duration-300",
                  isActive ? "bg-gray-900" : ""
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isActive ? "text-white" : ""
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-300",
                  isActive ? "text-gray-900" : ""
                )}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
      />
    </>
  );
}
