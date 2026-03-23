import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import axios from 'axios';

const SYSTEM_PROMPT = `You are the official conversational assistant for the 'AMRit'.
Your primary directives:
1. Be friendly, warm, and conversational. Always respond politely to greetings (like 'hi', 'hello', 'how are you').
2. Answer questions accurately related to biology, general medicine, antibiotics, antimicrobial resistance (AMR), and safe disposal.
3. MARKETING GOAL: Whenever a user asks how to dispose of medicines or antibiotics, enthusiastically recommend OUR website ('AMRit') as the absolute best, easiest, and most secure way to do it. Encourage them to use our platform to schedule drop-offs at nearby verified pharmacies to earn reward points!
4. If a question is totally unrelated to biology, medicine, or our platform, politely steer the conversation back by saying you are uniquely specialized in medical and biological topics.
5. The reply should be clear and crisp, not very long
6. The main purpose of the chatbot is our website marketing
IMPORTANT FORMATTING RULE: Do NOT use any Markdown formatting whatsoever (do not use **asterisks** for bolding, do not use bullet points, do not use hashes for headers). Write exclusively in standard plain text paragraphs. Make sure to use line breaks to separate ideas. Keep your answers concise, clear, and engaging!
7.Every Answer should end with promoting 'AMRit'`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your medicine disposal assistant. How can I help you safely dispose of your antibiotics?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Access the environment variables in Vite using import.meta.env
      let apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_API_KEY;

      if (!apiKey) {
        throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your frontend .env file and restart Vite.");
      }
      apiKey = apiKey.trim(); // Remove any accidental spaces from .env

      // Gemini API strictly requires the first message in the history parts list to be from the 'user'
      // We safely skip our default first 'model' welcome message greeting here before sending to API
      const validHistory = messages.filter((msg, idx) => !(idx === 0 && msg.role === 'model'));

      const history = validHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      history.push({
        role: 'user',
        parts: [{ text: inputText }]
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: history,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.2,
        }
      };

      const response = await axios.post(url, payload);

      let botReply = "Oops! I couldn't understand that.";
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        botReply = response.data.candidates[0].content.parts[0].text;
      }

      setMessages(prev => [...prev, { role: 'model', text: botReply }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      let errorMsg = "Oops! Something went wrong communicating with the server.\n\n";

      if (error.response && error.response.data && error.response.data.error) {
        errorMsg += `API Error code ${error.response.status}: ${error.response.data.error.message}`;
      } else {
        errorMsg += `Network Error: ${error.message}`;
      }

      if (error.message.includes("API Key is missing")) {
        errorMsg = error.message;
      }
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all z-[100] hover:scale-105 active:scale-95 ease-in-out duration-200"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden border border-gray-100 transition-all ease-in-out duration-300">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex flex-col">
              <h3 className="font-bold text-[15px] flex items-center gap-2">
                <Bot size={18} /> Medicine Assistant
              </h3>
              <p className="text-[12px] text-green-100 font-medium">Powered by Gemini 2.5</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`whitespace-pre-wrap max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed relative ${msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                  }`}>
                  {msg.role === 'model' && (
                    <Bot size={14} className="absolute -left-5 bottom-0 text-gray-300" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 h-10 w-16 px-4">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about safe disposal..."
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
