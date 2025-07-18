import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";

// Initialize sample data
const initSampleData = async () => {
  // This would be replaced with actual database seeding
  try {
    // Categories
    const categories = [
      { name_uz: "Temir-beton", name_ru: "Железобетон", icon: "temir-beton", order_index: 1 },
      { name_uz: "Metalloprokat", name_ru: "Металлопрокат", icon: "metalloprokat", order_index: 2 },
      { name_uz: "Polimerlar", name_ru: "Полимеры", icon: "polimerlar", order_index: 3 },
      { name_uz: "Asbest-sement", name_ru: "Асбест-цемент", icon: "asbest-sement", order_index: 4 },
      { name_uz: "Jihozlar", name_ru: "Оборудование", icon: "jihozlar", order_index: 5 },
      { name_uz: "Arenda", name_ru: "Аренда", icon: "arenda", order_index: 6 },
    ];

    // Products
    const products = [
      {
        name_uz: "Temir armatura A500C",
        name_ru: "Арматура A500C",
        description_uz: "Diametri 12mm, uzunligi 12m",
        description_ru: "Диаметр 12мм, длина 12м",
        price: "45000.00",
        is_rental: false,
        unit: "dona"
      },
      {
        name_uz: "Metall varaq 2mm",
        name_ru: "Металлический лист 2мм",
        description_uz: "1250x2500mm o'lcham",
        description_ru: "Размер 1250x2500мм",
        price: "120000.00",
        is_rental: false,
        unit: "dona"
      },
      {
        name_uz: "Ekskavator ijarasi",
        name_ru: "Аренда экскаватора",
        description_uz: "Kunlik ijara, operatori bilan",
        description_ru: "Суточная аренда с оператором",
        price: "450000.00",
        is_rental: true,
        unit: "kun"
      }
    ];

    // Ads
    const ads = [
      {
        title_uz: "Yangi mahsulotlar 30% chegirma bilan!",
        title_ru: "Новые товары со скидкой 30%!",
        description_uz: "Cheklangan vaqt uchun",
        description_ru: "Ограниченное время",
        is_active: true
      }
    ];

    console.log("Sample data initialized");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};

// Initialize app
createRoot(document.getElementById("root")!).render(<App />);
