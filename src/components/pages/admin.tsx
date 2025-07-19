"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  if (statsLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
            <div className="mb-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
          <div className="mb-4">
            <h1 className="text-lg font-bold text-gray-900 mb-1">Admin Panel</h1>
            <p className="text-gray-600 text-sm">Platformani boshqarish paneli</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Foydalanuvchilar</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Mahsulotlar</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Buyurtmalar</p>
                    <p className="text-lg font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Daromad</p>
                    <p className="text-lg font-bold text-gray-900">
                      {((stats?.totalRevenue || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Admin panel funksionalligi ishlab chiqilmoqda...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}