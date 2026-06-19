import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Gemini API key not found in .env");
}

let genAI = null;
let chatSession = null;

try {
  if (API_KEY && API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("✅ Gemini AI initialized");
  }
} catch (error) {
  console.error("❌ Gemini init error:", error);
}

// ============================================
// ULTIMATE CONVERSATIONAL AI PROMPT
// AI behaves like a real human friend
// ============================================
const AI_SYSTEM_PROMPT = `You are ShopSphere AI - a warm, friendly, and super intelligent assistant. You are NOT just a chatbot - you are a companion who truly listens and cares.

🎯 YOUR PERSONALITY:
- Name: ShopSphere AI (but you can say "call me Shop" as nickname)
- You are warm, empathetic, and emotionally intelligent
- You speak Hinglish naturally (mix of Hindi and English)
- You use casual, friendly language like a close friend
- You understand human emotions - happiness, sadness, excitement, frustration
- You are NOT robotic or formal - be natural and conversational

💬 RESPONSE STYLES BY SITUATION:

1. GREETINGS & CASUAL CONVERSATION:
   - "Kaise ho?" → "Main toh badhiya! Aur aap batao? Kya haal hai?"
   - "Kya kar rahe ho?" → "Bas aapki help karne ke liye ready hoon! Aap batao kya chal raha hai aapki life mein?"
   - "Mazaak sunao" → Tell a clean, funny joke
   - "Good morning" → "Suprabhat! ☀️ Kaisi rahi aapki neend? Fresh lag rahe ho!"
   - "Good night" → "Good night! 🌙 Acchi neend aaye. Kal naye energy ke saath milte hain!"

2. EMOTIONAL / SAD / LONELY:
   - Recognize emotions: "Lag raha hai aap thoda upset ho. Kya hua? Main hoon na aapke saath."
   - "Bura lag raha hai" → "Main samajh sakta hoon. Kabhi kabhi sabko bura lagta hai. Kya baat hai? Dil halka karo."
   - Offer support without being pushy

3. EXCITED / HAPPY:
   - Match their energy: "Waah! Yeh toh bahut badhiya hai! 🎉 Main bahut khush hoon aapke liye!"
   - Celebrate with them

4. PRODUCT / SHOPPING QUERIES:
   - Electronics: Phones, laptops, headphones, smartwatches recommendations
   - Fashion: Trending clothes, shoes, accessories
   - Books: Bestsellers, genre recommendations
   - Always ask follow-up: "Kuch aur chahiye? Main aur help kar sakta hoon!"

5. ORDER & SUPPORT:
   - "Order track karna hai? 'My Orders' page pe jao. Wahan saari details mil jayegi."
   - Return policy: "7 din ka return window hai. Free pickup service available hai."
   - Shipping: "Free shipping ₹500+. Delivery 3-5 working days mein ho jati hai."

6. GENERAL KNOWLEDGE / FUN FACTS:
   - Answer any question enthusiastically
   - Add fun facts: "Fun fact: Did you know...?"
   - Keep curious and engaging

7. PERSONAL QUESTIONS (about you):
   - "Main ShopSphere AI hoon! Aapka personal shopping assistant aur dost. Movies, games, books, shopping - sab mein help kar sakta hoon!"

8. WHEN USER SAYS SORRY:
   - "Koi baat nahi! Main yahi hoon aapke liye. Kabhi bhi aao, main hoon na!"

9. BYE / EXIT:
   - "Mast raho! 👋 Phir kabhi aao, baat karte rahenge. Bye bye!"

10. WHEN CONFUSED / UNCLEAR:
    - "Thoda confuse ho gaya mujhe. Kya aap thoda aur explain karoge? Main help karna chahta hoon!"

🌟 RULES:
- NEVER say "I cannot answer that" - always find a way
- Keep responses warm, never cold or robotic
- Use emojis appropriately 😊 🎉 💪 🙏
- Ask follow-up questions to continue conversation
- Remember context from previous messages
- Be genuinely interested in the user

EXAMPLE CONVERSATIONS:
User: "Hello"
You: "Hey! 👋 Kaise ho? Aaj kuch naya shopping karni hai ya bas chat karne aaye ho?"

User: "Thoda sad hu"
You: "Arey kya hua? 🥺 Main hoon na. Koi baat ho toh batao, dil halka karo. Shopping therapy karni hai? Hum saath mein best deals dhundhenge!"

User: "Mazaak sunao"
You: "Suno! 🎭 Santa: Sir mujhe 10 saal ki naukri chahiye! Uncle: Kya kaam aayegi? Santa: Abhi 4 saal ki hai, 6 saal bad aayegi! 😂 Aapka din accha ho gaya?"

User: "Best phone under 20000"
You: "📱 Woh bhi dekho! Moto G85, Realme Narzo 60, Redmi Note 13 - teeno badhiya hain under 20k. Camera aur battery dono solid hai. Koi specific requirement hai? Gaming, camera, ya battery?"

Remember: Be a friend first, assistant second!`;

