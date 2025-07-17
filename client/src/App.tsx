import { Switch, Route } from "wouter";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth.tsx";
import { useBottomNav } from "@/hooks/use-bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/layout/navigation";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import Workers from "@/pages/workers";
import Orders from "@/pages/orders";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import AdminHome from "@/pages/admin-home";
import NotFound from "@/pages/not-found";

function Router() {
  const { isVisible } = useBottomNav();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={user?.role === 'admin' ? AdminHome : Home} />
          <Route path="/catalog" component={user?.role === 'admin' ? AdminHome : Catalog} />
          <Route path="/workers" component={user?.role === 'admin' ? AdminHome : Workers} />
          <Route path="/orders" component={user?.role === 'admin' ? AdminHome : Orders} />
          <Route path="/profile" component={user?.role === 'admin' ? AdminHome : Profile} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {isVisible && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="metalbaza-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
