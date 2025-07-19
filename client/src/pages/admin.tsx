import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/query-client";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";
import type { User, Product, Order, Category, Ad } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface OrderWithItems extends Order {
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const switchUserRoleMutation = useMutation({
    mutationFn: ({ userId, switchedTo }: { userId: string; switchedTo: 'client' | 'admin' | null }) =>
      apiRequest(`/api/users/${userId}/switch-role`, {
        method: 'POST',
        body: JSON.stringify({ switchedTo }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi roli o'zgartirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Rolni o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const handleRoleSwitch = (user: User, newRole: 'client' | 'admin' | null) => {
    switchUserRoleMutation.mutate({ userId: user.id, switchedTo: newRole });
  };

  if (statsLoading) {
    return (
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
    );
  }

  return (
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

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="overview" className="text-xs">Ko'rinish</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">Buyurtmalar</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Mahsulotlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">So'nggi buyurtmalar</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders?.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{order.total_amount.toLocaleString()}</p>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tizim statistikasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Faol foydalanuvchilar</span>
                      <span className="font-medium">{stats?.totalUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Mavjud mahsulotlar</span>
                      <span className="font-medium">{stats?.totalProducts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Umumiy buyurtmalar</span>
                      <span className="font-medium">{stats?.totalOrders || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Barcha buyurtmalar</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders?.map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-sm">#{order.id.slice(0, 8)}</h3>
                            <p className="text-xs text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{order.total_amount.toLocaleString()} so'm</p>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span>{item.product_name} x{item.quantity}</span>
                              <span>{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!orders?.length && (
                      <p className="text-center text-gray-500 py-8">Buyurtmalar yo'q</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Foydalanuvchilar ro'yxati</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users?.map((user: User) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-gray-600">@{user.telegram_username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0"
                              onClick={() => handleRoleSwitch(user, user.role === 'admin' ? 'client' : 'admin')}
                              disabled={switchUserRoleMutation.isPending}
                            >
                              {user.role === 'admin' ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!users?.length && (
                      <p className="text-center text-gray-500 py-8">Foydalanuvchilar yo'q</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Mahsulotlar ro'yxati</CardTitle>
                <Button size="sm" className="h-7">
                  <Plus className="h-3 w-3 mr-1" />
                  Qo'shish
                </Button>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products?.map((product: Product) => (
                      <div key={product.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{product.name_uz}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2">{product.description_uz}</p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{product.price.toLocaleString()} so'm</span>
                          <Badge variant={product.is_available ? 'default' : 'secondary'} className="text-xs">
                            {product.is_available ? 'Mavjud' : 'Tugagan'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {!products?.length && (
                      <p className="text-center text-gray-500 py-8 col-span-2">Mahsulotlar yo'q</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}