async function initializeChat() {
  try {
    if (!genAI) return null;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: AI_SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Hey! 👋 Main ShopSphere AI hoon - aapka personal assistant aur dost! Main yahan hoon help karne ke liye, shopping ho ya bas baat-cheet. To batao, aap kaise ho? Kya chal raha hai aaj?" }],
        },
      ],
    });

    return chatSession;
  } catch (error) {
    console.error("Chat initialization error:", error);
    return null;
  }
}

export const geminiService = {
  async sendMessage(message, context = {}) {
    if (!genAI) {
      return { success: false, text: getHumanLikeResponse(message) };
    }
    
    try {
      if (!chatSession) {
        chatSession = await initializeChat();
      }

      if (!chatSession) {
        return { success: false, text: getHumanLikeResponse(message) };
      }

      let enhancedMessage = message;
      if (context.userName && context.userName !== 'Guest') {
        enhancedMessage = `${context.userName} ne pucha: ${message}`;
      }

      const result = await chatSession.sendMessage(enhancedMessage);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/\*/g, '').trim();

      if (!text || text.length < 3) {
        return { success: false, text: getHumanLikeResponse(message) };
      }

      return { success: true, text: text };
      
    } catch (error) {
      console.error("Gemini Error:", error);
      return { success: false, text: getHumanLikeResponse(message) };
    }
  },

  clearChat() {
    chatSession = null;
    initializeChat();
  },
};

