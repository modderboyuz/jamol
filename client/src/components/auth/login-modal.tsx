import * as React from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { config } from "@/lib/config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTelegramLogin = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would redirect to Telegram bot
      // For now, we'll simulate the flow

      // Open Telegram bot link
      const botUsername = config.telegram.botUsername;
      const telegramUrl = `https://t.me/${botUsername}?start=login`;

      // Open in new window/tab
      window.open(telegramUrl, "_blank");

      // Show instructions to user
      alert(
        "Telegram botga o'ting va /start buyrug'ini bosing, so'ngra ro'yxatdan o'tish jarayonini boshlang.",
      );

      // Close modal
      onClose();
    } catch (error) {
      console.error("Telegram login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Kirish">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600">
            Buyurtma berish va profil boshqarish uchun
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleTelegramLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-800 text-white py-3 rounded-xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Telegram orqali kirish</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Telegram botimizga o'tib, /start buyrug'ini bosing
            </p>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
