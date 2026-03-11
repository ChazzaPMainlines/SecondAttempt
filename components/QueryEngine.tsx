
import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage, UserTier } from '../types';
import { queryProject } from '../services/geminiService';
import { SendIcon, GeminiIcon } from './icons/ActionIcons';

interface QueryEngineProps {
  project: Project;
  userTier: UserTier;
}

const PRO_KEYWORDS = ['simulate', 'forecast', 'model', 'correlate', 'predict', 'monte carlo', 'compare'];

export const QueryEngine: React.FC<QueryEngineProps> = ({ project, userTier }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: 'ai', text: `Ask me anything about the ${project.name} project. For example: "What are the key risks?"` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDeveloperFree = userTier === 'DEVELOPER_FREE';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    let initialText = `Ask me anything about the ${project.name} project. For example: "What are the key risks?"`
    if (isDeveloperFree) {
        initialText = "The Investor Query Engine is available on the Advisory Tier. Upgrade to run deep-dive queries on your structured data."
    }
    setMessages([
      { id: 'initial', sender: 'ai', text: initialText }
    ]);
  }, [project.id, project.name, userTier]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isDeveloperFree) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setIsLoading(true);

    const isProQuery = userTier === 'INVESTOR_PRO' && PRO_KEYWORDS.some(keyword => query.toLowerCase().includes(keyword));

    let aiResponse: ChatMessage;

    if (isProQuery) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
        aiResponse = {
            id: `ai-pro-${Date.now()}`,
            sender: 'ai',
            text: "This is a Super-Analyst query. With your Pro Seat, you can run complex simulations, forecast cash flows, and correlate risks across multiple projects in your portfolio.\n\nRunning simulation now...",
        };
        // In a real app, we would then execute the pro query. Here we just show the message.
    } else {
        aiResponse = await queryProject(query, project);
    }
    
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <div className={`bg-brand-secondary rounded-lg shadow-lg flex flex-col h-[70vh] max-h-[800px] ${isDeveloperFree ? 'opacity-60' : ''}`}>
      <div className="p-4 border-b border-gray-700 flex items-center">
        <GeminiIcon />
        <h3 className="text-lg font-bold font-display text-white ml-2">Investor Query Engine</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center mr-3 flex-shrink-0"><GeminiIcon /></div>}
            <div className={`p-3 rounded-lg max-w-sm ${msg.sender === 'ai' ? 'bg-brand-primary' : 'bg-brand-accent text-white'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === 'ai' && msg.id !== 'initial' && !msg.id.startsWith('ai-pro') && (
                 <div className="mt-2 text-xs text-brand-text-secondary border-t border-gray-700 pt-1">
                    Sources: <span className="font-mono">{msg.sources?.join(', ')}</span>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center mr-3 flex-shrink-0"><GeminiIcon /></div>
                <div className="p-3 rounded-lg bg-brand-primary">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse delay-400"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isDeveloperFree ? "Upgrade to enable Query Engine" : "e.g., Summarize the offtake agreement..."}
            className="flex-1 bg-brand-primary border border-gray-600 rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent"
            disabled={isLoading || isDeveloperFree}
          />
          <button type="submit" className="bg-brand-accent text-white p-2 rounded-r-md disabled:bg-gray-500 hover:bg-cyan-500 transition-colors" disabled={isLoading || isDeveloperFree}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
