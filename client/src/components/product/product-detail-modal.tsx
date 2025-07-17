import * as React from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBottomNav } from "@/hooks/use-bottom-nav";
import { 
  ShoppingCart, 
  Package, 
  Minus, 
  Plus,
  Heart,
  Share,
  Info
} from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { hide, show } = useBottomNav();

  React.useEffect(() => {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }, [isOpen, hide, show]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-h-[75vh]"
    >
      <div className="space-y-3">
        {/* Product Image - iOS Style Compact */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          {product.is_rental && (
            <Badge className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
              Ijara
            </Badge>
          )}
          
          {/* Action buttons - iOS Style */}
          <div className="absolute top-2 right-2 flex space-x-1">
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
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {product.name_uz}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {product.description_uz}
            </p>
          </div>

          {/* Price - iOS Style */}
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-black">
              {Number(product.price).toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">
              so'm/{product.unit}
            </span>
          </div>

          {product.is_rental && (
            <div className="bg-gray-100 rounded-lg p-2">
              <p className="text-xs text-gray-700">
                Ijara asosida taqdim etiladi
              </p>
            </div>
          )}

          {/* Quantity Selector - iOS Style */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0 rounded-full border-gray-300"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="text-lg font-medium w-10 text-center">
                  {quantity}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={incrementQuantity}
                  className="w-8 h-8 p-0 rounded-full border-gray-300"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">Jami summa</div>
                <div className="font-bold text-lg text-black">
                  {(Number(product.price) * quantity).toLocaleString()} so'm
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - iOS Style */}
        <div className="flex space-x-3 pt-3">
          <Button
            variant="outline"
            className="flex-1 py-3 text-sm font-medium rounded-lg border-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            Bekor qilish
          </Button>
          
          <Button
            onClick={handleAddToCart}
            className="flex-2 bg-black hover:bg-gray-800 text-white py-3 text-sm font-medium rounded-lg"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Savatchaga qo'shish
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}