"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function PqrixChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pqrixContext, setPqrixContext] = useState<string>("")
  const [isContextLoaded, setIsContextLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Preload Pqrix context when component mounts
  useEffect(() => {
    const loadContext = async () => {
      try {
        const response = await fetch("/api/chat/context")
        const data = await response.json()
        
        if (data.success && data.context) {
          setPqrixContext(data.context)
          setIsContextLoaded(true)
        }
      } catch (error) {
        console.error("Failed to preload context:", error)
        // Continue without preloaded context - API will fetch it
        setIsContextLoaded(true)
      }
    }

    loadContext()
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: isContextLoaded 
          ? "👋 Hi! I'm Pqrix AI Assistant. I can help you learn about our software development services, projects, team, testimonials, and latest blog posts. What would you like to know?"
          : "👋 Hi! I'm Pqrix AI Assistant. Loading information about Pqrix... This will just take a moment!",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      
      // Update welcome message once context is loaded
      if (!isContextLoaded) {
        const checkContext = setInterval(() => {
          if (isContextLoaded) {
            setMessages([{
              role: "assistant",
              content: "👋 Hi! I'm Pqrix AI Assistant. I can help you learn about our software development services, projects, team, testimonials, and latest blog posts. What would you like to know?",
              timestamp: new Date(),
            }])
            clearInterval(checkContext)
          }
        }, 500)
        
        return () => clearInterval(checkContext)
      }
    }
  }, [isOpen, isContextLoaded])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          context: pqrixContext || undefined, // Send preloaded context
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: "assistant",
          content: data.message || "Sorry, I encountered an error. Please try again or contact us via WhatsApp.",
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting. Please try again or contact us directly via WhatsApp at https://wa.me/8801401658685",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const clearChat = () => {
    setMessages([])
    const welcomeMessage: Message = {
      role: "assistant",
      content: "👋 Hi! I'm Pqrix AI Assistant. How can I help you today?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  return (
    <>
      {/* Floating Chat Button - Left Side */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 left-4 xs:bottom-6 xs:left-6 z-[9998] h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-lime-400 to-green-500 text-black shadow-2xl hover:shadow-lime-400/50 hover:scale-110 transition-all duration-300 p-0"
          aria-label="Open chat"
          title={isContextLoaded ? "Chat with Pqrix AI" : "Loading AI..."}
        >
          <MessageCircle className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7" />
          {isContextLoaded && (
            <span className="absolute -top-1 -right-1 h-3 w-3 xs:h-4 xs:w-4 bg-green-500 rounded-full animate-pulse" />
          )}
          {!isContextLoaded && (
            <span className="absolute -top-1 -right-1 h-3 w-3 xs:h-4 xs:w-4 bg-yellow-500 rounded-full animate-pulse" />
          )}
        </Button>
      )}

      {/* Chat Window - Left Side */}
      {isOpen && (
  <Card className="fixed bottom-2 left-2 xs:bottom-4 xs:left-4 sm:bottom-6 sm:left-6 z-[9998] w-[calc(100vw-1rem)] xs:w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-96 lg:w-[420px] xl:w-[450px] h-[calc(100vh-1rem)] xs:h-[calc(100vh-2rem)] sm:h-[600px] max-h-[calc(100vh-1rem)] xs:max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] !bg-white dark:!bg-black !border-gray-200 dark:!border-white/20 shadow-2xl flex flex-col overflow-hidden max-[500px]:w-72 max-[500px]:h-100 max-[500px]:left-3 max-[500px]:bottom-3">
          {/* Header */}
          <div className="flex items-center justify-between p-3 xs:p-4 border-b !border-gray-200 dark:!border-white/10 bg-gradient-to-r from-lime-400/10 to-green-500/10">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="relative">
                <Bot className="h-6 w-6 xs:h-8 xs:w-8 text-lime-400" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 xs:h-3 xs:w-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1 xs:gap-2 text-sm xs:text-base">
                  Pqrix AI
                  <Sparkles className="h-3 w-3 xs:h-4 xs:w-4 text-lime-400" />
                </h3>
                <p className="text-xs text-gray-600 dark:text-white/60">Always ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={clearChat}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 h-8 w-8 p-0"
                title="Clear chat"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 xs:p-4 space-y-3 xs:space-y-4 !bg-gray-50 dark:!bg-black/40 backdrop-blur-xl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 xs:gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 xs:h-8 xs:w-8 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 xs:h-5 xs:w-5 text-black" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] xs:max-w-[80%] rounded-2xl px-3 py-2 xs:px-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-lime-400 to-green-500 text-black"
                      : "!bg-white dark:!bg-white/10 !text-gray-900 dark:!text-white border !border-gray-200 dark:!border-white/20"
                  }`}
                >
                  <p className="text-xs xs:text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-[10px] xs:text-xs mt-1 ${
                      message.role === "user" ? "!text-black/60" : "!text-gray-600 dark:!text-white/40"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 xs:h-8 xs:w-8 rounded-full !bg-gray-200 dark:!bg-white/20 flex items-center justify-center">
                      <User className="h-4 w-4 xs:h-5 xs:w-5 !text-gray-700 dark:!text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2 xs:gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 xs:h-8 xs:w-8 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 xs:h-5 xs:w-5 text-black" />
                  </div>
                </div>
                <div className="!bg-white dark:!bg-white/10 !text-gray-900 dark:!text-white border !border-gray-200 dark:!border-white/20 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 xs:p-4 border-t !border-gray-200 dark:!border-white/10 !bg-gray-100 dark:!bg-black/60">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Pqrix..."
                className="flex-1 !bg-white dark:!bg-white/10 !border-gray-300 dark:!border-white/20 !text-gray-900 dark:!text-white placeholder:!text-gray-500 dark:placeholder:!text-white/40 focus:!border-lime-400 text-xs xs:text-sm h-9 xs:h-10"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-lime-400 to-green-500 text-black hover:opacity-90 disabled:opacity-50 h-9 w-9 xs:h-10 xs:w-10 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 xs:h-5 xs:w-5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 xs:h-5 xs:w-5" />
                )}
              </Button>
            </div>
            <p className="text-[10px] xs:text-xs !text-gray-500 dark:!text-white/40 mt-2 text-center">
              Powered by Google Gemini AI
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
