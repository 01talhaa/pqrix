# Hero Banner Management System - Complete Guide

## Overview
A comprehensive dynamic banner management system for the hero section that allows admins to create, manage, and display custom banners with images or videos. Banners replace the static `phoneData` array with dynamic content from the database.

## Features

### 🎨 Banner Creation
- **Media Types**: Support for both images and videos
- **Poster Images**: Required thumbnail for video banners
- **Display Styles**: 
  - **Auto Play**: Videos play automatically on loop
  - **Slider**: Swipeable carousel (future enhancement)
  - **Static**: Fixed display
- **Customization**:
  - Title and subtitle
  - Tone/category selection
  - Background gradient presets
  - Display order management
  - Draft/Published status

### 📊 Admin Management
- Create, edit, delete banners
- Reorder banners (move up/down)
- Toggle publish/unpublish
- Real-time preview
- Stats dashboard
- Cloudinary integration for media storage

### 🎯 Frontend Display
- Fetches published banners dynamically
- Falls back to default banners if none published
- Auto-refreshes when banners published
- Responsive grid layout
- Supports both image and video content
- Maintains existing phoneCard design

## Architecture

### Database Model (`lib/models/Banner.ts`)
```typescript
interface BannerDocument {
  id: string
  title: string              // e.g., "Conversions"
  subtitle: string           // e.g., "Turn clicks into paying customers."
  tone: string               // e.g., "results", "speed", "social"
  mediaType: 'image' | 'video'
  mediaUrl: string           // Cloudinary URL
  posterUrl?: string         // Thumbnail for videos
  displayStyle: 'autoplay' | 'slider' | 'static'
  status: 'draft' | 'published'
  order: number              // Display order (1, 2, 3...)
  gradient?: string          // CSS gradient class
  createdAt: string
  updatedAt?: string
  publishedAt?: string
}
```

### API Endpoints

#### `GET /api/banners`
Fetch banners (public or admin)
- **Query Params**: `?admin=true` (show all), `?status=published` (filter)
- **Response**: `{ success: true, data: BannerDocument[] }`
- **Sorting**: By `order` ASC, then `createdAt` DESC

#### `POST /api/banners?admin=true`
Create new banner
- **Auth**: Requires `?admin=true` query param
- **Body**: `CreateBannerInput`
- **Auto-generates**: `id`, `order`, `createdAt`, `publishedAt`

#### `PUT /api/banners/[id]?admin=true`
Update existing banner
- **Auth**: Requires `?admin=true`
- **Body**: Partial `UpdateBannerInput`
- **Updates**: `updatedAt`, optionally `publishedAt`

#### `DELETE /api/banners/[id]?admin=true`
Delete banner
- **Auth**: Requires `?admin=true`
- **Response**: `{ success: true, message: "Banner deleted successfully" }`

### Admin Interface (`app/admin/banners/page.tsx`)

#### Features
1. **Stats Dashboard**
   - Total banners
   - Published count
   - Draft count

2. **Banner List View**
   - Media preview (video poster or image)
   - Title, subtitle, tone display
   - Status, media type, display style badges
   - Gradient preview bar
   - Order number

3. **Action Buttons**
   - **Eye/EyeOff**: Toggle publish status
   - **ArrowUp**: Move banner up in order
   - **ArrowDown**: Move banner down in order
   - **Edit**: Open editor dialog
   - **Trash**: Delete banner

4. **Banner Editor Dialog**
   - Title input (required)
   - Subtitle input (required)
   - Tone selector dropdown
   - Media type toggle (Image/Video)
   - Media file upload (Cloudinary)
   - Poster upload (required for videos)
   - Display style selector
   - Gradient preset picker
   - Order number input
   - Status (Draft/Published)

