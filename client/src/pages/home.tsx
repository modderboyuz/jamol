import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { CategoryNav } from "@/components/layout/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Ad } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>();
  const [searchQuery, setSearchQuery] = React.useState("");
  const isMobile = useIsMobile();

  const { data: ads } = useQuery<Ad[]>({
    queryKey: ['/api/ads'],
  });

  const activeAd = ads?.[0]; // Show first active ad

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isMobile ? 'pb-20' : ''}`}>
        {/* Ad Banner */}
        {activeAd && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{activeAd.title_uz}</h3>
                    <p className="text-xs text-gray-600">{activeAd.description_uz}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-medium text-gray-900 hover:text-gray-700 bg-white/50 hover:bg-white/80 rounded-xl px-3"
                >
                  Batafsil
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products */}
        <ProductGrid categoryId={selectedCategory} searchQuery={searchQuery} />
      </main>

      {isMobile && <BottomNavigation />}
    </div>
  );
}
