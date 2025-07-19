import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBottomNav } from "@/hooks/use-bottom-nav";
import { 
  ShoppingCart, 
  Package, 
  Minus, 
  Plus,
  Heart,
  Share,
  Info,
  Eye
} from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onProductClick?: (product: Product) => void;
}

export function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onProductClick 
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [showFullDetails, setShowFullDetails] = React.useState(false);
  const { hide, show } = useBottomNav();

  // Get similar products
  const { data: similarProducts, isLoading: loadingSimilar } = useQuery<Product[]>({
    queryKey: ['/api/products', product?.category_id],
    enabled: !!product && isOpen,
    queryFn: async () => {
      if (!product?.category_id) return [];
      const response = await fetch(`/api/products?category_id=${product.category_id}`);
      if (!response.ok) return [];
      const allProducts = await response.json();
      // Filter out current product and return only 4 similar ones
      return allProducts.filter((p: Product) => p.id !== product.id).slice(0, 4);
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      hide();
      // Don't reset state when opening - only reset when product changes
    } else {
      show();
    }
  }, [isOpen, hide, show]);

  // Reset state only when product changes
  React.useEffect(() => {
    if (product) {
      setShowFullDetails(false);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) return null;

  const handleAddToCart = async () => {
    console.log("Add to cart:", product.id, quantity);
    try {
      // Get telegram_id from localStorage
      const telegramId = localStorage.getItem('telegram_id');
      if (!telegramId) {
        console.error('No telegram ID found');
        onAddToCart(product.id, quantity);
        onClose();
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-id': telegramId,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });
      
      if (response.ok) {
        // Invalidate cart query to refresh cart bar
        import('@/lib/query-client').then(({ queryClient }) => {
          queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
        });
        onAddToCart(product.id, quantity);
        onClose(); // Close modal after successful add
      } else {
        console.error('Failed to add to cart');
        // Fallback to original handler
        onAddToCart(product.id, quantity);
        onClose();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to original handler
      onAddToCart(product.id, quantity);
      onClose();
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleSimilarProductClick = (similarProduct: Product) => {
    if (onProductClick) {
      onProductClick(similarProduct);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price)) + " so'm";
  };

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-h-[95vh] overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Product Image - iOS Style Compact */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative overflow-hidden">
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
            alt={product.name_uz}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400";
            }}
          />
          {product.is_rental && (
            <Badge className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1">
              Ijara
            </Badge>
          )}
          
          {/* Action buttons - iOS Style */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm rounded-full border-none shadow-sm"
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm rounded-full border-none shadow-sm"
            >
              <Share className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Product Info - iOS Style Compact */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name_uz}
            </h2>
            <p className={`text-gray-600 text-sm leading-relaxed ${showFullDetails ? '' : 'line-clamp-3'}`}>
              {product.description_uz}
            </p>
          </div>

          {/* Price - iOS Style */}
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-black">
              {formatPrice(product.price)}
            </span>
            <span className="text-gray-500 text-sm">
              /{product.unit}
            </span>
          </div>

          {product.is_rental && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Ijara asosida taqdim etiladi
              </p>
            </div>
          )}

          {/* Full Details Toggle Button */}
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowFullDetails(!showFullDetails);
            }}
            className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span>{showFullDetails ? 'Kamroq ko\'rish' : 'To\'liq ko\'rish'}</span>
          </Button>

          {/* Full Details Section */}
          {showFullDetails && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Kategoriya:</span>
                  <p className="font-medium">Qurilish materiallari</p>
                </div>
                <div>
                  <span className="text-gray-500">Mavjudlik:</span>
                  <p className="font-medium text-green-600">Mavjud</p>
                </div>
                <div>
                  <span className="text-gray-500">O'lchov:</span>
                  <p className="font-medium">{product.unit}</p>
                </div>
                <div>
                  <span className="text-gray-500">Turi:</span>
                  <p className="font-medium">{product.is_rental ? 'Ijara' : 'Sotish'}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">To'liq tavsif:</span>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {product.description_uz || "Mahsulot haqida qo'shimcha ma'lumot yo'q"}
                </p>
              </div>
            </div>
          )}

          {/* Quantity Selector - iOS Style */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Miqdor</span>
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    decrementQuantity();
                  }}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    incrementQuantity();
                  }}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button - iOS Style */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.is_rental ? 'Ijaraga olish' : 'Savatga qo\'shish'}
          </Button>

          {/* Similar Products Section - Always Show */}
          {similarProducts && similarProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Shunga o'xshash mahsulotlar</h3>
              
              {loadingSimilar ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-square" />
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {similarProducts.map((similarProduct) => (
                    <Card 
                      key={similarProduct.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSimilarProductClick(similarProduct)}
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={similarProduct.image_url || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                          alt={similarProduct.name_uz}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200";
                          }}
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {similarProduct.name_uz}
                        </h4>
                        <p className="text-sm font-semibold text-black">
                          {formatPrice(similarProduct.price)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}