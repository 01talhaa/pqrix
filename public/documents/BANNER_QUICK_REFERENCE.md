# Banner System - Quick Reference

## 🚀 Quick Start

### Create Your First Banner

1. Go to **Admin Panel** → **Banners**
2. Click **"Create New Banner"**
3. Fill in:
   - **Title**: "Conversions" ✏️
   - **Subtitle**: "Turn clicks into paying customers." 📝
   - **Tone**: "results" 🎯
   - **Media Type**: Video or Image 🎬
4. Upload media file (video/image) 📤
5. Upload poster (if video) 🖼️
6. Select **Display Style**: Auto Play 🔄
7. Choose **Gradient**: Dark Blue 🎨
8. Set **Status**: Published ✅
9. Click **"Save Banner"** 💾

Banner appears on homepage instantly! 🎉

## 📊 Admin Interface

### Banner List Actions

| Icon | Action | Description |
|------|--------|-------------|
| 👁️ | Publish | Make banner visible on website |
| 👁️‍🗨️ | Unpublish | Hide banner from public |
| ⬆️ | Move Up | Change display order (earlier) |
| ⬇️ | Move Down | Change display order (later) |
| ✏️ | Edit | Modify banner details |
| 🗑️ | Delete | Remove banner permanently |

### Stats Dashboard

```
┌──────────────┬──────────────┬──────────────┐
│ Total: 5     │ Published: 3 │ Drafts: 2    │
└──────────────┴──────────────┴──────────────┘
```

## 🎨 Banner Options

### Tone Options
- **results** - Focus on ROI/conversions
- **speed** - Emphasize quick delivery
- **social** - Social media ready
- **standout** - Unique/attention-grabbing
- **premium** - High-end/luxury
- **creative** - Artistic/innovative
- **professional** - Corporate/business

### Display Styles
- **Auto Play** - Video loops automatically
- **Slider** - Carousel (coming soon)
- **Static** - Fixed display

### Gradient Presets
- Dark Blue
- Dark Green
- Ocean Blue
- Slate Gray
- Forest
- Purple Haze
- Crimson

## 📁 Media Requirements

### Videos
- **Format**: MP4 (H.264)
- **Resolution**: 1080x1920 (vertical)
- **Duration**: 5-15 seconds
- **Size**: < 10MB
- **Poster**: Required (JPG/PNG)

### Images
- **Format**: JPG or PNG
- **Resolution**: 1080x1920 minimum
- **Size**: < 2MB
- **Optimization**: Compress before upload

## 🔄 Order Management

Banners display in order: 1 → 2 → 3 → 4 → 5

**To reorder**:
1. Find banner in list
2. Click ⬆️ to move earlier
3. Click ⬇️ to move later
4. Order numbers update automatically

**Example**:
```
Before:         After moving banner 3 up:
1. Speed        1. Speed
2. Social       2. Standout  ⬆️
3. Standout     3. Social
4. Premium      4. Premium
```

## 🎯 Display Logic

### Homepage Hero Section

**Mobile (< 640px)**:
- Shows 1 banner

**Tablet (640px - 1024px)**:
- Shows 2-3 banners

**Desktop (1024px - 1280px)**:
- Shows 4 banners

**Large (> 1280px)**:
- Shows 5 banners

### Visibility Rules
```
Banner 1: Always visible ✅
Banner 2: Always visible ✅
Banner 3: Always visible ✅
Banner 4: Hidden on mobile, visible on tablet+ 📱❌ 💻✅
Banner 5: Hidden on mobile/tablet, visible on large 📱❌ 💻❌ 🖥️✅
```

## 🔧 API Endpoints

### Get Banners (Public)
```bash
GET /api/banners
```
Returns all **published** banners

### Get Banners (Admin)
```bash
GET /api/banners?admin=true
```
Returns **all** banners (draft + published)

### Create Banner
```bash
POST /api/banners?admin=true
Content-Type: application/json

{
  "title": "Conversions",
  "subtitle": "Turn clicks into paying customers.",
  "tone": "results",
  "mediaType": "video",
  "mediaUrl": "https://...",
  "posterUrl": "https://...",
  "displayStyle": "autoplay",
  "status": "published",
  "order": 1,
  "gradient": "from-[#0b0b0b] via-[#0f172a] to-[#020617]"
}
```

### Update Banner
```bash
PUT /api/banners/{id}?admin=true
Content-Type: application/json

{
  "status": "published",
  "order": 2
}
```

### Delete Banner
```bash
DELETE /api/banners/{id}?admin=true
```

## ⚡ Common Tasks

### Publish Multiple Banners
1. Create banners with status "draft"
2. Test on staging
3. Click 👁️‍🗨️ on each to publish
4. All go live instantly

