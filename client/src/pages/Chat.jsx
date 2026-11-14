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
    <div className="w-full bg-white border border-slate-300 rounded shadow-sm flex flex-col md:flex-row h-[75vh] overflow-hidden">
      {/* Left conversation sidebar */}
      <div className="w-full md:w-72 border-r border-slate-300 flex flex-col bg-slate-50">
        <div className="p-3 border-b border-slate-300 font-bold text-slate-800 text-sm">
          Active Messages ({conversations.length})
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
          {loading ? (
            <div className="p-4 text-xs text-slate-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center">
              No messages yet. Click "Send Message / Buy" on any listing to start chatting!
            </div>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-3 text-xs transition-colors ${
                  selectedId === c.id ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between text-slate-800">
                  <span className="font-bold truncate">{c.otherUser?.name || 'Artist'}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {c.item && (
                  <div className="text-[11px] text-emerald-700 truncate font-medium">
                    Re: {c.item.title}
                  </div>
                )}
                <div className="text-slate-500 truncate text-[11px] mt-0.5">
                  {c.lastMessage?.text || 'Chat opened'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right chat message area */}
      <div className="flex-1 flex flex-col justify-between bg-white">
        {activeConv ? (
          <>
            <div className="p-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong>Chat with:</strong> {activeConv.otherUser?.name || 'User'} ({activeConv.otherUser?.email})
              </div>
              {activeConv.item && (
                <div className="text-slate-600 font-medium">
                  Listing: <strong className="text-slate-900">{activeConv.item.title}</strong>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeConv.messages?.map(m => {
                const isMe = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-2.5 rounded text-xs ${
                      isMe ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-300 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message or negotiate pickup time..."
                className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded text-xs font-semibold"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation from the left to read messages.
          </div>
        )}
      </div>
    </div>
  );
}
