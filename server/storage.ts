import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, desc, ilike, or, isNull } from "drizzle-orm";
import { 
  users, 
  categories, 
  products, 
  orders, 
  order_items, 
  ads,
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
  type InsertAd
} from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: number | undefined): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  
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
  
  // Ads
  getActiveAds(): Promise<Ad[]>;
  getAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad>;
  deleteAd(id: string): Promise<void>;
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
}

export const storage = new DrizzleStorage();
