import * as React from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "@/components/auth/login-modal";

export function Header() {
  const { user, login, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleProfileClick = () => {
    if (user) {
      // Navigate to profile or show profile menu
      console.log("Navigate to profile");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">MetalBaza</h1>
              </div>
              <div className="sm:hidden">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Bar - Only on mobile */}
            <div className="flex-1 max-w-md mx-4 sm:mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  type="text"
                  placeholder="Mahsulotlar qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all duration-200 text-sm sm:text-base h-10 sm:h-12"
                />
              </form>
            </div>

            {/* Profile - Only on desktop */}
            <div className="hidden sm:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <User className="h-6 w-6 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
      />
    </>
  );
}
