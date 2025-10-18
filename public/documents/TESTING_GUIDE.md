# 🧪 Quick Testing Guide

## Test the Full Flow

### 1. Login to Admin Dashboard
```
1. Go to: http://localhost:3000/admin/login
2. Email: abstalha@gmail.com
3. Password: 123456
4. Click "Sign In"
```

### 2. Create a Test Project
```
1. Go to: http://localhost:3000/admin/projects
2. Click "New Project" button
3. Fill in minimum required fields:
   - id: test-project-1
   - title: Test Project
   - client: Test Client
   - category: Web Development
   - description: This is a test project
   - image: (upload any image)
   - tags: ["React", "Node.js", "MongoDB"]
   - year: 2024
4. Click "Create Project"
```

### 3. View on Public Website
```
1. In admin projects list, find your project
2. Click the EYE icon (👁️)
3. Should open new tab with: http://localhost:3000/projects/test-project-1
4. Verify all fields are displayed correctly
```

### 4. Test Projects List Page
```
1. Go to: http://localhost:3000/projects
2. Should see your test project in the grid
3. Click on the project card
4. Should navigate to: http://localhost:3000/projects/test-project-1
```

## Expected Results

✅ Login works without redirect loops
✅ Can create project with images
✅ Project appears in admin list
✅ Eye button opens correct URL
✅ Public projects page shows project
✅ Clicking project card opens detail page
✅ All project fields display correctly
✅ Images load from Cloudinary

## Troubleshooting

### If project doesn't appear on /projects:
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check console for errors
- Verify project has `id` field

### If images don't load:
- Check Cloudinary credentials in .env
- Verify upload was successful
- Check image URL in database

### If detail page shows 404:
- Verify `id` field matches URL
- Check API: http://localhost:3000/api/projects
- Ensure project exists in MongoDB

### If categories don't show:
- Create projects in different categories
- Refresh the page
- Check that category field is filled

## Quick API Tests

### List all projects:
```bash
curl http://localhost:3000/api/projects
```

### Get specific project:
```bash
curl http://localhost:3000/api/projects/test-project-1
```

## Sample Project Data

For a complete test, use this JSON structure:

```json
{
  "id": "sample-ecommerce",
  "title": "E-Commerce Platform",
  "client": "Fashion Store",
  "category": "E-Commerce",
  "description": "Modern e-commerce solution",
  "longDescription": "A complete e-commerce platform with payment integration",
  "image": "https://your-image-url",
  "tags": ["Next.js", "Stripe", "MongoDB"],
  "year": "2024",
  "status": "Completed",
  "duration": "12 weeks",
  "budget": "$5,000 - $10,000",
  "metrics": [
    { "label": "Sales Increase", "value": "50%" },
    { "label": "Load Time", "value": "1.2s" }
  ],
  "technologies": ["Next.js 14", "MongoDB", "Stripe", "Tailwind CSS"],
  "testimonial": {
    "quote": "Excellent work!",
    "author": "John Doe",
    "role": "CEO, Fashion Store"
  }
}
```

---

**Ready to test!** 🚀

Start with step 1 and work your way through. Each step should work smoothly.