### Reorder All Banners
1. Move banner 5 to position 1 (click ⬆️ 4 times)
2. Orders auto-adjust:
   - Old order: 1,2,3,4,5
   - New order: 5,1,2,3,4 → Renumbered to 1,2,3,4,5

### Replace Banner Media
1. Click ✏️ Edit
2. Upload new media file
3. Upload new poster (if video)
4. Save
5. Old media remains in Cloudinary (manual cleanup)

### Duplicate Banner (Manual)
1. Open existing banner
2. Copy title, subtitle, settings
3. Create new banner
4. Paste details
5. Upload same media or new variant

## 🐛 Troubleshooting

### "Banners not showing"
✅ Check if status = "published"
✅ Hard refresh browser (Ctrl+Shift+R)
✅ Check `/api/banners` in browser
✅ Verify MongoDB connection

### "Upload failed"
✅ Check file size (<50MB)
✅ Verify file type (video/*/image/*)
✅ Test internet connection
✅ Check Cloudinary quota

### "Order not updating"
✅ Refresh page
✅ Check ?admin=true in URL
✅ Clear browser cache
✅ Check network tab for errors

### "Video not playing"
✅ Ensure poster uploaded
✅ Check video format (MP4 H.264)
✅ Test video URL directly
✅ Check browser console for errors

## 📌 Best Practices

### Content Strategy
1. **Mix media types**: Alternate videos and images
2. **Consistent tones**: Group by campaign theme
3. **Update regularly**: Fresh content weekly
4. **Test on mobile**: Verify vertical format works
5. **Optimize files**: Smaller = faster load

### Workflow
1. Create as **draft** first
2. Preview changes
3. Publish when ready
4. Monitor homepage
5. Adjust order based on performance

### Performance
- Keep banner count ≤ 7 total
- Compress videos before upload
- Use image posters for quick load
- Test on slow connections
- Monitor Cloudinary bandwidth

## 🎨 Design Tips

### Title Guidelines
- Short and punchy (1-3 words)
- Action-oriented verbs
- Clear benefit
- **Good**: "Conversions", "Speed", "Premium"
- **Bad**: "Our Amazing Service Feature"

### Subtitle Guidelines
- Expand on title (3-8 words)
- Specific benefit or outcome
- Conversational tone
- **Good**: "Turn clicks into paying customers."
- **Bad**: "We provide excellent conversion optimization services."

### Visual Consistency
- Use same aspect ratio (9:19)
- Maintain color harmony
- Match gradient to tone
- Consistent text positioning
- Similar animation styles

## 📱 Mobile Optimization

### Vertical Video Format
```
Aspect Ratio: 9:19 (phone screen)
Resolution: 1080 x 1920
File Size: < 5MB for mobile
Duration: 5-10 seconds
Format: MP4 H.264
```

### Touch-Friendly
- Large hit areas for taps
- Smooth scrolling
- Autoplay without sound
- No hover effects needed

## 🔐 Security

### File Validation
- Type checking (video/*, image/*)
- Size limits enforced
- Cloudinary handles sanitization

### Admin Access
- Requires ?admin=true parameter
- Protected routes
- No public write access

## 📈 Metrics to Track

### Performance
- Load time (target: < 2s)
- Video playback success rate
- Mobile vs desktop views

### Engagement
- Time on hero section
- Click-through rate
- Conversion from hero CTA

### Content
- Most viewed banners
- Best performing tones
- Video vs image performance

## 🚀 Pro Tips

1. **Pre-load videos**: Upload to Cloudinary early
2. **Batch creation**: Create multiple drafts, publish together
3. **Seasonal content**: Schedule updates for campaigns
4. **A/B test**: Try different titles/subtitles
5. **Analyze**: Track which banners drive conversions
6. **Archive**: Keep drafts of old banners for reuse
7. **Optimize**: Compress media before upload
8. **Test**: View on actual devices before publishing
9. **Consistent branding**: Use same gradients/tones
10. **Update regularly**: Fresh content keeps site dynamic

## 🎉 Success Checklist

Before publishing:
- [ ] Title is clear and concise
- [ ] Subtitle communicates benefit
- [ ] Media uploaded successfully
- [ ] Poster added (if video)
- [ ] Tone selected
- [ ] Gradient chosen
- [ ] Display style set
- [ ] Order number assigned
- [ ] Previewed on mobile
- [ ] Tested video playback
- [ ] Status set to "published"
- [ ] Saved successfully

After publishing:
- [ ] Visible on homepage
- [ ] Displays correctly on mobile
- [ ] Video plays automatically
- [ ] Text is readable
- [ ] CTA button visible
- [ ] Order is correct
- [ ] No console errors

---

**Need help?** Check the full documentation in `BANNER_SYSTEM_GUIDE.md` or contact the development team.
