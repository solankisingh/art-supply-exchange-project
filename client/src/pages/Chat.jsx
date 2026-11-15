import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

export default function Chat() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const targetConvId = searchParams.get('id');

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(targetConvId || null);
  const [activeConv, setActiveConv] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchConversation(selectedId);
    }
  }, [selectedId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (id) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveConv(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedId) return;

    try {
      const res = await fetch(`/api/conversations/${selectedId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: messageText })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setActiveConv(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), newMsg]
        }));
        setMessageText('');
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm flex flex-col md:flex-row h-[75vh] overflow-hidden transition-colors">
      {/* Left conversation sidebar */}
      <div className="w-full md:w-80 border-r border-slate-300 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800/95 transition-colors">
        <div className="p-3.5 border-b border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-between">
          <span>Active Messages ({conversations.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700/70">
          {loading ? (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400">Loading messages...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-xs text-slate-500 dark:text-slate-300 text-center leading-relaxed">
              No messages yet. Click "Send Message / Buy" on any listing to start chatting!
            </div>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-3 text-xs transition-colors cursor-pointer ${
                  selectedId === c.id 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold truncate text-slate-900 dark:text-slate-100">{c.otherUser?.name || 'Artist'}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {c.item && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate font-semibold">
                    Re: {c.item.title}
                  </div>
                )}
                <div className="text-slate-500 dark:text-slate-300 truncate text-[11px] mt-0.5">
                  {c.lastMessage?.text || 'Chat opened'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right chat message area */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-800 transition-colors">
        {activeConv ? (
          <>
            <div className="p-3.5 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200">
              <div>
                <strong className="text-slate-900 dark:text-white">Chat with:</strong> {activeConv.otherUser?.name || 'User'} ({activeConv.otherUser?.email})
              </div>
              {activeConv.item && (
                <div className="text-slate-600 dark:text-slate-300 font-medium">
                  Listing: <strong className="text-slate-900 dark:text-emerald-400">{activeConv.item.title}</strong>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-slate-850">
              {activeConv.messages?.map(m => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-2.5 rounded-xl text-xs shadow-sm ${
                      isMe 
                        ? 'bg-emerald-600 dark:bg-emerald-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-300'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3.5 border-t border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message or negotiate pickup time..."
                className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-300 text-xs p-6 text-center space-y-1 bg-white dark:bg-slate-800/90">
            <span className="font-semibold text-slate-700 dark:text-slate-100 text-sm">No Conversation Selected</span>
            <p className="text-slate-500 dark:text-slate-400">Select an artist from the left pane to view messages or negotiate a trade.</p>
          </div>
        )}
      </div>
    </div>
  );
}
