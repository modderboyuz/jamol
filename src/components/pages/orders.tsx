"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { ShoppingCart } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch('/api/orders', {
        headers: {
          'x-telegram-id': user?.telegram_id?.toString() || '',
        },
      });
      if (!response.ok) {
        throw new Error('Buyurtmalarni yuklashda xatolik');
      }
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlangan';
      case 'processing': return 'Jarayonda';
      case 'completed': return 'Bajarilgan';
      case 'cancelled': return 'Bekor qilingan';
      default: return status;
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
            <p className="text-gray-600 mt-2">
              Sizning buyurtmalaringiz tarixi
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        Buyurtma #{order.id.slice(-8)}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Umumiy summa:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('uz-UZ').format(Number(order.total_amount))} so'm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sana:</span>
                        <span>{new Date(order.created_at).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      {order.delivery_address && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manzil:</span>
                          <span className="text-right max-w-xs truncate">{order.delivery_address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <ShoppingCart className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Buyurtmalar yo'q
                </h3>
                <p className="text-gray-600">
                  Hozircha buyurtmalaringiz yo'q. Katalogdan mahsulotlar tanlang.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}