import { useEffect, useRef, useState } from 'react'
import { Send, Bot, Sparkles, Dumbbell, Salad, Heart, Zap, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { coachReply } from '../lib/ai'
import type { ChatMessage } from '../lib/types'
import { Card, Spinner } from '../components/ui'

const SUGGESTIONS = [
  { icon: Dumbbell, text: 'Suggest a workout for today' },
  { icon: Salad, text: 'What should I eat post-workout?' },
  { icon: Heart, text: 'How do I prevent knee injuries?' },
  { icon: Zap, text: 'I need motivation' },
  { icon: Moon, text: 'Tips for better recovery' },
]

export default function AICoach() {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      if (data && data.length) setMessages(data as ChatMessage[])
      else setMessages([{ id: 'welcome', user_id: '', role: 'assistant', content: "Hi! I'm your AI Coach. Ask me about workouts, nutrition, recovery, or motivation!", created_at: new Date().toISOString() }])
    })
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (text: string) => {
    if (!text.trim() || thinking) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), user_id: profile?.id || '', role: 'user', content: text, created_at: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)
    await supabase.from('chat_messages').insert({ role: 'user', content: text })
    await new Promise((r) => setTimeout(r, 800))
    const reply = coachReply(text, profile)
    const botMsg: ChatMessage = { id: crypto.randomUUID(), user_id: '', role: 'assistant', content: reply, created_at: new Date().toISOString() }
    setMessages((m) => [...m, botMsg])
    setThinking(false)
    await supabase.from('chat_messages').insert({ role: 'assistant', content: reply })
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col lg:h-[calc(100vh-4rem)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
          <Bot className="h-6 w-6 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-bg bg-secondary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">AI Coach</h1>
          <p className="text-sm text-white/55">Always here to help • Online</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' ? (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/25 text-sm font-bold text-primary-200">
                  {profile?.full_name?.[0] || 'Y'}
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white/5 text-white/85'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-white/5 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 p-3">
            {SUGGESTIONS.map((s) => (
              <button key={s.text} onClick={() => send(s.text)} className="chip whitespace-nowrap bg-white/5 text-white/70 hover:bg-primary/15 hover:text-primary-200">
                <s.icon className="h-3.5 w-3.5" /> {s.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 border-t border-white/10 p-3">
          <input
            className="input flex-1"
            placeholder="Ask your AI coach anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || thinking} className="btn-primary px-4">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  )
}
