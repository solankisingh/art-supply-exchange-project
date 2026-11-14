import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, User, MapPin, Tag } from 'lucide-react';

export default function Chat() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const targetConvId = searchParams.get('id');

  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(targetConvId || null);
  const [activeConv, setActiveConv] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchConversationDetails(selectedConvId);
    }
  }, [selectedConvId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (!selectedConvId && data.length > 0) {
          setSelectedConvId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (id) => {
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId) return;

    try {
      const res = await fetch(`/api/conversations/${selectedConvId}/messages`, {
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
        fetchConversations(); // refresh snippet list
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden h-[calc(100vh-160px)] flex flex-col md:flex-row">
      {/* Sidebar: Conversation List */}
      <div className="w-full md:w-80 border-r border-stone-200 flex flex-col bg-stone-50/50">
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            Artist Messages
          </h2>
          <p className="text-xs text-stone-500">Negotiate pickups and material trades</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {loading ? (
            <div className="p-4 text-xs text-stone-500 animate-pulse">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400">
              No active message threads yet. Contact a seller to start a conversation!
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                  selectedConvId === conv.id ? 'bg-amber-50/80 border-l-4 border-amber-600' : 'hover:bg-stone-100/70'
                }`}
              >
                <img
                  src={conv.otherUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${conv.otherUser?.name}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-xs text-stone-900 truncate">{conv.otherUser?.name}</span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {conv.item && (
                    <div className="text-[11px] font-semibold text-amber-700 truncate">
                      Re: {conv.item.title}
                    </div>
                  )}
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {conv.lastMessage?.text || 'Conversation initiated'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/40">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.otherUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeConv.otherUser?.name}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{activeConv.otherUser?.name}</h3>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{activeConv.otherUser?.location || 'Local Community Member'}</span>
                  </div>
                </div>
              </div>

              {activeConv.item && (
                <div className="hidden sm:flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 max-w-xs">
                  <img src={activeConv.item.images?.[0] || activeConv.item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Item in inquiry</span>
                    <p className="text-xs font-semibold text-stone-800 truncate">{activeConv.item.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {activeConv.messages?.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                        isMe
                          ? 'bg-amber-600 text-white rounded-br-none'
                          : 'bg-stone-100 text-stone-800 rounded-bl-none border border-stone-200/60'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-amber-200' : 'text-stone-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200 bg-white flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message, offer, or meeting spot..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-3">
            <MessageSquare className="w-12 h-12 text-stone-300" />
            <h4 className="font-bold text-stone-600">Select a conversation</h4>
            <p className="text-xs max-w-xs">
              Choose an artist on the left pane to view messages and negotiate trades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
