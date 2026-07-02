import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; 
import { Send, X, Bot, Loader2, ShieldCheck, Terminal } from "lucide-react";

const AdminChatAgent = () => {
  const userLogin = useSelector((state) => state.userLogin || {});
  const { userInfo } = userLogin;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello Admin. Veloura Systems online. Awaiting executive catalog overrides..." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 🎯 FIX: Element smooth view behavior check for reliable scrolling
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // 🔒 Authorization Token nikalein
      const token = userInfo?.token || (localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : null);

      // 📝 Configuration headers setup karein
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }
      };

      // 🌐 Sahi target endpoint Node.js port 5000 par
      const { data } = await axios.post(
        "http://localhost:5000/api/chat", 
        {
          message: currentInput,
          user_id: userInfo?._id || "admin_main"
        },
        config 
      );

      const botResponse = data.response;
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);

      const lowerResponse = botResponse.toLowerCase();
      if (
        lowerResponse.includes("updated") || 
        lowerResponse.includes("successfully") || 
        lowerResponse.includes("purged") || 
        lowerResponse.includes("wiped") || 
        lowerResponse.includes("✅")
      ) {
        console.log("Admin action captured. Re-syncing registry view...");
        setTimeout(() => {
          window.location.reload(); 
        }, 1800);
      }

    } catch (error) {
      console.error("Admin Chat Gateway Error:", error.response ? error.response.data : error.message);
      setMessages((prev) => [
        ...prev, 
        { role: "bot", text: "⚠️ System Alert: Unable to reach database terminal gateway." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-sans antialiased">
      
      {/* 🟢 Premium Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 shadow-xl border ${
          isOpen 
          ? "bg-[#1f1f1f] border-[#1f1f1f] text-[#efe7dd] rotate-90" 
          : "bg-[#1f1f1f] hover:bg-[#2a2a2a] border-[#1f1f1f] text-white hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X size={26} />
        ) : (
          <div className="relative">
            <Bot size={30} className="text-[#efe7dd] group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1f1f1f] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-400"></span>
            </span>
          </div>
        )}
      </button>

      {/* 🔵 Executive Luxury Chat Window Dashboard */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[410px] h-[580px] max-h-[82vh] bg-[#faf7f2] border-2 border-[#1f1f1f]/10 rounded-[24px] shadow-[0_20px_50px_rgba(31,31,31,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Dashboard Premium Header */}
          <div className="p-5 bg-[#1f1f1f] flex items-center justify-between border-b border-[#efe7dd]/20">
            <div className="flex items-center gap-3">
              <div className="bg-[#2a2a2a] border border-[#efe7dd]/20 p-2.5 rounded-xl">
                <Terminal size={18} className="text-[#efe7dd]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#faf7f2] font-bold text-[13px] uppercase tracking-wider font-mono">Veloura Agent Vault</h3>
                  <ShieldCheck size={14} className="text-[#efe7dd]" />
                </div>
                <span className="text-[#efe7dd]/80 text-[10px] font-medium tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#efe7dd] animate-pulse"></span>
                  SECURE CONTROL OVERRIDE
                </span>
              </div>
            </div>
            <X size={16} className="text-[#efe7dd]/60 cursor-pointer hover:text-white transition-colors" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages Stream View */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fcfbfa] custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-[18px] text-[13px] leading-relaxed max-w-[88%] whitespace-pre-line shadow-sm border transition-all ${
                  m.role === "user" 
                  ? "bg-[#1f1f1f] text-white rounded-tr-none border-[#1f1f1f] font-medium" 
                  : "bg-[#efe7dd]/50 text-[#1f1f1f] rounded-tl-none border-[#efe7dd] font-mono text-[12px]"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {/* Dynamic Synchronization Loader */}
            {loading && (
              <div className="flex items-center gap-3 bg-[#efe7dd]/30 border border-[#efe7dd] p-3 rounded-xl w-48 animate-pulse">
                <Loader2 size={16} className="text-[#1f1f1f] animate-spin" />
                <span className="text-[10px] text-[#1f1f1f] uppercase font-bold tracking-widest font-mono">Vault Query...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Premium Bottom Input Workspace */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#faf7f2] border-t border-[#efe7dd]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Initialize root catalog override command..."
                className="w-full bg-white border border-[#efe7dd] text-[#1f1f1f] placeholder-neutral-400 text-[13px] rounded-xl py-3.5 pl-4 pr-14 focus:outline-none focus:border-[#1f1f1f] transition-all font-mono shadow-inner"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 p-2.5 bg-[#1f1f1f] hover:bg-[#333333] text-white rounded-lg transition-all disabled:opacity-40 active:scale-95 shadow-md"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminChatAgent;