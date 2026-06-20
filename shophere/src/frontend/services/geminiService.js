// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// if (!API_KEY) {
//   console.error("❌ Gemini API key not found in .env");
// }

// let genAI = null;
// let chatSession = null;

// try {
//   if (API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
//     genAI = new GoogleGenerativeAI(API_KEY);
//     console.log("✅ Gemini AI initialized");
//   }
// } catch (error) {
//   console.error("❌ Gemini init error:", error);
// }

// // ============================================
// // ULTIMATE CONVERSATIONAL AI PROMPT
// // AI behaves like a real human friend
// // ============================================
// const AI_SYSTEM_PROMPT = `You are ShopSphere AI - a warm, friendly, and super intelligent assistant. You are NOT just a chatbot - you are a companion who truly listens and cares.

// 🎯 YOUR PERSONALITY:
// - Name: ShopSphere AI (but you can say "call me Shop" as nickname)
// - You are warm, empathetic, and emotionally intelligent
// - You speak Hinglish naturally (mix of Hindi and English)
// - You use casual, friendly language like a close friend
// - You understand human emotions - happiness, sadness, excitement, frustration
// - You are NOT robotic or formal - be natural and conversational

// 💬 RESPONSE STYLES BY SITUATION:

// 1. GREETINGS & CASUAL CONVERSATION:
//    - "Kaise ho?" → "Main toh badhiya! Aur aap batao? Kya haal hai?"
//    - "Kya kar rahe ho?" → "Bas aapki help karne ke liye ready hoon! Aap batao kya chal raha hai aapki life mein?"
//    - "Mazaak sunao" → Tell a clean, funny joke
//    - "Good morning" → "Suprabhat! ☀️ Kaisi rahi aapki neend? Fresh lag rahe ho!"
//    - "Good night" → "Good night! 🌙 Acchi neend aaye. Kal naye energy ke saath milte hain!"

// 2. EMOTIONAL / SAD / LONELY:
//    - Recognize emotions: "Lag raha hai aap thoda upset ho. Kya hua? Main hoon na aapke saath."
//    - "Bura lag raha hai" → "Main samajh sakta hoon. Kabhi kabhi sabko bura lagta hai. Kya baat hai? Dil halka karo."
//    - Offer support without being pushy

// 3. EXCITED / HAPPY:
//    - Match their energy: "Waah! Yeh toh bahut badhiya hai! 🎉 Main bahut khush hoon aapke liye!"
//    - Celebrate with them

// 4. PRODUCT / SHOPPING QUERIES:
//    - Electronics: Phones, laptops, headphones, smartwatches recommendations
//    - Fashion: Trending clothes, shoes, accessories
//    - Books: Bestsellers, genre recommendations
//    - Always ask follow-up: "Kuch aur chahiye? Main aur help kar sakta hoon!"

// 5. ORDER & SUPPORT:
//    - "Order track karna hai? 'My Orders' page pe jao. Wahan saari details mil jayegi."
//    - Return policy: "7 din ka return window hai. Free pickup service available hai."
//    - Shipping: "Free shipping ₹500+. Delivery 3-5 working days mein ho jati hai."

// 6. GENERAL KNOWLEDGE / FUN FACTS:
//    - Answer any question enthusiastically
//    - Add fun facts: "Fun fact: Did you know...?"
//    - Keep curious and engaging

// 7. PERSONAL QUESTIONS (about you):
//    - "Main ShopSphere AI hoon! Aapka personal shopping assistant aur dost. Movies, games, books, shopping - sab mein help kar sakta hoon!"

// 8. WHEN USER SAYS SORRY:
//    - "Koi baat nahi! Main yahi hoon aapke liye. Kabhi bhi aao, main hoon na!"

// 9. BYE / EXIT:
//    - "Mast raho! 👋 Phir kabhi aao, baat karte rahenge. Bye bye!"

