import { db } from './db';
import { eq, and, desc, ilike, or, isNull, sql } from "drizzle-orm";
import { 
  users, 
  categories, 
  products, 
  orders, 
  order_items, 
  ads,
  cart_items,
  company_settings,
  worker_applications,
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type Product, 
  type InsertProduct,
  type Order, 
  type InsertOrder,
  type OrderItem, 
  type InsertOrderItem,
  type Ad, 
  type InsertAd,
  type CartItem,
  type CompanySettings,
  type InsertCompanySettings,
  type WorkerApplication,
  type InsertWorkerApplication,
  insertCartItemSchema
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: number | undefined): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  updateUserSwitchedTo(id: string, switchedTo: 'client' | 'admin' | null): Promise<User>;
  getWorkers(search?: string): Promise<User[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Products
  getProducts(categoryId?: string, search?: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Orders
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: string, productId: string, quantity: number): Promise<CartItem>;
  updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem>;
  removeFromCart(userId: string, productId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Ads
  getActiveAds(): Promise<Ad[]>;
  getAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad>;
  deleteAd(id: string): Promise<void>;
  
  // Company Settings
  getCompanySettings(): Promise<CompanySettings | undefined>;
  updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings>;
  
  // Worker Applications
  getWorkerApplications(workerId: string): Promise<WorkerApplication[]>;
  getClientApplications(clientId: string): Promise<WorkerApplication[]>;
  createWorkerApplication(application: InsertWorkerApplication): Promise<WorkerApplication>;
  updateWorkerApplication(id: string, application: Partial<InsertWorkerApplication>): Promise<WorkerApplication>;
  deleteWorkerApplication(id: string): Promise<void>;
}

export class DrizzleStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByTelegramId(telegramId: number | undefined): Promise<User | undefined> {
    if (!telegramId) return undefined;
    const result = await db.select().from(users).where(eq(users.telegram_id, telegramId)).limit(1);
    return result[0];
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async updateUserSwitchedTo(id: string, switchedTo: 'client' | 'admin' | null): Promise<User> {
    const result = await db.update(users).set({ switched_to: switchedTo }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getWorkers(search?: string): Promise<User[]> {
    try {
      // Simple query first - just get all workers
      const result = await db.select().from(users).where(eq(users.role, 'worker')).orderBy(desc(users.created_at));
      
      // Apply search filter in memory if needed
      if (search && result.length > 0) {
        const searchLower = search.toLowerCase();
        return result.filter(user => 
          user.first_name?.toLowerCase().includes(searchLower) ||
          user.last_name?.toLowerCase().includes(searchLower) ||
          user.telegram_username?.toLowerCase().includes(searchLower)
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error getting workers:', error);
      return [];
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.is_active, true)).orderBy(categories.order_index);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(categoryId?: string, search?: string): Promise<Product[]> {
    let conditions = [eq(products.is_available, true)];

    if (categoryId) {
      conditions.push(eq(products.category_id, categoryId));
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name_uz, `%${search}%`),
          ilike(products.description_uz, `%${search}%`)
        )!
      );
    }

    if (conditions.length === 1) {
      return await db.select().from(products)
        .where(conditions[0])
        .orderBy(desc(products.created_at));
    }

    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.created_at));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders)
        .where(eq(orders.user_id, userId))
        .orderBy(desc(orders.created_at));
    }

    return await db.select().from(orders)
      .orderBy(desc(orders.created_at));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(order_items).where(eq(order_items.order_id, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(order_items).values(orderItem).returning();
    return result[0];
  }

  // Ads
  async getActiveAds(): Promise<Ad[]> {
    return await db.select().from(ads)
      .where(
        and(
          eq(ads.is_active, true),
          or(
            isNull(ads.start_date),
            eq(ads.start_date, new Date())
          )
        )
      )
      .orderBy(desc(ads.created_at));
  }

  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.created_at));
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const result = await db.insert(ads).values(ad).returning();
    return result[0];
  }

  async updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad> {
    const result = await db.update(ads).set(ad).where(eq(ads.id, id)).returning();
    return result[0];
  }

  async deleteAd(id: string): Promise<void> {
    await db.delete(ads).where(eq(ads.id, id));
  }

  // Cart functionality
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const result = await db
      .select({
        id: cart_items.id,
        user_id: cart_items.user_id,
        product_id: cart_items.product_id,
        quantity: cart_items.quantity,
        created_at: cart_items.created_at,
        product: products
      })
      .from(cart_items)
      .innerJoin(products, eq(cart_items.product_id, products.id))
      .where(eq(cart_items.user_id, userId))
      .orderBy(desc(cart_items.created_at));
    
    return result;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await db
      .select()
      .from(cart_items)
      .where(and(eq(cart_items.user_id, userId), eq(cart_items.product_id, productId)))
      .limit(1);

    if (existing.length > 0) {
      // Update existing item
      const result = await db
        .update(cart_items)
        .set({ quantity: existing[0].quantity + quantity })
        .where(eq(cart_items.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      // Create new item
      const result = await db
        .insert(cart_items)
        .values({ user_id: userId, product_id: productId, quantity })
        .returning();
      return result[0];
    }
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const result = await db
      .update(cart_items)
      .set({ quantity })
      .where(and(eq(cart_items.user_id, userId), eq(cart_items.product_id, productId)))
      .returning();
    return result[0];
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await db
      .delete(cart_items)
      .where(and(eq(cart_items.user_id, userId), eq(cart_items.product_id, productId)));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cart_items).where(eq(cart_items.user_id, userId));
  }

  // Company Settings
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    const result = await db.select().from(company_settings).limit(1);
    return result[0];
  }

  async updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    const existing = await this.getCompanySettings();
    if (existing) {
      const result = await db.update(company_settings)
        .set(settings)
        .where(eq(company_settings.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(company_settings).values(settings).returning();
      return result[0];
    }
  }

  // Worker Applications
  async getWorkerApplications(workerId: string): Promise<WorkerApplication[]> {
    try {
      return await db.select().from(worker_applications)
        .where(eq(worker_applications.worker_id, workerId))
        .orderBy(desc(worker_applications.created_at));
    } catch (error) {
      console.error('Error getting worker applications:', error);
      return [];
    }
  }

  async getClientApplications(clientId: string): Promise<WorkerApplication[]> {
    return await db.select().from(worker_applications)
      .where(eq(worker_applications.client_id, clientId))
      .orderBy(desc(worker_applications.created_at));
  }

  async createWorkerApplication(application: InsertWorkerApplication): Promise<WorkerApplication> {
    const result = await db.insert(worker_applications).values(application).returning();
    return result[0];
  }

  async updateWorkerApplication(id: string, application: Partial<InsertWorkerApplication>): Promise<WorkerApplication> {
    const result = await db.update(worker_applications)
      .set(application)
      .where(eq(worker_applications.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkerApplication(id: string): Promise<void> {
    await db.delete(worker_applications).where(eq(worker_applications.id, id));
  }
}

export const storage = new DrizzleStorage();
