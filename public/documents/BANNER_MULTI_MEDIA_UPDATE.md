# Banner System - Multi-Media Update

## ✅ Completed Changes

### 1. **Fixed Upload Error** ✓
**Issue:** "Error: No files provided" when uploading  
**Cause:** Admin page was sending `formData.append('file', file)` but upload API expects `formData.getAll('files')`  
**Solution:** Changed all upload handlers to use `formData.append('files', file)`

**Files Updated:**
- `app/admin/banners/page.tsx` (lines 194 & 295)

---

### 2. **Multi-Media Support** ✓
**Feature:** Each banner can now have multiple images and/or videos

**Model Changes:**
- **Old Structure:**
  ```typescript
  {
    mediaType: 'image' | 'video',
    mediaUrl: string,
    posterUrl?: string
  }
  ```

- **New Structure:**
  ```typescript
  {
    media: BannerMedia[]  // Array of media items
  }
  
  interface BannerMedia {
    url: string
    type: 'image' | 'video'
    posterUrl?: string  // Required for videos
  }
  ```

**Files Updated:**
- `lib/models/Banner.ts` - Updated BannerDocument interface
- `app/admin/banners/page.tsx` - Complete rewrite with multi-media UI
- `components/hero.tsx` - Updated to read from media array
- `app/api/banners/route.ts` - Updated validation for media array
- `app/api/banners/[id]/route.ts` - Already handles partial updates

---

## 🎯 Key Features

### Admin Page Features:
1. **Multiple Media Upload**
   - Upload multiple images at once
   - Upload multiple videos at once
   - Mix images and videos in same banner

2. **Video Poster Management**
   - Each video MUST have a poster image
   - Upload poster for each video individually
   - Validation prevents saving without posters

3. **Media Management UI**
   - View all uploaded media items
   - Remove individual media items
   - See thumbnails/posters for each item
   - Clear type badges (Image/Video)

4. **Visual Preview**
   - First 3 media items shown as thumbnails
   - "+N" indicator for additional items
   - Video posters displayed in preview

### API Validation:
- ✅ Checks `media` is an array with at least 1 item
- ✅ Validates each media item has `url` and `type`
- ✅ Validates type is either 'image' or 'video'
- ✅ Ensures all videos have a `posterUrl`

### Hero Component:
- Displays first media item from the array
- Handles both images and videos
- Gracefully falls back to default if no media

---

## 📝 Usage Examples

### Creating a Banner with Multiple Media:

1. **Navigate to:** Admin → Banners
2. **Click:** "Create New Banner"
3. **Fill in:**
   - Title: "Conversions"
   - Subtitle: "Turn clicks into paying customers."
   - Tone: Select from dropdown
4. **Upload Media:**
   - Click "Upload Videos" → Select 2-3 videos
   - For each video, click "Upload poster image (required)"
   - Click "Upload Images" → Select 2-3 images
5. **Configure:**
   - Display Style: Autoplay / Slider / Static
   - Gradient: Choose preset
   - Status: Draft or Published
6. **Save**

### Result:
- Banner has 4-6 media items total
- All videos have posters
- Hero section displays first media item
- All media items stored for future use (slider, gallery, etc.)

---

## 🔄 Migration Path

### Existing Banners:
If you have existing banners with old structure:

**Option 1: Automatic Migration (Recommended)**
Add this migration script to `scripts/migrate-banners.js`:

```javascript
const { MongoClient } = require('mongodb')

async function migrateBanners() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  
  const db = client.db()
  const banners = db.collection('banners')
  
  // Find all banners with old structure
  const oldBanners = await banners.find({
    mediaType: { $exists: true }
  }).toArray()
  
  for (const banner of oldBanners) {
    // Convert to new structure
    const media = [{
      url: banner.mediaUrl,
      type: banner.mediaType,
      posterUrl: banner.posterUrl
    }]
    
    // Update banner
    await banners.updateOne(
      { _id: banner._id },
      {
        $set: { media },
        $unset: { mediaType: '', mediaUrl: '', posterUrl: '' }
      }
    )
  }
  
  console.log(`Migrated ${oldBanners.length} banners`)
  await client.close()
}

migrateBanners()
```

**Run:** `node scripts/migrate-banners.js`

**Option 2: Manual Migration**
- Edit each banner in admin panel
- Re-upload media files
- Save

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Slider Implementation
Display multiple media items in a carousel:
```typescript
// components/hero.tsx - PhoneCard
const [currentIndex, setCurrentIndex] = useState(0)

// Cycle through banner.media array
useEffect(() => {
  if (banner.displayStyle === 'slider' && banner.media.length > 1) {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banner.media.length)
    }, 5000)
    return () => clearInterval(interval)
  }
}, [banner.displayStyle, banner.media.length])
```

### 2. Media Gallery View
Create admin page to view all media:
```typescript
// app/admin/media/page.tsx
// Show all media from all banners
// Click to view usage
// Bulk delete unused media
```

### 3. Display Order per Media
Allow different display orders for each media item:
```typescript
interface BannerMedia {
  url: string
  type: 'image' | 'video'
  posterUrl?: string
  displayOrder?: number  // NEW
}
```

### 4. Media Metadata
Add titles, alt text, descriptions:
```typescript
interface BannerMedia {
  url: string
  type: 'image' | 'video'
  posterUrl?: string
  title?: string       // NEW
  altText?: string     // NEW
  description?: string // NEW
}
```

---

## 🐛 Troubleshooting

### Upload Still Showing "No files provided"
**Check:**
1. Browser console for errors
2. Network tab - verify FormData contains 'files' field
3. Server logs in terminal

**Fix:**
Clear browser cache and hard refresh (Ctrl+Shift+R)

### Videos Not Playing
**Check:**
1. Video has a poster image uploaded
2. Video URL is accessible
3. Video format is supported (MP4, WebM)

**Fix:**
Re-upload video and ensure poster is added

### Media Not Showing in Hero
**Check:**
1. Banner status is "Published"
2. Banner has at least 1 media item
3. Media array is not empty

**Fix:**
Edit banner, verify media array has items, re-save

---

## 📊 Database Structure

### Banners Collection:
```json
{
  "_id": ObjectId("..."),
  "id": "banner-1234567890-abc123",
  "title": "Conversions",
  "subtitle": "Turn clicks into paying customers.",
  "tone": "results",
  "media": [
    {
      "url": "https://res.cloudinary.com/.../video1.mp4",
      "type": "video",
      "posterUrl": "https://res.cloudinary.com/.../poster1.jpg"
    },
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "type": "image"
    }
  ],
  "displayStyle": "autoplay",
  "status": "published",
  "order": 1,
  "gradient": "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "publishedAt": "2024-01-15T10:05:00.000Z"
}
```

---

## ✨ Summary

**What Changed:**
- ✅ Fixed upload error (file → files)
- ✅ Added multi-media support (single media → array)
- ✅ Complete admin UI rewrite
- ✅ Updated hero component
- ✅ Enhanced API validation
- ✅ Video poster requirement enforcement

**What Works:**
- Upload multiple images per banner
- Upload multiple videos per banner
- Mix images and videos
- Each video requires a poster
- Display first media item in hero
- Full CRUD operations
- Draft/publish workflow
- Reordering banners

**Ready For:**
- Production deployment
- Creating banners with multiple media
- Future slider/gallery implementations
- Media management features

---

**Created:** 2024-01-15  
**Status:** ✅ Complete  
**Version:** 2.0.0