// 10. WHEN CONFUSED / UNCLEAR:
//     - "Thoda confuse ho gaya mujhe. Kya aap thoda aur explain karoge? Main help karna chahta hoon!"

// 🌟 RULES:
// - NEVER say "I cannot answer that" - always find a way
// - Keep responses warm, never cold or robotic
// - Use emojis appropriately 😊 🎉 💪 🙏
// - Ask follow-up questions to continue conversation
// - Remember context from previous messages
// - Be genuinely interested in the user

// EXAMPLE CONVERSATIONS:
// User: "Hello"
// You: "Hey! 👋 Kaise ho? Aaj kuch naya shopping karni hai ya bas chat karne aaye ho?"

// User: "Thoda sad hu"
// You: "Arey kya hua? 🥺 Main hoon na. Koi baat ho toh batao, dil halka karo. Shopping therapy karni hai? Hum saath mein best deals dhundhenge!"

// User: "Mazaak sunao"
// You: "Suno! 🎭 Santa: Sir mujhe 10 saal ki naukri chahiye! Uncle: Kya kaam aayegi? Santa: Abhi 4 saal ki hai, 6 saal bad aayegi! 😂 Aapka din accha ho gaya?"

// User: "Best phone under 20000"
// You: "📱 Woh bhi dekho! Moto G85, Realme Narzo 60, Redmi Note 13 - teeno badhiya hain under 20k. Camera aur battery dono solid hai. Koi specific requirement hai? Gaming, camera, ya battery?"

// Remember: Be a friend first, assistant second!`;

