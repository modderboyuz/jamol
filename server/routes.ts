import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./supabase-storage";

interface AuthRequest extends Request {
  telegramId?: string;
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Telegram webhook setup
  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const { telegramRouter, setWebhook } = await import("./telegram-webhook");
      app.use(telegramRouter);
      
      // Set webhook after server starts
      setTimeout(async () => {
        try {
          await setWebhook();
          console.log("Telegram webhook configured successfully");
        } catch (error) {
          console.error("Failed to set Telegram webhook:", error);
        }
      }, 5000);
    } catch (error) {
      console.log("Telegram bot not configured:", error);
    }
  }

  // Authentication middleware
  const requireAuth = (req: AuthRequest, res: Response, next: any) => {
    const telegramId = req.headers['x-telegram-id'];
    if (!telegramId) {
      return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
    }
    req.telegramId = telegramId as string;
    next();
  };

  const requireAdmin = async (req: AuthRequest, res: Response, next: any) => {
    const user = await storage.getUserByTelegramId(Number(req.telegramId));
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin huquqlari talab qilinadi" });
    }
    req.user = user;
    next();
  };

  // Auth routes
  app.post("/api/auth/telegram", async (req, res) => {
    try {
      const { telegram_id } = req.body;
      const user = await storage.getUserByTelegramId(Number(telegram_id));
      
      if (!user) {
        return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server xatoligi" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Kategoriyalarni olishda xatolik" });
    }
  });

  app.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Noto'g'ri ma'lumotlar" });
    }
  });

  app.put("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Kategoriyani yangilashda xatolik" });
    }
  });

  app.delete("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Kategoriyani o'chirishda xatolik" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category_id, search } = req.query;
      const products = await storage.getProducts(
        category_id as string,
        search as string
      );
      res.json(products);
    } catch (error) {
      console.error('Products API error:', error);
      res.status(500).json({ error: "Mahsulotlarni olishda xatolik" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Mahsulot topilmadi" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Mahsulotni olishda xatolik" });
    }
  });

  app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Noto'g'ri ma'lumotlar" });
    }
  });

  app.put("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Mahsulotni yangilashda xatolik" });
    }
  });

  app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" });
    }
  });

  // Orders
  app.get("/api/orders", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserByTelegramId(Number(req.telegramId));
      if (!user) {
        return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      }

      const orders = await storage.getOrders(user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Buyurtmalarni olishda xatolik" });
    }
  });

  app.post("/api/orders", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserByTelegramId(Number(req.telegramId));
      if (!user) {
        return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
      }

      const orderData = insertOrderSchema.parse({
        ...req.body,
        user_id: user.id,
      });
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Buyurtma berishda xatolik" });
    }
  });

  // Ads
  app.get("/api/ads", async (req, res) => {
    try {
      const ads = await storage.getActiveAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Reklamalarni olishda xatolik" });
    }
  });

  app.post("/api/ads", requireAuth, requireAdmin, async (req, res) => {
    try {
      const adData = insertAdSchema.parse(req.body);
      const ad = await storage.createAd(adData);
      res.json(ad);
    } catch (error) {
      res.status(400).json({ error: "Reklama yaratishda xatolik" });
    }
  });

  // Workers
  app.get("/api/workers", async (req: AuthRequest, res: Response) => {
    try {
      const { search } = req.query;
      const workers = await storage.getWorkers(search as string);
      
      // Check if user is admin to show sensitive data
      let isAdmin = false;
      if (req.telegramId) {
        const user = await storage.getUserByTelegramId(Number(req.telegramId));
        isAdmin = user?.role === 'admin';
      }
      
      // Filter sensitive data for non-admin users
      const filteredWorkers = workers.map(worker => {
        if (isAdmin) {
          return worker; // Show all data for admin
        } else {
          // Hide sensitive data for non-admin users
          return {
            id: worker.id,
            first_name: worker.first_name,
            last_name: worker.last_name,
            telegram_username: worker.telegram_username,
            role: worker.role,
            specialization: worker.specialization,
            experience_years: worker.experience_years,
            hourly_rate: worker.hourly_rate,
            created_at: worker.created_at
            // Hide: phone, passport_series, passport_number, passport_issued_by, passport_issued_date, address
          };
        }
      });
      
      res.json(filteredWorkers);
    } catch (error) {
      res.status(500).json({ error: "Ustalarni olishda xatolik" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      // This would need implementation for getting all users
      res.json({ message: "Admin panel - foydalanuvchilar" });
    } catch (error) {
      res.status(500).json({ error: "Admin ma'lumotlarini olishda xatolik" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
