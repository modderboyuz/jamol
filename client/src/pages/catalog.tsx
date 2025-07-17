import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { CategoryNav } from "@/components/layout/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { 
  Building2, 
  Wrench, 
  Truck, 
  Zap
} from "lucide-react";
import type { Category } from "@shared/schema";

const categoryIcons = {
  building: Building2,
  wrench: Wrench,
  truck: Truck,
  zap: Zap,
};

function SubcategoryGrid({ parentCategoryId }: { parentCategoryId: string }) {
  const { data: subcategories, isLoading } = useQuery({
    queryKey: [`/api/categories/${parentCategoryId}/subcategories`],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${parentCategoryId}/subcategories`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-16 w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Subkategoriyalar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subcategories.map((subcategory: Category) => (
          <Link key={subcategory.id} href={`/catalog?category=${subcategory.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <CardContent className="p-2">
                <h3 className="font-medium text-xs text-gray-900 line-clamp-2">
                  {subcategory.name_uz}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const selectedCategoryData = categories?.find(cat => cat.id === selectedCategory);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    setSelectedCategory(categoryParam || undefined);
    setSearchQuery(searchParam || "");
  }, [location]);

  // If no category selected, show main categories
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
          <div className="mb-4">
            <h1 className="text-lg font-bold text-gray-900">Katalog</h1>
            <p className="text-gray-600 text-sm">Kategoriyalar ro'yxati</p>
          </div>

          <div className="space-y-2">
            {categories?.map((category: Category) => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Package;
              return (
                <Link key={category.id} href={`/catalog?category=${category.id}`}>
                  <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors text-sm">
                              {category.name_uz}
                            </h3>
                            <p className="text-xs text-gray-600">
                              Kategoriya
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
        {selectedCategory && selectedCategoryData && (
          <div className="mb-4">
            <Link href="/catalog">
              <div className="flex items-center text-gray-600 hover:text-gray-900 mb-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Orqaga</span>
              </div>
            </Link>
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              {selectedCategoryData.name_uz}
            </h1>
          </div>
        )}

        {!selectedCategory && (
          <div className="mb-4">
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              {searchQuery ? `"${searchQuery}" qidiruv natijalari` : 'Katalog'}
            </h1>
            <p className="text-gray-600 text-sm">
              Qurilish materiallari va jihozlari
            </p>
          </div>
        )}

        {selectedCategory && selectedCategoryData && !selectedCategoryData.parent_id && (
          <SubcategoryGrid parentCategoryId={selectedCategory} />
        )}
        
        {/* Faqat subcategory yoki mahsulotlar mavjud bo'lsa ko'rsatamiz */}
        {selectedCategory && (
          <ProductGrid categoryId={selectedCategory} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
