import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Search,
  Building2, 
  Wrench, 
  Truck, 
  Zap,
  ShoppingCart,
  Package
} from "lucide-react";
import type { Category, Product, Ad } from "@shared/schema";

const categoryIcons = {
  building: Building2,
  wrench: Wrench,
  truck: Truck,
  zap: Zap,
};

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 bg-white">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Mahsulotlarni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 border-none rounded-xl h-11"
        />
      </div>
    </div>
  );
}

function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-12 h-3 mt-2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories?.map((category: Category) => {
          const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Package;
          return (
            <Link key={category.id} href={`/catalog?category=${category.id}`}>
              <div className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-xs text-gray-700 text-center w-16 truncate">
                  {category.name_uz}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AdBanner() {
  const { data: ads } = useQuery({
    queryKey: ['/api/ads'],
  });

  if (!ads || ads.length === 0) {
    return null;
  }

  const ad = ads[0];

  return (
    <div className="px-4 py-3">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <h3 className="font-semibold text-lg mb-1">{ad.title_uz}</h3>
        <p className="text-blue-100 text-sm">{ad.description_uz}</p>
      </div>
    </div>
  );
}

function ProductList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mahsulotlar</h2>
        <Link href="/catalog">
          <Button variant="ghost" size="sm" className="text-blue-600">
            Barchasi
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {products?.slice(0, 8).map((product: Product) => (
          <Card key={product.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{product.name_uz}</h3>
                    {product.is_rental && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Ijara
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {product.description_uz}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">so'm/{product.unit}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
      <Categories />
      <AdBanner />
      <ProductList />
    </div>
  );
}