# Banner System Testing Checklist

## ✅ Pre-Deployment Testing

### 1. **Admin Banner Page** (`/admin/banners`)

#### Access & UI
- [ ] Page loads without errors
- [ ] Stats cards show correct counts
- [ ] "Create New Banner" button visible
- [ ] Empty state shows when no banners exist

#### Create New Banner
- [ ] Click "Create New Banner" opens dialog
- [ ] All form fields render correctly
- [ ] Upload Videos button works
- [ ] Upload Images button works
- [ ] Can upload multiple files at once
- [ ] Upload progress indicator shows
- [ ] Uploaded media appears in list

#### Video Poster Upload
- [ ] Video without poster shows warning
- [ ] "Upload poster image (required)" link visible
- [ ] Clicking link opens file picker
- [ ] Poster uploads successfully
- [ ] Checkmark appears after upload
- [ ] Can't save banner with videos missing posters

#### Media Management
- [ ] Can remove media items with X button
- [ ] Media thumbnails display correctly
- [ ] Video items show video icon overlay
- [ ] Badge shows correct type (Image/Video)
- [ ] Media counter shows "X media items"

#### Form Validation
- [ ] Can't submit without title
- [ ] Can't submit without subtitle
- [ ] Can't submit without media
- [ ] Can't submit videos without posters
- [ ] Error toast shows for validation failures

#### Save Banner
- [ ] Click "Save Banner" submits form
- [ ] Success toast appears
- [ ] Dialog closes
- [ ] New banner appears in list
- [ ] Banner shows correct data

### 2. **Banner List Display**

#### Banner Cards
- [ ] Banners show in correct order
- [ ] Title and subtitle display
- [ ] Status badge shows (Published/Draft)
- [ ] Media thumbnails visible (first 3)
- [ ] "+N" indicator for additional media
- [ ] Tone badge displays
- [ ] Display style badge shows
- [ ] Order number visible
- [ ] Gradient bar renders

#### Banner Actions
- [ ] Edit button opens editor with data
- [ ] Delete button opens confirmation
- [ ] Publish/Unpublish toggle works
- [ ] Move Up button works (except first)
- [ ] Move Down button works (except last)
- [ ] Order updates correctly

### 3. **Edit Banner**

#### Load Existing Data
- [ ] Click edit loads banner data
- [ ] Title pre-filled
- [ ] Subtitle pre-filled
- [ ] Tone selected
- [ ] Media items display
- [ ] Display style selected
- [ ] Gradient selected
- [ ] Order number shown
- [ ] Status selected

#### Modify Data
- [ ] Can change title
- [ ] Can change subtitle
- [ ] Can change tone
- [ ] Can add more media
- [ ] Can remove existing media
- [ ] Can change display style
- [ ] Can change gradient
- [ ] Can change order
- [ ] Can change status

#### Update Banner
- [ ] Click "Save Banner" updates
- [ ] Success toast appears
- [ ] Dialog closes
- [ ] List refreshes with changes
- [ ] Changes persist after reload

### 4. **Delete Banner**

- [ ] Click delete opens confirmation
- [ ] Cancel button closes dialog
- [ ] Delete button removes banner
- [ ] Success toast appears
- [ ] Banner removed from list
- [ ] No errors in console

### 5. **Upload Functionality**

#### Image Upload
- [ ] Accepts JPG files
- [ ] Accepts PNG files
- [ ] Rejects video files in image upload
- [ ] Shows error for >50MB files
- [ ] Uploads single image
- [ ] Uploads multiple images
- [ ] URLs are valid Cloudinary URLs
- [ ] Images accessible in browser

#### Video Upload
- [ ] Accepts MP4 files
- [ ] Accepts WebM files
- [ ] Rejects image files in video upload
- [ ] Shows error for >50MB files
- [ ] Uploads single video
- [ ] Uploads multiple videos
- [ ] URLs are valid Cloudinary URLs
- [ ] Videos accessible in browser

#### Poster Upload
- [ ] Accepts image files only
- [ ] Shows error for >10MB files
- [ ] Uploads successfully
- [ ] Poster URL saved correctly
- [ ] Poster displays in preview

### 6. **Hero Component** (`/`)

#### Display Published Banners
- [ ] Published banners appear
- [ ] Draft banners don't appear
- [ ] Correct order (by order field)
- [ ] First media item displays
- [ ] Video plays if type is video
- [ ] Image shows if type is image
- [ ] Poster shows before video loads
- [ ] Title displays correctly
- [ ] Subtitle displays correctly
- [ ] Tone badge shows
- [ ] Gradient applies

