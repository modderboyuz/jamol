import * as React from "react";
import { Header } from "@/components/layout/header";
import { CategoryNav } from "@/components/layout/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>();
  const [searchQuery, setSearchQuery] = React.useState("");
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Katalog</h1>
          <p className="text-gray-600 mt-2">
            Qurilish materiallari va jihozlari
          </p>
        </div>

        <ProductGrid categoryId={selectedCategory} searchQuery={searchQuery} />
      </main>

      {isMobile && <BottomNavigation />}
    </div>
  );
}