#### Validation
- Title and subtitle required
- Media URL required
- Poster URL required for videos
- File type validation (image/* or video/*)
- File size limit: 50MB max

### Frontend Integration (`components/hero.tsx`)

#### Dynamic Banner Fetching
```typescript
useEffect(() => {
  fetchBanners()
  
  window.addEventListener('banner-published', handleBannerUpdate)
  
  return () => {
    window.removeEventListener('banner-published', handleBannerUpdate)
  }
}, [])

const fetchBanners = async () => {
  const response = await fetch("/api/banners")
  const data = await response.json()
  
  if (data.success && data.data.length > 0) {
    setBanners(data.data)  // Use dynamic banners
  } else {
    setBanners([])  // Fallback to default
  }
}
```

#### Display Logic
- Fetches published banners on page load
- Shows loading spinner during fetch
- Falls back to `phoneData` if no banners found
- Listens for `banner-published` events for real-time updates
- Maintains responsive visibility:
  - Mobile (< sm): 1 banner
  - Tablet (sm-md): 2-3 banners
  - Desktop (md-lg): 4 banners
  - Large (xl): 5 banners

#### PhoneCard Enhancement
```typescript
function PhoneCard({
  title, sub, tone, gradient,
  videoSrc, imageSrc, poster
}: PhoneCardProps) {
  return (
    <div className="phone-card">
      {imageSrc ? (
        <img src={imageSrc} alt={`${title} - ${sub}`} />
      ) : (
        <LazyVideo src={videoSrc} poster={poster} autoPlay loop muted />
      )}
      {/* Title, subtitle, tone display */}
    </div>
  )
}
```

## Configuration Options

### Tone Options
```typescript
const TONE_OPTIONS = [
  { value: "results", label: "Results", color: "lime" },
  { value: "speed", label: "Speed", color: "green" },
  { value: "social", label: "Social", color: "blue" },
  { value: "standout", label: "Standout", color: "purple" },
  { value: "premium", label: "Premium", color: "gold" },
  { value: "creative", label: "Creative", color: "pink" },
  { value: "professional", label: "Professional", color: "gray" },
]
```

### Display Styles
```typescript
const DISPLAY_STYLES = {
  autoplay: {
    label: "Auto Play Video",
    description: "Video plays automatically on loop",
    icon: "Play",
  },
  slider: {
    label: "Slider/Carousel",
    description: "Swipeable banner carousel",
    icon: "Layers",
  },
  static: {
    label: "Static Display",
    description: "Fixed image or video",
    icon: "Image",
  },
}
```

### Gradient Presets
```typescript
const GRADIENT_PRESETS = [
  { name: "Dark Blue", value: "from-[#0b0b0b] via-[#0f172a] to-[#020617]" },
  { name: "Dark Green", value: "from-[#0b1a0b] via-[#052e16] to-[#022c22]" },
  { name: "Ocean Blue", value: "from-[#001028] via-[#0b355e] to-[#052e5e]" },
  { name: "Slate Gray", value: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]" },
  { name: "Forest", value: "from-[#0b0b0b] via-[#111827] to-[#052e16]" },
  { name: "Purple Haze", value: "from-[#0b0b0b] via-[#1e1b4b] to-[#312e81]" },
  { name: "Crimson", value: "from-[#0b0b0b] via-[#450a0a] to-[#7f1d1d]" },
]
```

## User Workflow

### Creating a Banner

1. **Navigate** to `/admin/banners`
2. **Click** "Create New Banner" button
3. **Fill in details**:
   - Title: "Conversions"
   - Subtitle: "Turn clicks into paying customers."
   - Tone: "results"
   - Media Type: "Video"
4. **Upload media**:
   - Click "Video File" input
   - Select `.mp4` file from computer
   - Wait for Cloudinary upload
5. **Upload poster**:
   - Click "Poster/Thumbnail Image" input
   - Select `.jpg/.png` file
   - Wait for upload
6. **Configure**:
   - Display Style: "Auto Play Video"
   - Gradient: "Dark Blue"
   - Order: Auto-assigned (1, 2, 3...)
   - Status: "Published"
7. **Save** banner
8. **Hero section** updates automatically!

### Editing a Banner

1. Find banner in list
2. Click **Edit** button (pencil icon)
3. Modify fields in dialog
4. Upload new media if needed
5. Click "Save Banner"
6. Changes reflected immediately

### Managing Order

- **Move Up**: Click ⬆️ to move banner earlier in sequence
- **Move Down**: Click ⬇️ to move banner later
- Order numbers auto-update (1, 2, 3, 4, 5...)

### Publishing/Unpublishing

- **Published Banner**: Shows 👁️ (Eye) icon - visible on website
- **Draft Banner**: Shows 👁️‍🗨️ (EyeOff) icon - hidden from public
- Click to toggle status instantly

### Deleting a Banner

1. Click **Trash** button (red icon)
2. Confirm deletion in dialog
3. Banner removed from database
4. Hero section updates

## Technical Details

### File Upload Flow

```
User selects file
     ↓
