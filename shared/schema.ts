import { pgTable, text, serial, integer, boolean, decimal, timestamp, uuid, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").unique().notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  telegram_username: text("telegram_username"),
  telegram_id: bigint("telegram_id", { mode: "number" }).unique(),
  role: text("role", { enum: ["client", "worker", "admin"] }).default("client").notNull(),
  type: text("type", { enum: ["telegram", "google"] }).default("telegram").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name_uz: text("name_uz").notNull(),
  name_ru: text("name_ru"),
  icon: text("icon"),
  order_index: integer("order_index").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name_uz: text("name_uz").notNull(),
  name_ru: text("name_ru"),
  description_uz: text("description_uz"),
  description_ru: text("description_ru"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  category_id: uuid("category_id").references(() => categories.id),
  image_url: text("image_url"),
  is_available: boolean("is_available").default(true),
  is_rental: boolean("is_rental").default(false),
  unit: text("unit").default("dona"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),
  total_amount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "confirmed", "processing", "completed", "cancelled"] }).default("pending").notNull(),
  delivery_address: text("delivery_address"),
  delivery_date: timestamp("delivery_date"),
  notes: text("notes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const order_items = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  product_id: uuid("product_id").references(() => products.id),
  quantity: integer("quantity").default(1).notNull(),
  price_per_unit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  total_price: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ads = pgTable("ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title_uz: text("title_uz").notNull(),
  title_ru: text("title_ru"),
  description_uz: text("description_uz"),
  description_ru: text("description_ru"),
  image_url: text("image_url"),
  link_url: text("link_url"),
  is_active: boolean("is_active").default(true),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  created_at: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOrderItemSchema = createInsertSchema(order_items).omit({
  id: true,
  created_at: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof order_items.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
