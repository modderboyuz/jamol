import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@shared/schema";

interface CategoryNavProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
}

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-2">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  const categoryIcons: Record<string, string> = {
    'temir-beton': '🏗️',
    'metalloprokat': '🔧',
    'polimerlar': '🧪',
    'asbest-sement': '🏠',
    'jihozlar': '⚙️',
    'arenda': '📅',
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pl-4">
          {/* All categories button */}
          <button
            onClick={() => onCategoryChange(undefined)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center space-y-1 group",
              !selectedCategory && "text-gray-900"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
              selectedCategory ? "bg-gray-100 group-hover:bg-gray-200" : "bg-gray-900"
            )}>
              <span className={cn(
                "text-lg",
                selectedCategory ? "text-gray-700" : "text-white"
              )}>
                🏪
              </span>
            </div>
            <span className="text-xs font-medium">Hammasi</span>
          </button>

          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center space-y-1 group",
                selectedCategory === category.id && "text-gray-900"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                selectedCategory === category.id ? "bg-gray-900" : "bg-gray-100 group-hover:bg-gray-200"
              )}>
                <span className={cn(
                  "text-lg",
                  selectedCategory === category.id ? "text-white" : "text-gray-700"
                )}>
                  {categoryIcons[category.icon || ''] || '📦'}
                </span>
              </div>
              <span className="text-xs font-medium text-center max-w-16 truncate">
                {category.name_uz}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
