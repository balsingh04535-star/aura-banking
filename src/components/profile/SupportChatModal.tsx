import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { useBanking } from '../../store/BankingContext';
import { triggerHaptic } from '../../hooks/useHaptic';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const FAQ_SUGGESTIONS = [
  'How do I freeze my physical card?',
  'What is my daily SEPA transfer limit?',
  'How do House Deposit vaults work?',
  'How can I order a replacement titanium card?',
];

export const SupportChatModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen } = useBanking();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Good morning Alex. I am your Aura Private Banking Concierge. How can I assist you with your accounts or security today?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getAutomatedReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('freeze') || q.includes('lock')) {
      return 'To freeze your card instantly, navigate to the Cards tab and tap "Freeze Card". A frosted security shield will lock the card from all transactions until you unfreeze it.';
    }
    if (q.includes('limit') || q.includes('spending')) {
      return 'Your current daily spending limit is €3,000 for Aura Black Titanium, with up to €1,000 for ATM withdrawals. You can customize these limits anytime in the Cards tab slider.';
    }
    if (q.includes('vault') || q.includes('deposit') || q.includes('saving')) {
      return 'Your smart savings vaults hold dedicated funds separate from your daily balance. You can allocate or withdraw funds instantly with zero lockup periods and automated interest accumulation.';
    }
    if (q.includes('card') || q.includes('replace') || q.includes('titanium')) {
      return 'Replacement cards can be ordered directly from your card settings. We dispatch new Aura Black Titanium cards via DHL Express with next-day European delivery.';
    }
    return 'Thank you for your message. Your request has been logged with your dedicated Aura private banker. Is there anything else I can clarify regarding your balance or transfers?';
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    triggerHaptic('light');
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getAutomatedReply(text);
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      triggerHaptic('light');
    }, 800);
  };

  return (
    <BottomSheet
      isOpen={isSupportOpen}
      onClose={() => setIsSupportOpen(false)}
      title="Aura Concierge Support"
      subtitle="24/7 Priority Financial Advisory"
      maxHeight="max-h-[85vh]"
    >
      <div className="flex flex-col h-[480px] justify-between pb-2">
        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-aura-blue/20 flex items-center justify-center text-aura-blue shrink-0 mt-0.5">
                  <Sparkles size={14} />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-aura-blue text-white rounded-br-none'
                    : 'liquid-glass border border-white/5 text-[#F7F7F5] dark:text-[#F7F7F5] light:text-[#0F172A] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-[#878A8E]">
              <div className="w-6 h-6 rounded-full bg-aura-blue/20 flex items-center justify-center text-aura-blue">
                <Sparkles size={12} />
              </div>
              <span className="italic">Aura Concierge is typing...</span>
            </div>
          )}
        </div>

        {/* FAQ Quick Chips */}
        <div className="pt-2 pb-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {FAQ_SUGGESTIONS.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSend(faq)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-[#878A8E] hover:text-white border border-white/5 transition-colors"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Aura Concierge anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-[#878A8E] focus:outline-none focus:border-aura-blue"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-full bg-aura-blue text-white hover:bg-aura-blue-hover shadow-glow-blue transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
