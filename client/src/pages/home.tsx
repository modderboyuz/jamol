import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Building, 
  Grid3X3, 
  Cylinder, 
  Square, 
  Droplets, 
  Zap,
  ArrowRight,
  Star,
  ShoppingCart,
  Package
} from "lucide-react";
import { supabase } from "@/lib/auth";
import type { Category, Product, Ad } from "@shared/supabase-types";

const categoryIcons = {
  building: Building,
  'grid-3x3': Grid3X3,
  pipe: Cylinder,
  square: Square,
  droplets: Droplets,
  zap: Zap,
};

function Hero() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          MetalBaza
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Qurilish materiallari va metallarga ixtisoslashgan
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Package className="mr-2 h-5 w-5" />
              Katalogni ko'rish
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buyurtma berish
          </Button>
        </div>
      </div>
    </div>
  );
}

function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  if (isLoading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-12 mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Kategoriyalar</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sizga kerakli qurilish materiallarini toping
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories?.map((category) => {
            const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Package;
            return (
              <Link key={category.id} href={`/catalog?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-300 dark:hover:border-gray-600">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                      <IconComponent className="w-full h-full text-gray-600 dark:text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.name_uz}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{category.name_ru}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .limit(8)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    }
  });

  if (isLoading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Mashhur mahsulotlar</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Eng ko'p sotilgan va sifatli materiallar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name_uz}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {product.is_rental && (
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    Ijara
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-2">{product.name_uz}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{product.name_ru}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {Number(product.price).toLocaleString()} so'm
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                  </div>
                  <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/catalog">
            <Button size="lg" variant="outline">
              Barcha mahsulotlarni ko'rish
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
            <div className="text-gray-300">Mahsulotlar</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
            <div className="text-gray-300">Mijozlar</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
            <div className="text-gray-300">Brendlar</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-300">Yordam</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Stats />
    </div>
  );
}