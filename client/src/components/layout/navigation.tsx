import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Package, 
  Settings, 
  LogOut,
  Home,
  Grid3X3,
  ClipboardList,
  Phone
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth.tsx";

const navigationItems = [
  { name: 'Bosh sahifa', href: '/', icon: Home },
  { name: 'Katalog', href: '/catalog', icon: Grid3X3 },
  { name: 'Buyurtmalar', href: '/orders', icon: ClipboardList },
  { name: 'Aloqa', href: '/contact', icon: Phone },
];

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={mobile ? 'w-full justify-start' : ''}
            >
              <Icon className={`h-4 w-4 ${mobile ? 'mr-2' : ''}`} />
              {mobile && item.name}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-black" />
              <span className="text-lg font-bold text-black">
                MetalBaza
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavItems />
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Buyurtmalar</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm">
                Kirish
              </Button>
            )}


          </div>
        </div>
      </div>
    </header>
  );
}