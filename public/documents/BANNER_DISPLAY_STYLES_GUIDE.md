# Banner Display Styles - Complete Guide

## 📋 Overview

The banner system supports **3 display styles** that control how your media items (images/videos) are shown in the hero section. This guide explains each style and when to use them.

---

## 🎨 Display Styles Explained

### 1. **Autoplay** 🎬
**Best for:** Single video content, product demos, brand storytelling

**What it does:**
- Plays **first media item** automatically
- Video loops continuously
- Muted by default (for better UX)
- No user interaction needed
- **If you have multiple media items:** Only the first one is shown

**Use Cases:**
- Product demonstration videos
- Brand introduction videos
- Single promotional video
- Animated logos or graphics

**Example:**
```
Banner: "Conversions"
Media: [video1.mp4, video2.mp4, image1.jpg]
Result: Only video1.mp4 plays on loop
```

**Pros:**
- ✅ Instant engagement
- ✅ Shows dynamic content immediately
- ✅ Great for storytelling

**Cons:**
- ❌ Only shows first media item
- ❌ Can't showcase multiple products/features

---

### 2. **Slider/Carousel** 🎠
**Best for:** Multiple products, features showcase, image galleries

**What it does:**
- **Automatically cycles** through ALL media items
- Changes every 4 seconds
- Smooth transitions between items
- Shows dot indicators at bottom
- Clickable dots to jump to specific slide
- **Supports mix of images and videos**

**Features:**
- 🔄 Auto-advance every 4 seconds
- 🎯 Visual indicators (dots) show current slide
- 👆 Click dots to jump to any slide
- ♾️ Loops infinitely (goes back to first after last)
- 📹 Videos auto-play when their slide is active

**Use Cases:**
- Product catalog (multiple products)
- Feature highlights (different features)
- Before/After comparisons
- Multiple campaign images
- Portfolio showcase
- Different service offerings

**Example:**
```
Banner: "Our Services"
Media: [design.jpg, development.jpg, marketing.mp4, support.jpg]
Result: 
- 0-4s: design.jpg shows
- 4-8s: development.jpg shows
- 8-12s: marketing.mp4 plays
- 12-16s: support.jpg shows
- 16s+: Loops back to design.jpg
```

**Slider Indicators:**
```
Active:   ━━━━━━ (longer, lime color)
Inactive: • • • (dots, white/transparent)
```

**Pros:**
- ✅ Shows all your media items
- ✅ Great for multiple messages
- ✅ Engaging user experience
- ✅ Interactive (clickable dots)
- ✅ Automatic + manual control

**Cons:**
- ⚠️ Requires multiple media items to be effective
- ⚠️ Users might miss content if they don't wait

---

### 3. **Static** 🖼️
**Best for:** Single important image, poster, announcement

**What it does:**
- Displays **first media item** only
- **No autoplay** for videos
- **No transitions** or animations
- Fixed, unchanging display
- Videos require user to click play (if video controls enabled)

**Use Cases:**
- Important announcements
- Poster designs
- Static promotional images
- Event banners
- "Coming Soon" teasers
- Logo showcases

**Example:**
```
Banner: "Grand Opening"
Media: [announcement-poster.jpg]
Result: Poster shows permanently, no changes
```

**Pros:**
- ✅ Simple and straightforward
- ✅ No distractions
- ✅ Best for single strong image
- ✅ Loads fastest (no video autoplay)

**Cons:**
- ❌ Only shows one item
- ❌ No engagement/interaction
- ❌ Less dynamic

---

## 🎯 When to Use Each Style

### Choose **AUTOPLAY** when:
- ✅ You have ONE amazing video
- ✅ You want immediate engagement
- ✅ You're telling a story
- ✅ You want to demo a product
- ✅ You need motion to capture attention

### Choose **SLIDER** when:
- ✅ You have MULTIPLE media items (2+)
- ✅ You want to showcase variety
- ✅ You need to show different features/products
- ✅ You want users to explore options
- ✅ You're running multiple campaigns

### Choose **STATIC** when:
- ✅ You have ONE powerful image
- ✅ You want a clean, minimalist look
- ✅ You're making an announcement
- ✅ Performance is critical (no video)
- ✅ Content is time-sensitive (event poster)

---

## 🔧 Technical Implementation

### Slider Settings:
- **Transition Speed:** 4 seconds per slide
- **Animation:** Smooth fade/transition
- **Loop:** Infinite (restarts after last slide)
- **Indicators:** Dots at bottom, clickable
- **Direction:** Left to right (forward)

### Video Behavior:
- **Autoplay Style:** Videos auto-play and loop
- **Slider Style:** Videos auto-play when slide is active, pause when not
- **Static Style:** Videos don't auto-play (user must click)

### Performance:
- **Lazy Loading:** Videos load only when needed
- **Poster Images:** Show before video loads
- **Preloading:** Next slide preloads in background
- **Memory:** Old slides are garbage collected

---

## 📱 User Experience

### Slider Interaction:

**Automatic Mode:**
```
User lands on page → Slide 1 shows → 4s passes → Slide 2 shows → 4s passes → Slide 3 shows → Loop
```

**Manual Mode:**
```
User clicks dot 3 → Slide 3 shows immediately → Auto-advance pauses briefly → Resumes after 4s
```

**Visual Feedback:**
- Current slide dot: **Longer bar** in **lime green** ━━━━━━
- Other slide dots: **Small circles** in **semi-transparent white** • • •
- Hover effect: Dots become brighter on hover

---

## 🎨 Design Best Practices

### For AUTOPLAY:
1. Use high-quality video (1080p minimum)
2. Keep video under 30 seconds
3. Ensure video loops smoothly
4. Add compelling poster image
5. Video should work without sound

