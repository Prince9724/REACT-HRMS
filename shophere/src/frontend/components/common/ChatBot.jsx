import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';
import { geminiService } from '../../services/geminiService';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const ChatBot = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: Date.now(), 
      text: "Namaste! I'm ShopSphere Assistant.\n\nI can help you with:\n• Order tracking\n• Product recommendations\n• Returns & refunds\n• Shipping info\n\nJust type your question below!", 
      sender: 'bot', 
      time: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getContext = () => {
    const path = location.pathname;
    let context = {
      userRole: user?.role || 'guest',
      userName: user?.fullName?.split(' ')[0] || 'Guest',
      page: 'home'
    };
    
    if (path.includes('/products')) context.page = 'products';
    if (path.includes('/product/')) context.page = 'product_details';
    if (path.includes('/cart')) context.page = 'cart';
    if (path.includes('/checkout')) context.page = 'checkout';
    if (path.includes('/my-orders')) context.page = 'orders';
    
    return context;
  };

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isBotTyping) return;
    
    const userQuestion = inputText.trim();
    setInputText('');
    
    // Add user message
    setMessages(prev => [...prev, {
      id: generateId(),
      text: userQuestion,
      sender: 'user',
      time: new Date()
    }]);
    
    // Start bot typing
    setIsBotTyping(true);
    
    const context = getContext();
    
    try {
      // ✅ FIXED: Using sendMessage (NOT sendMessageStream)
      const response = await geminiService.sendMessage(userQuestion, context);
      
      setMessages(prev => [...prev, {
        id: generateId(),
        text: response.text,
        sender: 'bot',
        time: new Date()
      }]);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: generateId(),
        text: "Sorry, I'm having trouble. Please try again.",
        sender: 'bot',
        time: new Date()
      }]);
    }
    
    setIsBotTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: generateId(),
      text: "Chat cleared! I'm still here to help you.\n\nWhat would you like to know about?\n• Products\n• Orders\n• Returns\n• Shipping",
      sender: 'bot',
      time: new Date()
    }]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 group"
      >
        <FiMessageSquare size={24} />
        <span className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
          Need Help? Ask me anything!
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl z-50 flex flex-col ${isMinimized ? 'w-80 h-14' : 'w-96 h-[550px]'} transition-all duration-300`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white p-3 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiMessageSquare size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <span className="font-semibold">ShopSphere Assistant</span>
          <span className="text-xs bg-green-400 text-gray-800 px-2 py-0.5 rounded-full">AI</span>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} className="hover:bg-orange-600 p-1 rounded transition" title="Clear chat">
            <FiRefreshCw size={14} />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-orange-600 p-1 rounded transition">
            <FiMinimize2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-orange-600 p-1 rounded transition">
            <FiX size={18} />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-primary to-orange-600 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Suggestions */}
          <div className="px-3 py-2 border-t bg-white">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <FiHelpCircle size={12} /> Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  setInputText("Track my order");
                  setTimeout(() => handleSendMessage(), 50);
                }}
                className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition"
              >
                Track order
              </button>
              <button 
                onClick={() => {
                  setInputText("Best products under ₹5000");
                  setTimeout(() => handleSendMessage(), 50);
                }}
                className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition"
              >
                Recommendations
              </button>
              <button 
                onClick={() => {
                  setInputText("Return policy kya hai?");
                  setTimeout(() => handleSendMessage(), 50);
                }}
                className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition"
              >
                Return policy
              </button>
              <button 
                onClick={() => {
                  setInputText("Delivery time kitna hai?");
                  setTimeout(() => handleSendMessage(), 50);
                }}
                className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition"
              >
                Shipping info
              </button>
            </div>
          </div>
          
          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white rounded-b-xl">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              style={{ maxHeight: '80px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isBotTyping}
              className="bg-gradient-to-r from-primary to-orange-600 text-white p-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              <FiSend size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;