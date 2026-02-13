'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Mail, Trash2, Eye, EyeOff, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const toggleRead = async (msg: Message) => {
    try {
      await fetch(`/api/contact/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !msg.read }),
      })
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: !m.read } : m))
      if (selected?.id === msg.id) setSelected({ ...msg, read: !msg.read })
      window.dispatchEvent(new Event('notifications-updated'))
      toast.success(msg.read ? 'Marked as unread' : 'Marked as read')
    } catch {
      toast.error('Failed to update')
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selected?.id === id) setSelected(null)
      window.dispatchEvent(new Event('notifications-updated'))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  })

  const unreadCount = messages.filter((m) => !m.read).length

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">Messages</h1>
          <p className="text-sm text-text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No new messages'}
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === f
                  ? 'bg-gradient-to-r from-[#e23636] to-[#ff6b6b] text-white shadow-lg shadow-[#e23636]/30'
                  : 'bg-bg-card border border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading messages...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">No messages found</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Message List */}
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg)
                  if (!msg.read) toggleRead(msg)
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selected?.id === msg.id
                    ? 'bg-accent/10 border-accent/50'
                    : 'bg-bg-card border-border hover:border-accent/30'
                } ${!msg.read ? 'border-l-4 border-l-[#e23636]' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`text-sm truncate ${!msg.read ? 'font-black text-text-primary' : 'font-medium text-text-secondary'}`}>
                    {msg.name}
                  </p>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#e23636] flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-xs font-semibold text-text-primary truncate mb-1">{msg.subject}</p>
                <p className="text-[11px] text-text-muted truncate">{msg.message}</p>
                <p className="text-[10px] text-text-muted mt-2">{formatDate(msg.createdAt)}</p>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-text-primary mb-1">{selected.subject}</h2>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <span className="font-semibold text-text-secondary">{selected.name}</span>
                      <span>•</span>
                      <a href={`mailto:${selected.email}`} className="text-accent hover:underline flex items-center gap-1">
                        <Mail size={12} />
                        {selected.email}
                      </a>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1">{formatDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRead(selected)}
                      className="p-2 rounded-lg bg-bg-secondary border border-border hover:border-accent/50 text-text-muted hover:text-text-primary transition-all cursor-pointer"
                      title={selected.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {selected.read ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => deleteMessage(selected.id)}
                      className="p-2 rounded-lg bg-bg-secondary border border-border hover:border-red-500/50 text-text-muted hover:text-red-500 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 rounded-lg bg-bg-secondary border border-border text-text-muted hover:text-text-primary transition-all cursor-pointer lg:hidden"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="bg-bg-card border border-border rounded-2xl p-12 text-center">
                <Mail size={48} className="mx-auto text-text-muted/30 mb-4" />
                <p className="text-text-muted text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