#### Fallback Behavior
- [ ] Falls back to phoneData if no banners
- [ ] No errors when banners empty
- [ ] Loads without breaking page

#### Real-Time Updates
- [ ] Publishing banner triggers update
- [ ] Hero refreshes without reload
- [ ] New banners appear immediately

### 7. **API Endpoints**

#### GET `/api/banners`
- [ ] Returns published banners only
- [ ] Sorted by order ASC
- [ ] Returns correct structure
- [ ] media array present
- [ ] No errors

#### GET `/api/banners?admin=true`
- [ ] Returns all banners
- [ ] Includes drafts
- [ ] Sorted correctly
- [ ] Returns correct structure
- [ ] No errors

#### POST `/api/banners?admin=true`
- [ ] Creates new banner
- [ ] Validates required fields
- [ ] Validates media array
- [ ] Validates video posters
- [ ] Returns created banner
- [ ] Sets correct defaults
- [ ] No errors

#### PUT `/api/banners/[id]?admin=true`
- [ ] Updates existing banner
- [ ] Accepts partial updates
- [ ] Validates data
- [ ] Returns updated banner
- [ ] Updates publishedAt when publishing
- [ ] No errors

#### DELETE `/api/banners/[id]?admin=true`
- [ ] Deletes banner
- [ ] Returns success
- [ ] Banner actually removed
- [ ] No errors

### 8. **Console & Network**

#### No Errors
- [ ] No console errors
- [ ] No console warnings
- [ ] No 404 network requests
- [ ] No failed API calls
- [ ] No CORS errors

#### Performance
- [ ] Images load reasonably fast
- [ ] Videos load without lag
- [ ] API responses under 1s
- [ ] No memory leaks
- [ ] Smooth animations

### 9. **Browser Compatibility**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 10. **Responsive Design**

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] All buttons accessible
- [ ] Text readable
- [ ] Images scale properly

---

## 🚨 Critical Path Testing

**Must work before deployment:**

1. **Upload Flow**
   ```
   Admin → Banners → Create → Upload Video → Upload Poster → Save → Publish
   ```
   - [ ] No "No files provided" error
   - [ ] Video uploads successfully
   - [ ] Poster uploads successfully
   - [ ] Banner saves
   - [ ] Banner published

2. **Display Flow**
   ```
   Homepage → Hero Section → Banner Shows
   ```
   - [ ] Video plays
   - [ ] Poster shows before load
   - [ ] Title/subtitle visible
   - [ ] No broken images

3. **Edit Flow**
   ```
   Admin → Banners → Edit → Add Media → Save → Verify
   ```
   - [ ] Opens with existing data
   - [ ] Can add more media
   - [ ] Saves successfully
   - [ ] Changes visible

---

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Admin banners list (empty state)
- [ ] Admin banners list (with banners)
- [ ] Create banner dialog
- [ ] Media upload in progress
- [ ] Uploaded media list
- [ ] Video poster upload
- [ ] Published banner in hero
- [ ] Banner preview on mobile

---

## 🐛 Known Issues to Watch For

### Upload Issues
- **Symptom:** "Error: No files provided"
- **Cause:** FormData field name mismatch
- **Check:** Network tab shows 'files' field with data

### TypeScript Errors
- **Symptom:** Red squiggles in code
- **Cause:** Old single-media references
- **Check:** Run `npm run build` or check Problems panel

### Video Poster Missing
- **Symptom:** Black screen where video should be
- **Cause:** posterUrl not uploaded
- **Check:** Validation should prevent saving

### Media Not Showing
- **Symptom:** Banner created but no media in hero
- **Cause:** media array empty or banner not published
- **Check:** Verify banner.media.length > 0 and status === "published"

---

## ✅ Sign-Off

- [ ] All critical path tests passed
- [ ] No console errors
- [ ] Upload works correctly
- [ ] Multi-media displays correctly
- [ ] Hero shows banners correctly
- [ ] Mobile responsive
- [ ] Ready for deployment

**Tested By:** _____________  
**Date:** _____________  
**Version:** 2.0.0  
**Status:** ⬜ Pass / ⬜ Fail

---

## 📝 Test Results Log

### Test Run 1
**Date:**  
**Tester:**  
**Browser:**  
**Result:**  
**Notes:**  

### Test Run 2
**Date:**  
**Tester:**  
**Browser:**  
**Result:**  
**Notes:**  

### Test Run 3
**Date:**  
**Tester:**  
**Browser:**  
**Result:**  
**Notes:**