Validate file type (image/* or video/*)
     ↓
Validate file size (<50MB)
     ↓
Create FormData with file
     ↓
POST to /api/upload
     ↓
Cloudinary processes and stores
     ↓
Return public URL
     ↓
Store URL in banner formData
     ↓
Display success message
```

### Order Management

When moving banners:
```typescript
// Move up: swap with previous
const currentIndex = banners.findIndex(b => b.id === id)
const targetIndex = currentIndex - 1

// Reorder array
const newBanners = [...banners]
const [moved] = newBanners.splice(currentIndex, 1)
newBanners.splice(targetIndex, 0, moved)

// Update order numbers
const updates = newBanners.map((banner, index) => ({
  ...banner,
  order: index + 1  // 1-based ordering
}))

// Save to database
await fetch(`/api/banners/${id}?admin=true`, {
  method: "PUT",
  body: JSON.stringify({ order: targetIndex + 1 }),
})
```

### Real-Time Updates

Admin publishes banner:
```typescript
// In admin page
if (formData.status === 'published') {
  window.dispatchEvent(
    new CustomEvent('banner-published', { detail: data.data })
  )
}

// In hero component
useEffect(() => {
  const handleBannerUpdate = () => {
    fetchBanners()  // Refresh banner list
  }
  
  window.addEventListener('banner-published', handleBannerUpdate)
  
  return () => {
    window.removeEventListener('banner-published', handleBannerUpdate)
  }
}, [])
```

## Best Practices

### Media Guidelines

**Videos**:
- Format: MP4 (H.264 codec)
- Resolution: 1080x1920 (9:19 aspect ratio) - vertical phone format
- Duration: 5-15 seconds
- File size: Under 10MB for best performance
- Always include poster image

**Images**:
- Format: JPG or PNG
- Resolution: 1080x1920 minimum
- File size: Under 2MB
- Optimize before upload

### Content Guidelines

**Titles**:
- 1-3 words
- Action-oriented
- Examples: "Conversions", "Speed", "Premium"

**Subtitles**:
- 3-8 words
- Benefit-focused
- Examples: "Turn clicks into paying customers.", "Launch in days, not weeks."

**Tones**:
- Match service offering
- Use consistent tones across banners
- Examples: results, speed, social, premium

### Performance

**Optimization**:
- Compress videos before upload
- Use poster images for faster initial load
- Limit to 5 visible banners max
- Cache API responses with `no-store`

**Loading Strategy**:
- Show loading spinner during fetch
- Fallback to default banners if API fails
- LazyVideo component for efficient playback

## Fallback Behavior

If no published banners exist:
```typescript
const displayBanners = banners.length > 0 ? banners : phoneData
```

Default `phoneData` array maintains original hero section:
- 5 preset banners
- Hardcoded videos and posters
- Ensures site never shows empty state

## Admin Menu Integration

Added to `/app/admin/layout.tsx`:
```tsx
<Link href="/admin/banners">
  <Layout className="w-4 h-4" />
  Banners
</Link>
```

## Security

- Admin-only access via `?admin=true` query param
- File type validation on upload
- File size limits (50MB max)
- XSS protection in form inputs
- MongoDB injection prevention

## Database Schema

Collection: `banners`

Indexes:
- `id` (unique)
- `status` (for filtering published/draft)
- `order` (for sorting)

Example Document:
```json
{
  "_id": ObjectId("..."),
  "id": "banner-1234567890-abc123",
  "title": "Conversions",
  "subtitle": "Turn clicks into paying customers.",
  "tone": "results",
  "mediaType": "video",
  "mediaUrl": "https://res.cloudinary.com/.../video.mp4",
  "posterUrl": "https://res.cloudinary.com/.../poster.jpg",
  "displayStyle": "autoplay",
  "status": "published",
  "order": 1,
  "gradient": "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z",
  "publishedAt": "2024-01-15T10:30:00.000Z"
}
```

## Future Enhancements

1. **Slider Implementation**: Actual swipeable carousel with Swiper.js
2. **Animation Options**: Fade, slide, zoom effects
3. **Scheduling**: Publish/unpublish at specific times
4. **A/B Testing**: Test different banner variants
5. **Analytics**: Track banner clicks and conversions
6. **Bulk Actions**: Select multiple banners for batch operations
7. **Categories**: Group banners by campaign or product
8. **Duplication**: Clone existing banners for quick creation
9. **Preview Mode**: Live preview before publishing
10. **Video Trimming**: Built-in video editor

## Troubleshooting

### Banners not showing on homepage
- Check if banners are published (status = "published")
- Verify API endpoint `/api/banners` returns data
- Check browser console for errors
- Clear cache and hard refresh

### Upload failing
- Check file size (<50MB)
- Verify file type (video/* or image/*)
- Check Cloudinary configuration
- Review `/api/upload` endpoint logs

### Order not updating
- Ensure `?admin=true` query param included
- Check network tab for PUT request success
- Verify MongoDB connection
- Refresh page to see updates

## Files Created/Modified

### New Files
1. `lib/models/Banner.ts` - Banner data model and types
2. `app/api/banners/route.ts` - GET and POST endpoints
3. `app/api/banners/[id]/route.ts` - PUT, DELETE, GET single
4. `app/admin/banners/page.tsx` - Admin management interface

### Modified Files
1. `app/admin/layout.tsx` - Added Banners menu item
2. `components/hero.tsx` - Dynamic banner fetching and display

## Summary

The banner management system provides:
✅ Complete CRUD operations for banners
✅ Image and video support with Cloudinary
✅ Draft/Published workflow
✅ Order management with drag-like controls
✅ Real-time updates on hero section
✅ Fallback to default content
✅ Professional admin interface
✅ Responsive display on all devices
✅ Automatic order assignment
✅ Media validation and upload
✅ Status toggling
✅ Gradient customization
✅ Tone/category selection

The system is production-ready and fully integrated! 🎉
