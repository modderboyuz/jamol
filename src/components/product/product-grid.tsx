"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { ProductDetailModal } from "./product-detail-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface ProductGridProps {
  categoryId?: string;
  searchQuery?: string;
}

export function ProductGrid({ categoryId, searchQuery }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', categoryId, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        throw new Error('Mahsulotlarni yuklashda xatolik');
      }
      return response.json();
    },
  });

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    console.log('Add to cart:', productId, quantity);
    // This would typically update a cart state or send to backend
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Xatolik yuz berdi</h3>
        <p className="text-gray-600">Mahsulotlarni yuklashda muammo bo'ldi</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Package className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Mahsulotlar topilmadi</h3>
        <p className="text-gray-600">
          {searchQuery ? "Qidiruv bo'yicha natija yo'q" : "Ushbu kategoriyada mahsulotlar yo'q"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(productId) => handleAddToCart(productId, 1)}
            onProductClick={handleProductClick}
          />
        ))}
      </div>
      
      {products.length >= 20 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl"
          >
            Ko'proq mahsulotlar
          </Button>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />
    </div>
  );
}