### For SLIDER:
1. Use **3-5 media items** (optimal)
2. Keep consistent aspect ratio
3. Similar visual style across items
4. Mix images and videos for variety
5. Ensure each slide tells a story
6. Don't add too many slides (max 7)

### For STATIC:
1. Use high-resolution image (2x for retina)
2. Ensure text is readable
3. Strong visual hierarchy
4. Clear call-to-action
5. Test on mobile devices

---

## 🛠️ Configuration Examples

### Example 1: Product Launch (SLIDER)
```
Title: "New iPhone 16"
Subtitle: "Available in 5 stunning colors"
Media:
  - blue-iphone.jpg
  - black-iphone.jpg
  - white-iphone.jpg
  - pink-iphone.jpg
  - yellow-iphone.jpg
Display Style: slider
Result: Cycles through all 5 colors every 4 seconds
```

### Example 2: Brand Video (AUTOPLAY)
```
Title: "Our Story"
Subtitle: "20 years of innovation"
Media:
  - brand-video.mp4 (with poster)
Display Style: autoplay
Result: Video plays immediately on loop
```

### Example 3: Event Poster (STATIC)
```
Title: "Summer Sale"
Subtitle: "50% off everything"
Media:
  - sale-poster.jpg
Display Style: static
Result: Poster displays permanently
```

---

## 🚀 Advanced Tips

### Optimizing Slider Performance:

1. **Compress Images:**
   - Use WebP format
   - Target 200-500KB per image
   - 1080x1920px for phone mockups

2. **Optimize Videos:**
   - Use MP4 (H.264) or WebM
   - Target 2-5MB per video
   - Max 30 seconds length
   - 720p is sufficient for mobile

3. **Poster Images:**
   - Always add posters for videos
   - Use frame from video as poster
   - Keep poster under 100KB

### Creating Engaging Sliders:

1. **Tell a Story:**
   ```
   Slide 1: Problem (show pain point)
   Slide 2: Solution (show your product)
   Slide 3: Results (show success story)
   ```

2. **Feature Showcase:**
   ```
   Slide 1: Feature 1 + benefit
   Slide 2: Feature 2 + benefit
   Slide 3: Feature 3 + benefit
   ```

3. **Product Variations:**
   ```
   Slide 1: Color variant 1
   Slide 2: Color variant 2
   Slide 3: Color variant 3
   ```

---

## 🎬 Slider Animation Details

### Transition Effect:
- **Type:** Opacity fade
- **Duration:** 500ms (0.5 seconds)
- **Easing:** Smooth (ease-in-out)
- **Between Slides:** 4 seconds display + 0.5s transition

### Timeline Example:
```
00:00 - Slide 1 appears (fade in 0.5s)
00:00-04:00 - Slide 1 displays
04:00 - Slide 1 fades out (0.5s)
04:00 - Slide 2 fades in (0.5s)
04:00-08:00 - Slide 2 displays
08:00 - Slide 2 fades out (0.5s)
08:00 - Slide 3 fades in (0.5s)
...and so on
```

---

## 🔍 Troubleshooting

### Slider Not Working?
**Check:**
1. Banner has `displayStyle: "slider"` set
2. Banner has 2+ media items
3. Banner is published (not draft)
4. No console errors
5. Browser supports CSS transitions

**Debug:**
- Open browser console (F12)
- Look for errors
- Check network tab for failed media loads

### Videos Not Playing in Slider?
**Check:**
1. Video has poster image
2. Video URL is accessible
3. Video format is MP4 or WebM
4. Video size is under 50MB
5. Autoplay is allowed in browser

**Fix:**
- Add poster image (required)
- Check video codec (H.264 for MP4)
- Test in incognito mode
- Check browser autoplay policy

### Slides Changing Too Fast/Slow?
**Adjust timing in code:**
```typescript
// components/hero.tsx - line ~148
const interval = setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % media.length)
}, 4000) // <-- Change this number (milliseconds)

// 3000 = 3 seconds
// 5000 = 5 seconds
// 7000 = 7 seconds
```

---

## 📊 Comparison Table

| Feature | Autoplay | Slider | Static |
|---------|----------|--------|--------|
| Shows multiple media | ❌ No | ✅ Yes | ❌ No |
| Auto-advances | N/A | ✅ Yes | N/A |
| User interaction | ❌ Passive | ✅ Active | ❌ Passive |
| Best for videos | ✅ Yes | ⚠️ Mixed | ❌ No |
| Best for images | ⚠️ OK | ✅ Yes | ✅ Yes |
| Performance | 🟢 Good | 🟡 Medium | 🟢 Best |
| Engagement | 🟢 High | 🟢 High | 🔴 Low |
| Load time | 🟡 Medium | 🔴 Slower | 🟢 Fastest |

---

## 🎯 Quick Decision Guide

**I have 1 video:** → Use **AUTOPLAY**  
**I have 1 image:** → Use **STATIC**  
**I have 2-5 items:** → Use **SLIDER**  
**I have 6+ items:** → Use **SLIDER** (or split into multiple banners)  
**I want engagement:** → Use **SLIDER**  
**I want simplicity:** → Use **STATIC** or **AUTOPLAY**  

---

## 📝 Summary

### **Autoplay** = One video, auto-plays
### **Slider** = Multiple items, auto-cycles, interactive
### **Static** = One image, no motion

**Key Takeaway:** 
- If you uploaded **multiple media items** → Always use **SLIDER** to show them all
- Slider automatically rotates through your images/videos every 4 seconds
- Users can also click dots to jump to specific slides

---

**Last Updated:** 2024-01-15  
**Component:** `components/hero.tsx`  
**Lines:** 141-199 (Slider implementation)
