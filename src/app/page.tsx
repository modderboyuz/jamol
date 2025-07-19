"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Home from "@/components/pages/home";
import AdminHome from "@/components/pages/admin-home";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect admin users to admin home
  if (user?.role === 'admin') {
    return <AdminHome />;
  }

  return <Home />;
}