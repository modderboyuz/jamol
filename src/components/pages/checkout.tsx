"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/app-layout';
import { 
  MapPin, 
  User, 
  Phone, 
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Navigation
} from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isDelivery, setIsDelivery] = useState(false);

  // Fetch cart items
  const { data: cartItems, isLoading: cartLoading } = useQuery({
    queryKey: ['/api/cart'],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch('/api/cart', {
        headers: {
          'x-telegram-id': user?.telegram_id?.toString() || '',
        },
      });
      if (!response.ok) {
        throw new Error('Savatni yuklashda xatolik');
      }
      return response.json();
    },
  });

  // Place order
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-id': user?.telegram_id?.toString() || '',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Buyurtma berishda xatolik');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Buyurtma berish",
        description: "Buyurtma muvaffaqiyatli berildi!",
      });
      router.push('/orders');
    },
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price)) + " so'm";
  };

  const getTotalAmount = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total: number, item: any) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Xatolik",
        description: "Savat bo'sh",
        variant: "destructive",
      });
      return;
    }

    if (isDelivery && !deliveryAddress) {
      toast({
        title: "Xatolik",
        description: "Yetkazib berish manzilini kiriting",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      total_amount: getTotalAmount(),
      is_delivery: isDelivery,
      delivery_address: isDelivery ? deliveryAddress : null,
      status: 'pending',
    };

    placeOrderMutation.mutate(orderData);
  };

  if (cartLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Yuklanmoqda...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Savat bo'sh</h2>
            <p className="text-gray-600 mb-4">Hozircha savatda mahsulotlar yo'q</p>
            <Button onClick={() => router.push('/catalog')}>
              Katalogga o'tish
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Buyurtma berish</h1>
        </div>

        {/* Cart Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Savat ({cartItems.length} mahsulot)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={item.product.image_url || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                  alt={item.product.name_uz}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name_uz}</h3>
                  <p className="text-sm text-gray-600">{formatPrice(item.product.price)} / {item.product.unit}</p>
                  {item.product.is_rental && (
                    <Badge variant="secondary" className="mt-1">Ijara</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">x{item.quantity}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice((Number(item.product.price) * item.quantity).toString())}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Shaxsiy ma'lumotlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Ism va familiya</Label>
              <Input
                id="fullName"
                value={`${user?.first_name} ${user?.last_name}`}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                value={user?.phone || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Yetkazib berish
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery"
                checked={isDelivery}
                onChange={(e) => setIsDelivery(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="delivery">Yetkazib berish xizmati</Label>
            </div>
            
            {isDelivery && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Yetkazib berish manzili</Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Manzilni kiriting..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buyurtma jami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Mahsulotlar jami:</span>
                <span>{formatPrice(getTotalAmount().toString())}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Jami:</span>
                <span>{formatPrice(getTotalAmount().toString())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-semibold"
        >
          {placeOrderMutation.isPending ? 'Yuklanmoqda...' : 'Buyurtma berish'}
        </Button>
      </div>
    </AppLayout>
  );
}