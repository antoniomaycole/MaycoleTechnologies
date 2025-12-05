import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Minimize2, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { AtomicLogo } from './AtomicLogo';

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot' as const,
      text: "Hi! 👋 I'm the MaycoleTechnologies™ AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        text: 'Thanks for your message! A MaycoleTechnologies™ specialist will respond shortly. In the meantime, you can start a free 14-day trial of MaycoleTracker™ or MaycoleCheckBook™!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const quickActions = [
    { label: 'Start Free Trial', icon: Zap },
    { label: 'Pricing Info', icon: MessageCircle },
    { label: 'Book Demo', icon: MessageCircle },
    { label: 'Technical Support', icon: MessageCircle },
  ];

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 60 : 500,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="fixed bottom-24 right-28 z-50 w-96 max-w-[calc(100vw-8rem)] shadow-2xl"
          >
            <Card className="overflow-hidden border-2 border-maycole-green/30">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-maycole-green to-maycole-gold p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                      <AtomicLogo size="xs" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">MaycoleTechnologies™</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-white/90">Online - Avg. reply: 2 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
                      aria-label="Minimize chat"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
                      aria-label="Close chat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Body */}
              {!isMinimized && (
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-r from-maycole-green to-maycole-gold text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.type === 'user' ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  {messages.length === 1 && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => setMessage(action.label)}
                            className="text-xs bg-gray-100 hover:bg-maycole-green/10 hover:text-maycole-green border border-gray-200 hover:border-maycole-green rounded-lg px-3 py-2 transition-all duration-200 flex items-center gap-2"
                          >
                            <action.icon className="w-3 h-3" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maycole-green text-sm text-gray-900"
                      />
                      <Button
                        onClick={handleSend}
                        className="maycole-btn-primary px-4 py-2"
                        disabled={!message.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      We typically respond within 2 minutes during business hours
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-28 z-50 w-16 h-16 bg-gradient-to-r from-maycole-green to-maycole-gold rounded-full shadow-2xl flex items-center justify-center group"
          >
            <MessageCircle className="w-7 h-7 text-white" />

            {/* Notification Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
            >
              1
            </motion.div>

            {/* Pulse Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-maycole-green to-maycole-gold rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
