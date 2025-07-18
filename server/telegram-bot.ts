import { Bot, Context, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { storage } from "./storage.js";
import type { InsertUser } from "../shared/schema.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "dummy_token");

// Session middleware
bot.use(session({
  initial: () => ({}),
}));

// Conversations middleware
bot.use(conversations());

// Registration conversation
async function registrationConversation(conversation: any, ctx: Context) {
  await ctx.reply("Ro'yxatdan o'tish uchun telefon raqamingizni ulashing:", {
    reply_markup: {
      keyboard: [[{ text: "📱 Telefon raqamni ulashish", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });

  const contactCtx = await conversation.wait();
  
  if (!contactCtx.message?.contact) {
    await ctx.reply("Iltimos, telefon raqamingizni ulashing.");
    return;
  }

  const phone = contactCtx.message.contact.phone_number;
  
  await ctx.reply("Ismingizni kiriting:", {
    reply_markup: { remove_keyboard: true },
  });

  const firstNameCtx = await conversation.wait();
  const firstName = firstNameCtx.message?.text;

  if (!firstName) {
    await ctx.reply("Iltimos, ismingizni kiriting.");
    return;
  }

  await ctx.reply("Familiyangizni kiriting:");

  const lastNameCtx = await conversation.wait();
  const lastName = lastNameCtx.message?.text;

  if (!lastName) {
    await ctx.reply("Iltimos, familiyangizni kiriting.");
    return;
  }

  try {
    const userData: InsertUser = {
      phone,
      first_name: firstName,
      last_name: lastName,
      telegram_username: ctx.from?.username,
      telegram_id: ctx.from?.id,
      role: "client",
      type: "telegram",
    };

    const user = await storage.createUser(userData);
    
    await ctx.reply(
      `✅ Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!\n\n` +
      `👤 Ism: ${firstName} ${lastName}\n` +
      `📱 Telefon: ${phone}\n` +
      `🔗 Telegram: @${ctx.from?.username || "noma'lum"}\n\n` +
      `Endi veb-saytda avtomatik tarzda kirib olishingiz mumkin.`
    );
  } catch (error) {
    await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    console.error("Registration error:", error);
  }
}

bot.use(createConversation(registrationConversation));

// Start command
bot.command("start", async (ctx) => {
  const existingUser = await storage.getUserByTelegramId(ctx.from?.id);
  
  if (existingUser) {
    await ctx.reply(
      `Xush kelibsiz, ${existingUser.first_name}! 👋\n\n` +
      `Siz allaqachon ro'yxatdan o'tgansiz. Veb-saytda avtomatik tarzda kirib olishingiz mumkin.`
    );
    return;
  }

  await ctx.reply(
    `🏗️ MetalBaza ga xush kelibsiz!\n\n` +
    `Bu bot orqali ro'yxatdan o'tib, qurilish materiallari va jihozlarini buyurtma qilishingiz mumkin.\n\n` +
    `/register - Ro'yxatdan o'tish`
  );
});

// Register command
bot.command("register", async (ctx) => {
  const existingUser = await storage.getUserByTelegramId(ctx.from?.id);
  
  if (existingUser) {
    await ctx.reply("Siz allaqachon ro'yxatdan o'tgansiz!");
    return;
  }
  
  await ctx.conversation.enter("registrationConversation");
});

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

export { bot };