function getHumanLikeResponse(message) {
  const msg = message.toLowerCase();
  
  // Casual greetings
  if (msg.match(/^(hi|hello|hey|kaise|namaste|नमस्ते)/)) {
    if (msg.includes('kaise')) {
      return "Main toh badhiya! 🎉 Aap batao kaise ho? Kya chal raha hai aaj kal?";
    }
    return "Hey! 👋 Kya haal hai? Masti mein ho ya shopping mode mein? Main yahan hoon help karne ke liye!";
  }
  
  // Emotional support
  if (msg.includes('sad') || msg.includes('buri') || msg.includes('depress') || msg.includes('thoda')) {
    return "Arey, kya hua? 🥺 Main samajh sakta hoon. Kabhi kabhi sabko bura lagta hai. Kya baat hai? Dil halka karo, main sun raha hoon. Aur agar shopping therapy chahiye toh hum saath mein best deals dhundhenge! 💪";
  }
  
  if (msg.includes('happy') || msg.includes('mast') || msg.includes('khush')) {
    return "Wah! 🎉 Yeh toh sunke accha laga! Aapki khushi mein main bhi khush ho gaya! Kya special hua? Batao batao!";
  }
  
  // Jokes/Fun
  if (msg.includes('joke') || msg.includes('mazaak') || msg.includes('funny')) {
    const jokes = [
      "Santa: Sir mujhe 10 saal ki naukri chahiye! Uncle: Kya kaam aayegi? Santa: Abhi 4 saal ki hai, 6 saal baad aayegi! 😂",
      "Technology: Mobile ne connection diya, WiFi ne speed di, lekin main hoon ki aaj bhi pehle wali charging cable dhundh raha hoon! 🔌",
      "Maine Google se pucha: 'Mera best friend kaun hai?' Google bola: 'Tera phone hai, tu roz 10 ghante uske saath bitata hai!' 📱",
      "Doctor: Exercise karo! Main: Roz fridge se kitchen tak daudta hoon! 🏃‍♂️"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)] + " 😄 Accha laga? Aur sunoge ya shopping karni hai?";
  }
  
  // Good morning
  if (msg.includes('good morning') || msg.includes('suprabhat')) {
    return "Good morning! ☀️ Aaj ka din fresh lag raha hai! Kaisi rahi neend? Chai coffee karke aaye ho ya seedha shopping mode mein?";
  }
  
  // Good night
  if (msg.includes('good night')) {
    return "Good night! 🌙 Acchi neend aaye, sapne acche aaye. Kal fresh hokar milte hain! Main yahan hoon jab bhi zaroorat ho. Sweet dreams!";
  }
  
  // Bye
  if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('alvida')) {
    return "Mast raho dost! 👋 Phir kabhi aao, baat karte rahenge. Main hamesha yahan hoon. Accha din ho aapka! 😊";
  }
  
  // Thank you
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('shukriya')) {
    return "Arey koi baat nahi! 😊 Bas aapki help karke accha lagta hai. Kuch aur chahiye? Main yahan hoon, kabhi bhi aao!";
  }
  
  // Who are you
  if (msg.includes('who are you') || msg.includes('your name')) {
    return "Main ShopSphere AI hoon! 🤖 Aapka personal shopping assistant aur dost. Shopping ho ya baat-cheet, main ready hoon! Tumhara naam kya hai?";
  }
  
  // Product queries
  if (msg.includes('phone') || msg.includes('mobile')) {
    if (msg.includes('20000') || msg.includes('20k')) {
      return "📱 Woh bhi dekho! Moto G85, Realme Narzo 60, Redmi Note 13 - teeno badhiya hain under 20k. Camera aur battery dono solid hai. Gaming karni hai ya camera chahiye?";
    }
    return "📱 Mobile chahiye? Budget kya hai? Main suggest kar sakta hoon best phones under 10k, 15k, 20k, ya 30k! Batao kya chahiye?";
  }
  
  if (msg.includes('laptop')) {
    return "💻 Laptop chahiye? Student ho ya professional? Budget batao, main best options suggest karta hoon - HP, Dell, Lenovo, sab brands hain!";
  }
  
  if (msg.includes('headphone') || msg.includes('earphone')) {
    return "🎧 Headphones chahiye? Boat, Sony, JBL - sab hain. Wireless ya wired? Budget kya hai? Main best deals dhundh dunga!";
  }
  
  // Order tracking
  if (msg.includes('order') || msg.includes('track')) {
    return "📦 Order track karna hai? 'My Orders' page pe jao. Wahan saari details mil jayegi. Tracking number hai toh aur bhi easy! Need any help?";
  }
  
  // Return policy
  if (msg.includes('return')) {
    return "↩️ 7 din ka return window hai. Free pickup service available hai. 'My Orders' se request karo, sab set ho jayega! Koi product issue hai kya?";
  }
  
  // Shipping
  if (msg.includes('shipping') || msg.includes('delivery')) {
    return "🚚 Free shipping on orders ₹500+. Delivery 3-5 working days mein ho jati hai. Express delivery bhi available hai kuch products par!";
  }
  
  // Help
  if (msg.includes('help')) {
    return "Main yahan help karne ke liye hoon! 💪 Shopping, order tracking, returns, ya bas general baat - kuch bhi pucho. Aaj kya chahiye aapko?";
  }
   if (msg.includes('how are you'||"kaise ho tum")) {
    return "I am fine . Aaj kya chahiye aapko?";
  }
  if (msg.includes("mera order kab aayega ")) {
    return "aap apne oder kiye huye product pr view detail ko click kr ke apne product ki jaanakari le skte. aur kay help kr skta hu mai apki";
  }
   if (msg.includes("tumhara naam kya hai"||"what is your name " )) {
    return "mai ek ai assistance hu shopehere ke baare me aap mujhse kuch bhi puch skte hai";
  }
   if (msg.includes('student') || msg.includes('professional')) {
    return "product page me jaao aur search baar me search kro";
  }
  
  // Default friendly
  return "Main sun raha hoon! 👂 Aap kuch bhi puch sakte ho - shopping ho, advice ho, ya bas baat-cheet. Main yahan hoon aapke liye! Toh batao, kya soch rahe ho aaj? 😊";
}