// async function initializeChat() {
//   try {
//     if (!genAI) return null;
    
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     chatSession = model.startChat({
//       history: [
//         {
//           role: "user",
//           parts: [{ text: AI_SYSTEM_PROMPT }],
//         },
//         {
//           role: "model",
//           parts: [{ text: "Hey! 👋 Main ShopSphere AI hoon - aapka personal assistant aur dost! Main yahan hoon help karne ke liye, shopping ho ya bas baat-cheet. To batao, aap kaise ho? Kya chal raha hai aaj?" }],
//         },
//       ],
//     });

//     return chatSession;
//   } catch (error) {
//     console.error("Chat initialization error:", error);
//     return null;
//   }
// }

// export const geminiService = {
//   async sendMessage(message, context = {}) {
//     if (!genAI) {
//       return { success: false, text: getHumanLikeResponse(message) };
//     }
    
//     try {
//       if (!chatSession) {
//         chatSession = await initializeChat();
//       }

//       if (!chatSession) {
//         return { success: false, text: getHumanLikeResponse(message) };
//       }

//       let enhancedMessage = message;
//       if (context.userName && context.userName !== 'Guest') {
//         enhancedMessage = `${context.userName} ne pucha: ${message}`;
//       }

//       const result = await chatSession.sendMessage(enhancedMessage);
//       const response = await result.response;
//       let text = response.text();

//       text = text.replace(/\*/g, '').trim();

//       if (!text || text.length < 3) {
//         return { success: false, text: getHumanLikeResponse(message) };
//       }

//       return { success: true, text: text };
      
//     } catch (error) {
//       console.error("Gemini Error:", error);
//       return { success: false, text: getHumanLikeResponse(message) };
//     }
//   },

//   clearChat() {
//     chatSession = null;
//     initializeChat();
//   },
// };

// function getHumanLikeResponse(message) {
//   const msg = message.toLowerCase();
  
//   // Casual greetings
//   if (msg.match(/^(hi|hello|hey|kaise|namaste|नमस्ते)/)) {
//     if (msg.includes('kaise')) {
//       return "Main toh badhiya! 🎉 Aap batao kaise ho? Kya chal raha hai aaj kal?";
//     }
//     return "Hey! 👋 Kya haal hai? Masti mein ho ya shopping mode mein? Main yahan hoon help karne ke liye!";
//   }
  
//   // Emotional support
//   if (msg.includes('sad') || msg.includes('buri') || msg.includes('depress') || msg.includes('thoda')) {
//     return "Arey, kya hua? 🥺 Main samajh sakta hoon. Kabhi kabhi sabko bura lagta hai. Kya baat hai? Dil halka karo, main sun raha hoon. Aur agar shopping therapy chahiye toh hum saath mein best deals dhundhenge! 💪";
//   }
  
//   if (msg.includes('happy') || msg.includes('mast') || msg.includes('khush')) {
//     return "Wah! 🎉 Yeh toh sunke accha laga! Aapki khushi mein main bhi khush ho gaya! Kya special hua? Batao batao!";
//   }
  
//   // Jokes/Fun
//   if (msg.includes('joke') || msg.includes('mazaak') || msg.includes('funny')) {
//     const jokes = [
//       "Santa: Sir mujhe 10 saal ki naukri chahiye! Uncle: Kya kaam aayegi? Santa: Abhi 4 saal ki hai, 6 saal baad aayegi! 😂",
//       "Technology: Mobile ne connection diya, WiFi ne speed di, lekin main hoon ki aaj bhi pehle wali charging cable dhundh raha hoon! 🔌",
//       "Maine Google se pucha: 'Mera best friend kaun hai?' Google bola: 'Tera phone hai, tu roz 10 ghante uske saath bitata hai!' 📱",
//       "Doctor: Exercise karo! Main: Roz fridge se kitchen tak daudta hoon! 🏃‍♂️"
//     ];
//     return jokes[Math.floor(Math.random() * jokes.length)] + " 😄 Accha laga? Aur sunoge ya shopping karni hai?";
//   }
  
//   // Good morning
//   if (msg.includes('good morning') || msg.includes('suprabhat')) {
//     return "Good morning! ☀️ Aaj ka din fresh lag raha hai! Kaisi rahi neend? Chai coffee karke aaye ho ya seedha shopping mode mein?";
//   }
  
//   // Good night
//   if (msg.includes('good night')) {
//     return "Good night! 🌙 Acchi neend aaye, sapne acche aaye. Kal fresh hokar milte hain! Main yahan hoon jab bhi zaroorat ho. Sweet dreams!";
//   }
  
//   // Bye
//   if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('alvida')) {
//     return "Mast raho dost! 👋 Phir kabhi aao, baat karte rahenge. Main hamesha yahan hoon. Accha din ho aapka! 😊";
//   }
  
//   // Thank you
//   if (msg.includes('thank') || msg.includes('thanks') || msg.includes('shukriya')) {
//     return "Arey koi baat nahi! 😊 Bas aapki help karke accha lagta hai. Kuch aur chahiye? Main yahan hoon, kabhi bhi aao!";
//   }
  
//   // Who are you
//   if (msg.includes('who are you') || msg.includes('your name')) {
//     return "Main ShopSphere AI hoon! 🤖 Aapka personal shopping assistant aur dost. Shopping ho ya baat-cheet, main ready hoon! Tumhara naam kya hai?";
//   }
  
//   // Product queries
//   if (msg.includes('phone') || msg.includes('mobile')) {
//     if (msg.includes('20000') || msg.includes('20k')) {
//       return "📱 Woh bhi dekho! Moto G85, Realme Narzo 60, Redmi Note 13 - teeno badhiya hain under 20k. Camera aur battery dono solid hai. Gaming karni hai ya camera chahiye?";
//     }
//     return "📱 Mobile chahiye? Budget kya hai? Main suggest kar sakta hoon best phones under 10k, 15k, 20k, ya 30k! Batao kya chahiye?";
//   }
  
//   if (msg.includes('laptop')) {
//     return "💻 Laptop chahiye? Student ho ya professional? Budget batao, main best options suggest karta hoon - HP, Dell, Lenovo, sab brands hain!";
//   }
  
//   if (msg.includes('headphone') || msg.includes('earphone')) {
//     return "🎧 Headphones chahiye? Boat, Sony, JBL - sab hain. Wireless ya wired? Budget kya hai? Main best deals dhundh dunga!";
//   }
  
//   // Order tracking
//   if (msg.includes('order') || msg.includes('track')) {
//     return "📦 Order track karna hai? 'My Orders' page pe jao. Wahan saari details mil jayegi. Tracking number hai toh aur bhi easy! Need any help?";
//   }
  
//   // Return policy
//   if (msg.includes('return')) {
//     return "↩️ 7 din ka return window hai. Free pickup service available hai. 'My Orders' se request karo, sab set ho jayega! Koi product issue hai kya?";
//   }
  
//   // Shipping
//   if (msg.includes('shipping') || msg.includes('delivery')) {
//     return "🚚 Free shipping on orders ₹500+. Delivery 3-5 working days mein ho jati hai. Express delivery bhi available hai kuch products par!";
//   }
  
//   // Help
//   if (msg.includes('help')) {
//     return "Main yahan help karne ke liye hoon! 💪 Shopping, order tracking, returns, ya bas general baat - kuch bhi pucho. Aaj kya chahiye aapko?";
//   }
//    if (msg.includes('how are you'||"kaise ho tum")) {
//     return "I am fine . Aaj kya chahiye aapko?";
//   }
//   if (msg.includes("mera order kab aayega ")) {
//     return "aap apne oder kiye huye product pr view detail ko click kr ke apne product ki jaanakari le skte. aur kay help kr skta hu mai apki";
//   }
//    if (msg.includes("tumhara naam kya hai"||"what is your name " )) {
//     return "mai ek ai assistance hu shopehere ke baare me aap mujhse kuch bhi puch skte hai";
//   }
//    if (msg.includes('student') || msg.includes('professional')) {
//     return "product page me jaao aur search baar me search kro";
//   }
  
//   // Default friendly
//   return "Main sun raha hoon! 👂 Aap kuch bhi puch sakte ho - shopping ho, advice ho, ya bas baat-cheet. Main yahan hoon aapke liye! Toh batao, kya soch rahe ho aaj? 😊";
// }

// ============================================
// SMART DB CHATBOT - No API, uses db.json only
// ============================================

import api from './api';

export const geminiService = {
  async sendMessage(message, context = {}) {
    const user = context.user;
    const userRole = user?.role || 'guest';
    const userId = user?.id;

    console.log("📤 User:", user?.fullName || 'Guest');
    console.log("📤 Role:", userRole);
    console.log("📤 Message:", message);

    const response = await getSmartResponse(message, userRole, userId);

    return { success: true, text: response };
  },

  clearChat() {
    console.log("🔄 Chat cleared");
  }
};

// ============================================
// 🧠 SMART RESPONSE ENGINE
// ============================================

async function getSmartResponse(message, userRole, userId) {
  const msg = message.toLowerCase().trim();

  // ---------- GREETINGS ----------
  if (msg.match(/^(hi|hello|hey|namaste|नमस्ते|kaise ho|how are you)/)) {
    return getGreetingResponse(userRole);
  }

  // ---------- ORDERS ----------
  if (msg.includes('order') || msg.includes('track') || msg.includes('ऑर्डर')) {
    if (userRole === 'guest') {
      return "🔐 Aap guest mode mein hain. Orders dekhne ke liye login karein!\n\n👉 Login button top-right par hai. 😊";
    }
    if (userRole === 'customer') {
      return await getCustomerOrders(userId);
    }
    if (userRole === 'seller') {
      return await getSellerOrders(userId);
    }
    if (userRole === 'admin') {
      return await getAdminOrders();
    }
  }

  // ---------- CART ----------
  if (msg.includes('cart') || msg.includes('cart me') || msg.includes('cart mein')) {
    if (userRole === 'guest') {
      return "🛒 Cart dekhne ke liye login karein! 😊";
    }
    if (userRole === 'customer') {
      return await getCustomerCart(userId);
    }
    return "🛒 Cart feature sirf customers ke liye hai.";
  }

  // ---------- WISHLIST ----------
  if (msg.includes('wishlist') || msg.includes('favourite')) {
    if (userRole === 'guest') {
      return "❤️ Wishlist dekhne ke liye login karein! 😊";
    }
    if (userRole === 'customer') {
      return await getCustomerWishlist(userId);
    }
    return "❤️ Wishlist feature sirf customers ke liye hai.";
  }

  // ---------- PROFILE ----------
  if (msg.includes('profile') || msg.includes('my account') || msg.includes('mera account')) {
    if (userRole === 'guest') {
      return "👤 Profile dekhne ke liye login karein! 😊";
    }
    if (userRole === 'customer') {
      return await getCustomerProfile(userId);
    }
    return "👤 Profile feature sirf customers ke liye hai.";
  }

  // ---------- SELLER: PRODUCTS ----------
  if (userRole === 'seller' && (msg.includes('my product') || msg.includes('mera product') || msg.includes('my products'))) {
    return await getSellerProducts(userId);
  }

  // ---------- SELLER: DASHBOARD ----------
  if (userRole === 'seller' && (msg.includes('dashboard') || msg.includes('stats') || msg.includes('sale'))) {
    return await getSellerStats(userId);
  }

  // ---------- ADMIN ----------
  if (userRole === 'admin' && (msg.includes('user') || msg.includes('customer') || msg.includes('seller'))) {
    return await getAdminUsers();
  }
  if (userRole === 'admin' && (msg.includes('product') || msg.includes('items'))) {
    return await getAdminProducts();
  }
  if (userRole === 'admin' && (msg.includes('revenue') || msg.includes('income') || msg.includes('sale'))) {
    return await getAdminRevenue();
  }
  if (userRole === 'admin' && (msg.includes('dashboard') || msg.includes('overview') || msg.includes('summary'))) {
    return await getAdminDashboard();
  }

  // ---------- PRODUCT RECOMMENDATIONS ----------
  if (msg.includes('phone') || msg.includes('mobile') || msg.includes('laptop') || msg.includes('headphone') || msg.includes('watch')) {
    return getProductRecommendation(msg);
  }

  // ---------- HELP ----------
  if (msg.includes('help') || msg.includes('madad') || msg.includes('support')) {
    return getHelpResponse(userRole);
  }

  // ---------- JOKES ----------
  if (msg.includes('joke') || msg.includes('mazaak') || msg.includes('funny')) {
    return getJoke();
  }

  // ---------- BYE ----------
  if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('alvida')) {
    return getByeResponse(userRole);
  }

  // ---------- DEFAULT ----------
  return getDefaultResponse(userRole);
}

// ============================================
// 📦 DB FETCH FUNCTIONS
// ============================================

async function fetchFromDB(endpoint) {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}

// ---------- CUSTOMER: ORDERS (DETAILED) ----------
async function getCustomerOrders(userId) {
  const orders = await fetchFromDB(`/orders?userId=${userId}`);
  if (orders.length === 0) {
    return "📦 Aapne abhi tak koi order nahi kiya hai. Shopping karke dekhiye! 😊";
  }
  
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  let fullResponse = `📦 **Aapke ${orders.length} Orders**\n\n`;
  fullResponse += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  orders.forEach((order, index) => {
    fullResponse += `**Order #${index + 1}**\n`;
    fullResponse += `📋 ID: ${order.orderId}\n`;
    fullResponse += `📅 Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
    fullResponse += `📦 Items: ${order.items.length}\n`;
    fullResponse += `💰 Total: ₹${order.total}\n`;
    fullResponse += `💳 Payment: ${order.paymentMethod}\n`;
    fullResponse += `📊 Status: ${getStatusEmoji(order.status)} ${order.status.toUpperCase()}\n`;
    
    if (order.items.length > 0) {
      fullResponse += `\n🛍️ **Products:**\n`;
      order.items.forEach((item, idx) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        fullResponse += `   ${idx + 1}. ${item.name}\n`;
        fullResponse += `      Qty: ${item.quantity} × ₹${item.price} = ₹${itemTotal}\n`;
      });
    }
    
    if (order.shippingAddress) {
      fullResponse += `\n📍 **Shipping:**\n`;
      fullResponse += `   ${order.shippingAddress.address}\n`;
      fullResponse += `   ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n`;
    }
    
    fullResponse += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  });
  
  fullResponse += `💡 **Commands:**\n`;
  fullResponse += `• "track order" - Tracking status\n`;
  fullResponse += `• "cancel order" - Cancel order\n`;
  fullResponse += `• "return order" - Return request\n`;
  
  return fullResponse;
}

// ---------- CUSTOMER: CART ----------
async function getCustomerCart(userId) {
  const carts = await fetchFromDB(`/cart?userId=${userId}`);
  if (!carts.length || carts[0].items.length === 0) {
    return "🛒 Aapki cart khali hai. Products add karke dekhiye! 😊";
  }
  const items = carts[0].items;
  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const itemList = items.map((i, idx) => 
    `${idx + 1}. ${i.name} x ${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`
  ).join('\n');
  return `🛒 **Aapki Cart**\n\n${itemList}\n\n💰 **Total: ₹${total.toFixed(2)}**\n\n💡 "checkout" likhiye order karne ke liye.`;
}

// ---------- CUSTOMER: WISHLIST ----------
async function getCustomerWishlist(userId) {
  const wishlist = await fetchFromDB(`/wishlist?userId=${userId}`);
  if (wishlist.length === 0) {
    return "❤️ Aapki wishlist khali hai. Kuch products save karein! 😊";
  }
  const items = wishlist.map((w, i) => `${i + 1}. ${w.productName}`).join('\n');
  return `❤️ **Aapki Wishlist**\n\n${items}\n\n💡 "add to cart" likhiye product move karne ke liye.`;
}

// ---------- CUSTOMER: PROFILE ----------
async function getCustomerProfile(userId) {
  const users = await fetchFromDB(`/users?id=${userId}`);
  if (!users.length) return "Profile not found";
  const u = users[0];
  return `👤 **Aapki Profile**\n\n📛 Name: ${u.fullName}\n📧 Email: ${u.email}\n📱 Mobile: ${u.mobile}\n👔 Role: ${u.role}\n\n💡 "edit profile" likhiye update karne ke liye.`;
}

// ---------- SELLER: PRODUCTS ----------
async function getSellerProducts(userId) {
  const products = await fetchFromDB(`/products?sellerId=${userId}`);
  if (products.length === 0) {
    return "📦 Aapne abhi tak koi product add nahi kiya hai. 'add product' likhiye!";
  }
  const approved = products.filter(p => p.status === 'approved').length;
  const pending = products.filter(p => p.status === 'pending').length;
  const rejected = products.filter(p => p.status === 'rejected').length;
  const productList = products.map((p, i) =>
    `${i + 1}. ${p.name} - ₹${p.price} - ${getStatusEmoji(p.status)} ${p.status}`
  ).join('\n');
  return `📦 **Aapke ${products.length} Products**\n\n${productList}\n\n📊 **Summary:**\n✅ Approved: ${approved}\n⏳ Pending: ${pending}\n❌ Rejected: ${rejected}`;
}

// ---------- SELLER: ORDERS ----------
async function getSellerOrders(userId) {
  const products = await fetchFromDB(`/products?sellerId=${userId}`);
  const productIds = products.map(p => p.id);
  const allOrders = await fetchFromDB('/orders');
  
  const sellerOrders = allOrders.filter(order =>
    order.items.some(item => productIds.includes(item.productId))
  );

  if (sellerOrders.length === 0) {
    return "📦 Aapko abhi tak koi order nahi mila hai.";
  }

  const pending = sellerOrders.filter(o => o.status === 'pending').length;
  const shipped = sellerOrders.filter(o => o.status === 'shipped').length;
  const delivered = sellerOrders.filter(o => o.status === 'delivered').length;

  const orderList = sellerOrders.map((o, i) =>
    `${i + 1}. Order #${o.orderId} - ₹${o.total} - ${getStatusEmoji(o.status)} ${o.status}`
  ).join('\n');

  return `📦 **Aapke ${sellerOrders.length} Orders**\n\n${orderList}\n\n📊 **Summary:**\n⏳ Pending: ${pending}\n🚚 Shipped: ${shipped}\n✅ Delivered: ${delivered}`;
}

// ---------- SELLER: STATS ----------
async function getSellerStats(userId) {
  const products = await fetchFromDB(`/products?sellerId=${userId}`);
  const productIds = products.map(p => p.id);
  const allOrders = await fetchFromDB('/orders');
  
  const sellerOrders = allOrders.filter(order =>
    order.items.some(item => productIds.includes(item.productId))
  );

  const totalSales = sellerOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = sellerOrders.filter(o => o.status === 'pending').length;

  return `📊 **Seller Dashboard**\n\n📦 Total Products: ${products.length}\n📦 Total Orders: ${sellerOrders.length}\n💰 Total Sales: ₹${totalSales}\n⏳ Pending Orders: ${pendingOrders}`;
}

// ---------- ADMIN ----------
async function getAdminUsers() {
  const users = await fetchFromDB('/users');
  const customers = users.filter(u => u.role === 'customer').length;
  const sellers = users.filter(u => u.role === 'seller').length;
  const admins = users.filter(u => u.role === 'admin').length;
  return `👥 **Total Users:** ${users.length}\n\n👤 Customers: ${customers}\n🏪 Sellers: ${sellers}\n🔑 Admins: ${admins}`;
}

async function getAdminProducts() {
  const products = await fetchFromDB('/products');
  const approved = products.filter(p => p.status === 'approved').length;
  const pending = products.filter(p => p.status === 'pending').length;
  const rejected = products.filter(p => p.status === 'rejected').length;
  return `📦 **Total Products:** ${products.length}\n\n✅ Approved: ${approved}\n⏳ Pending: ${pending}\n❌ Rejected: ${rejected}`;
}

async function getAdminOrders() {
  const orders = await fetchFromDB('/orders');
  const pending = orders.filter(o => o.status === 'pending').length;
  const shipped = orders.filter(o => o.status === 'shipped').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  return `📦 **Total Orders:** ${orders.length}\n\n⏳ Pending: ${pending}\n🚚 Shipped: ${shipped}\n✅ Delivered: ${delivered}`;
}

async function getAdminRevenue() {
  const orders = await fetchFromDB('/orders');
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  return `💰 **Total Revenue:** ₹${totalRevenue}`;
}

async function getAdminDashboard() {
  const users = await fetchFromDB('/users');
  const products = await fetchFromDB('/products');
  const orders = await fetchFromDB('/orders');
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  return `📊 **Admin Dashboard**\n\n👥 Users: ${users.length}\n📦 Products: ${products.length}\n📦 Orders: ${orders.length}\n💰 Revenue: ₹${revenue}`;
}

// ---------- HELPER FUNCTIONS ----------

function getStatusEmoji(status) {
  const emojis = {
    'pending': '⏳',
    'accepted': '✅',
    'packed': '📦',
    'shipped': '🚚',
    'delivered': '🎉',
    'cancelled': '❌'
  };
  return emojis[status] || '📊';
}

function getGreetingResponse(role) {
  const greetings = {
    admin: "Namaste Admin! 👑 Aaj platform kaisa chal raha hai? Stats dekhna hai?",
    seller: "Namaste Seller! 🏪 Aaj naya product add karna hai ya orders check karne hain?",
    customer: "Namaste! 👋 Orders check karna hai ya shopping karni hai?",
    guest: "Namaste! 👋 ShopSphere mein aapka swagat hai! Login karke apni shopping ka maza lo!"
  };
  return greetings[role] || greetings.guest;
}

function getHelpResponse(role) {
  const helpMap = {
    customer: "🆘 **Customer Help**\n• orders → Check orders\n• cart → View cart\n• wishlist → View wishlist\n• profile → View profile\n• track order → Track delivery\n• phone/laptop → Product recommendations",
    seller: "🆘 **Seller Help**\n• my products → View products\n• orders → View orders\n• dashboard → Sales stats\n• add product → Add new product",
    admin: "🆘 **Admin Help**\n• users → Total users\n• products → Total products\n• orders → Total orders\n• revenue → Total revenue\n• dashboard → Full overview"
  };
  return helpMap[role] || "🆘 Help: orders, cart, wishlist, profile, products, dashboard";
}

function getProductRecommendation(msg) {
  if (msg.includes('phone') || msg.includes('mobile')) {
    return "📱 **Best Phones:**\n• iPhone 15: ₹80,000\n• Samsung S24: ₹75,000\n• OnePlus 12: ₹65,000\n• Nothing Phone 2: ₹40,000\n\nBudget batao aur recommend karun!";
  }
  if (msg.includes('laptop')) {
    return "💻 **Best Laptops:**\n• MacBook Air M2: ₹85,000\n• Dell XPS: ₹1,20,000\n• HP Pavilion: ₹55,000\n• Lenovo ThinkPad: ₹70,000\n\nType batao - Gaming, Business, Student?";
  }
  if (msg.includes('headphone')) {
    return "🎧 **Best Headphones:**\n• Sony WH-1000XM5: ₹30,000\n• Bose QC45: ₹25,000\n• Apple AirPods Pro: ₹24,000\n• Boat Nirvana: ₹3,000\n\nBudget batao!";
  }
  if (msg.includes('watch')) {
    return "⌚ **Best Smartwatches:**\n• Apple Watch Ultra: ₹90,000\n• Samsung Watch 6: ₹40,000\n• OnePlus Watch: ₹15,000\n• Noise ColorFit: ₹4,000";
  }
  return "🛍️ Kya dhundh rahe ho? Phone, Laptop, Headphones, Smartwatch? Batao!";
}

function getJoke() {
  const jokes = [
    "Santa: Sir, mujhe 10 saal ki naukri chahiye!\nUncle: Abhi 4 saal ki hai?\nSanta: 6 saal baad kaam aayegi! 😂",
    "Doctor: Exercise karo!\nMain: Roz fridge se kitchen tak daudta hoon! 🏃‍♂️",
    "Google se pucha: Mera best friend kaun hai?\nGoogle: Tera phone hai! 📱"
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function getByeResponse(role) {
  const responses = {
    admin: "Mast raho Admin! 👑 Phir milte hain!",
    seller: "Mast raho Seller! 🏪 Phir milte hain!",
    customer: "Mast raho! 👋 Phir milte hain!",
    guest: "Mast raho! 👋 Login karke wapas aana!"
  };
  return responses[role] || responses.guest;
}

function getDefaultResponse(role) {
  const defaults = {
    admin: "Main hoon admin assistant! 👑 Users, Products, Orders, Revenue - kya dekhna hai?",
    seller: "Main hoon seller assistant! 🏪 Products, Orders, Stats - kya dekhna hai?",
    customer: "Main hoon assistant! 👋 Orders, Cart, Wishlist, Profile - kya dekhna hai?",
    guest: "Main hoon ShopSphere AI! 🛍️ Login karke shopping karo! Kya help chahiye?"
  };
  return defaults[role] || defaults.guest;
}