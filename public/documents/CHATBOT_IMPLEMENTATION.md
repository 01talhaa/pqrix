# Pqrix AI Chatbot Implementation

## Overview
A fully functional AI chatbot powered by Google Gemini AI that provides personalized responses about Pqrix services, projects, team, testimonials, and blogs.

## Features

### ✅ Completed Features
1. **Google Gemini AI Integration**
   - Model: `gemini-pro`
   - Temperature: 0.7
   - Max tokens: 1000
   - API Key: Stored in `.env.local` as `GEMINI_API_KEY`

2. **Preloaded Context (Performance Optimization)**
   - Context loads when page loads (before user asks anything)
   - All Pqrix data fetched upfront via `/api/chat/context`
   - Eliminates delay on first message
   - Visual indicator shows when AI is ready (green dot = ready, yellow = loading)
   - Fallback to on-demand fetching if preload fails

3. **Context-Aware Responses**
   - Fetches up to 20 services from MongoDB
   - Fetches up to 20 projects from MongoDB
   - Fetches up to 20 team members from MongoDB
   - Fetches up to 10 testimonials from MongoDB
   - Fetches up to 10 blog posts from MongoDB
   - AI only answers questions about Pqrix (restricted by system prompt)

4. **Conversation History**
   - Maintains chat context across messages
   - Supports multi-turn conversations
   - Each message includes timestamp

5. **Responsive Design**
   - Works from 300px to very large screens
   - Mobile-first approach with xs, sm, md, lg, xl breakpoints
   - Full-screen on small devices (< 640px)
   - Fixed size on larger devices (420px-450px width)

6. **UI Features**
   - **Chatbot on LEFT side** (bottom-left corner)
   - **WhatsApp button on RIGHT side** (bottom-right corner)
   - No icon conflicts - properly separated
   - Floating chat button with status indicator
   - Smooth animations and transitions
   - Typing indicator during AI response
   - Auto-scroll to latest message
   - Clear chat functionality
   - Message bubbles with timestamps
   - Avatar icons for user and AI
   - Gradient styling matching Pqrix brand (lime-400 to green-500)

7. **User Experience**
   - Welcome message on first open
   - Context loading indicator
   - Auto-focus on input field
   - Enter key to send message
   - Loading states
   - Error handling with fallback messages
   - WhatsApp fallback link in errors
   - "Powered by Google Gemini AI" footer

## File Structure

```
app/
  api/
    chat/
      route.ts          # Gemini AI API endpoint
      context/
        route.ts        # Preload context endpoint (NEW)
  page.tsx              # Homepage with chatbot integration

components/
  pqrix-chatbot.tsx     # Main chatbot component
  whatsapp-button.tsx   # WhatsApp button (right side)
  ui/
    (shadcn components)
```

## API Endpoints

### GET /api/chat/context (NEW)

Preloads all Pqrix data for chatbot context. Called when chatbot component mounts.

**Response:**
```json
{
  "success": true,
  "context": "SERVICES WE OFFER:\n- Service 1...\n\nOUR PROJECTS:\n...",
  "data": {
    "services": [...],
    "projects": [...],
    "team": [...],
    "testimonials": [...],
    "blogs": [...]
  }
}
```

### POST /api/chat

**Request Body:**
```json
{
  "message": "What services do you offer?",
  "context": "Preloaded context string (optional)",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message..."
    },
    {
      "role": "assistant",
      "content": "Previous response..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "We offer Discovery & Strategy, Web/SaaS Development..."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Sorry, I'm having trouble right now. Please try again or contact us via WhatsApp."
}
```

## System Prompt

The AI is configured with the following guidelines:
- Acts as Pqrix AI Assistant
- Friendly, professional, and helpful tone
- Only answers questions about Pqrix
- Provides detailed information when available
- Redirects off-topic questions politely
- Encourages users to contact via WhatsApp for deeper queries

## Responsive Breakpoints

| Screen Size | Behavior |
|-------------|----------|
| < 375px (xs) | Full screen chat, smaller button and text |
| 375px - 640px | Full screen chat with padding |
| 640px - 768px (sm) | Fixed 600px height, full width minus padding |
| 768px+ (md) | Fixed 396px width, 600px height |
| 1024px+ (lg) | Fixed 420px width |
| 1280px+ (xl) | Fixed 450px width |

## Z-Index Management

- Chatbot: `z-[9998]` (bottom-left)
- WhatsApp Button: `z-[9999]` (bottom-right)
- No conflicts between icons

## Layout Positioning

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         Main Content Area           │
│                                     │
│                                     │
│                                     │
│  [Chatbot]               [WhatsApp]│
│  (bottom-left)          (bottom-right)
└─────────────────────────────────────┘
```

## No Authentication Required

The chatbot is publicly accessible without any login or authentication.

## Installation

Package installed:
```bash
pnpm install @google/generative-ai
```

## Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=AIzaSyD1RLEaU2ltCKG6iOjXhzFLUg72rlyLNZ0
```

## Usage Example

1. User clicks floating chat button (bottom-right corner)
2. Chat window opens with welcome message
3. User types: "What services do you offer?"
4. AI fetches service data and responds with detailed information
5. Conversation continues with context maintained
6. User can clear chat or close window anytime

## Performance Considerations

- **Preloaded Context**: All Pqrix data loads when page loads (before user interaction)
- **Instant Responses**: No delay on first message - context already available
- **Visual Feedback**: Status indicator shows when AI is ready (green) or loading (yellow)
- Chatbot component is client-side only (`"use client"`)
- Messages auto-scroll smoothly
- Input focuses automatically when opened
- API responses typically under 2 seconds
- Error fallback ensures graceful degradation
- Cached context reduces MongoDB queries

## How Context Preloading Works

1. **Page Load** → Chatbot component mounts
2. **useEffect Triggered** → Fetches `/api/chat/context`
3. **Context Stored** → Saved in component state
4. **Indicator Updates** → Yellow → Green when ready
5. **User Sends Message** → Context included in API request
6. **Fast Response** → No database fetch needed, AI responds instantly

## Future Enhancements (Optional)

- [ ] Voice input support
- [ ] File upload capability
- [ ] Multi-language support
- [ ] Chat history persistence (localStorage)
- [ ] Typing sound effects
- [ ] Emoji reactions
- [ ] Share conversation feature
- [ ] Analytics tracking

## Testing

Test the chatbot with these example questions:
1. "What services do you offer?"
2. "Show me your latest projects"
3. "Tell me about your team"
4. "What do clients say about Pqrix?"
5. "What are your recent blog posts?"
6. "How much does a mobile app cost?"
7. "Can you build a SaaS platform?"

## Troubleshooting

### Chatbot not responding
- Check `.env.local` has `GEMINI_API_KEY`
- Verify MongoDB connection
- Check browser console for errors

### Package not found error
```bash
pnpm install @google/generative-ai
```

### TypeScript errors
Restart VS Code or TypeScript server

### Styles not applying
- Ensure Tailwind CSS is configured
- Check `xs:` breakpoint is supported in `tailwind.config.ts`

## Brand Colors

- Primary: `from-lime-400 to-green-500`
- Background: `black` with opacity variants
- Text: `white` with opacity variants
- Borders: `white/20`

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support (Enter to send)
- Focus management
- Screen reader friendly message structure

---

**Implementation Date:** January 2025  
**Status:** ✅ Fully Functional  
**Responsive:** 300px to 4K+ screens  
**AI Model:** Google Gemini Pro
