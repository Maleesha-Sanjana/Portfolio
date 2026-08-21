import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import '../index.css';

export default function AIBot() {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: "Hi! I am Maleesha's AI assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Mock bot response
        setTimeout(() => {
            setIsTyping(false);
            const newBotMsg = { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: "Thanks for reaching out! Please explore the portfolio, and feel free to use the contact section to get in touch directly!" 
            };
            setMessages(prev => [...prev, newBotMsg]);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="ai-bot-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="ai-chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="ai-chat-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="ai-avatar">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Maleesha's AI</h4>
                                </div>
                            </div>
                            <button className="btn-icon" onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="ai-chat-messages">
                            {messages.map(msg => (
                                <div key={msg.id} className={`ai-message-row ${msg.sender}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="ai-message-avatar"><Bot size={14} /></div>
                                    )}
                                    <div className={`ai-message-bubble ${msg.sender}`}>
                                        {msg.text}
                                    </div>
                                    {msg.sender === 'user' && (
                                        <div className="ai-message-avatar"><User size={14} /></div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="ai-message-row bot">
                                    <div className="ai-message-avatar"><Bot size={14} /></div>
                                    <div className="ai-message-bubble bot typing">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="ai-chat-input-area">
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button 
                                className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                className="ai-fab interactive"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: isOpen ? 20 : 0, opacity: isOpen ? 0 : 1 }}
                style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
            >
                <MessageSquare size={24} />
            </motion.button>
        </div>
    );
}
