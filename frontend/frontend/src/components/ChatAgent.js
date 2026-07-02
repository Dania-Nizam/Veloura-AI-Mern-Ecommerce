import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartFromDB } from '../redux/slices/cartSlice';

const ChatAgent = () => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin || {});
    const { userInfo } = userLogin;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi 👋 I can help you find products, track orders, or manage your cart.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // =========================
    // 🚀 SEND MESSAGE
    // =========================
    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);

        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // 🎯 FIX: Headers configuration for Token verification
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : '',
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/chat',
                {
                    message: currentInput,
                    user_id: userInfo?._id || "guest_user"
                },
                config // 👈 Yeh config pass karna zaroori tha!
            );

            const botResponse = data?.response || "No response from server.";

            setMessages(prev => [
                ...prev,
                { role: 'bot', text: botResponse }
            ]);

            // =========================
            // 🛒 FIX: ALWAYS SYNC CART
            // =========================
            if (userInfo?._id) {
                await dispatch(fetchCartFromDB(userInfo._id)).unwrap();
            }

        } catch (error) {
            console.log(error);

            setMessages(prev => [
                ...prev,
                {
                    role: 'bot',
                    text: "⚠️ Server error. Please try again later."
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🎯 FLOAT TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-[25px] right-[25px] w-[64px] h-[64px] rounded-full bg-black text-white flex items-center justify-center shadow-2xl cursor-pointer border border-white/20 transition-transform duration-300 active:scale-95 z-[9999]"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </button>

            {/* 💬 CHAT HUB LAYER */}
            {isOpen && (
                <div className="fixed bottom-[105px] right-[25px] w-[370px] h-[530px] rounded-[2rem] overflow-hidden flex flex-col z-[9998] bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_30px_70px_rgba(0,0,0,0.15)] antialiased">
                    
                    {/* Header bar tracking system */}
                    <div className="bg-white/40 border-b border-white/40 px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">AI Assistant</h4>
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Automated Node</p>
                        </div>
                    </div>

                    {/* MESSAGES LAYER STREAM */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.map((m, i) => (
                            <div 
                                key={i} 
                                className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`px-4 py-3 max-w-[80%] rounded-[1.25rem] text-sm leading-relaxed tracking-wide shadow-sm font-medium
                                    ${m.role === 'bot' 
                                        ? 'bg-white/80 text-slate-900 border border-white/60 rounded-tl-sm' 
                                        : 'bg-black text-white rounded-tr-sm'
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing verification monitor */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2.5 bg-white/40 border border-white/40 rounded-[1.25rem] rounded-tl-sm text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    System processing...
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} />
                    </div>

                    {/* OPERATIONAL USER INPUT SEGMENT */}
                    <div className="p-4 border-t border-white/40 bg-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-2 bg-white/50 border border-white/60 rounded-xl px-3 py-1.5 focus-within:ring-4 focus-within:ring-black/5 focus-within:border-black/20 transition-all">
                            <input
                                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 py-1 font-medium"
                                placeholder="Ask something..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />

                            <button
                                onClick={handleSend}
                                className="w-8 h-8 rounded-lg bg-black hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};

export default ChatAgent;