"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { User, Phone, MessageCircle, Shield, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'worker': return 'Ishchi';
      case 'client': return 'Mijoz';
      default: return role;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-2">
              Shaxsiy ma'lumotlar va sozlamalar
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Shaxsiy ma'lumotlar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-brand-600">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getRoleText(user.role)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                  
                  {user.telegram_username && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">@{user.telegram_username}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{getRoleText(user.role)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel Access */}
            {user.role === 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Administrator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Tizim boshqaruvi va ma'lumotlar
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
                    onClick={() => router.push('/admin')}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin panelga o'tish</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Logout Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Chiqish</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}