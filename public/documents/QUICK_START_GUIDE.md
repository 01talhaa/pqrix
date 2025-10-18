# 🚀 Quick Start Guide - Client System

## Environment Setup

Add these to your `.env` file:

```env
# Existing MongoDB connection
MONGO_URI=your_mongodb_connection_string

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-characters-long
```

**Generate secrets:**
```bash
# Use this command to generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## First Time Setup

1. **Start the development server:**
```bash
cd /d/projects/test/3d/pqrix
pnpm dev
```

2. **Open your browser:**
```
http://localhost:3000
```

## Test the System (Step by Step)

### Step 1: Register a New Client

1. Click **"Login / Sign Up"** in the header
2. Click **"Sign up"** link at the bottom
3. Fill in the form:
   ```
   Full Name: John Doe
   Email: john@example.com
   Phone: +880 1712345678 (optional)
   Company: Acme Inc (optional)
   Password: password123
   Confirm Password: password123
   ```
4. Click **"Sign Up"**
5. ✅ You'll be automatically logged in and redirected to dashboard

### Step 2: Explore Client Dashboard

1. **Upload Avatar:**
   - Click the camera icon on your profile picture
   - Select an image from your computer
   - ✅ Image uploads to Cloudinary

2. **Check Profile:**
   - See your name, email, phone, company
   - View statistics (currently 0 projects)

3. **Empty State:**
   - See "No projects yet" message
   - Click "Get Started" to go to contact form

### Step 3: Add Project as Admin

1. **Logout from client:**
   - Click your avatar → Logout

2. **Login to Admin Panel:**
   ```
   URL: http://localhost:3000/admin/login
   Email: admin@pqrix.com
   Password: admin123
   ```

3. **Go to Clients:**
   - Click **"Clients"** in the admin navigation

4. **Find Your Client:**
   - See the client you just registered
   - Notice the avatar you uploaded

5. **Add a Project:**
   - Click **"Add Project"** button
   - Fill in the form:
     ```
     Project ID: e-commerce-website
     Project Title: E-Commerce Website
     Status: In Progress
     Progress: 35%
     Booked Date: (today's date)
     Start Date: (yesterday's date)
     Est. Completion: (next month)
     Notes: Building a modern e-commerce platform
     ```

6. **Add Timeline Phases:**
   - Click **"Add Phase"** button 3 times
   - Fill in phases:
     ```
     Phase 1:
       Name: Requirements Analysis
       Status: Completed
       Date: (last week)
     
     Phase 2:
       Name: Design & Development
       Status: In Progress
       Date: (today)
     
     Phase 3:
       Name: Testing & Deployment
       Status: Pending
       Date: (next month)
     ```

7. Click **"Save Project"**

### Step 4: View as Client

1. **Logout from admin**

2. **Login as client:**
   ```
   Email: john@example.com
   Password: password123
   ```

3. **Check Dashboard:**
   - ✅ Statistics updated: 1 total, 1 in progress
   - ✅ Project card appears
   - ✅ Progress bar shows 35%
   - ✅ Timeline displays all 3 phases with correct icons
   - ✅ Dates show correctly
   - ✅ Notes display

4. **Check Header:**
   - ✅ Avatar shows your uploaded image
   - ✅ Click avatar to see dropdown menu

### Step 5: Update Project Progress (Admin)

1. **Switch to admin panel**

2. **Go to Clients → Find John Doe**

3. **Click Edit icon** on the project

4. **Update:**
   ```
   Progress: 65%
   Status: In Progress
   
   Update Phase 2:
     Status: Completed
     Date: (today)
   
   Update Phase 3:
     Status: In Progress
     Date: (today)
   ```

5. **Save**

6. **Switch back to client dashboard**

7. **Refresh page:**
   - ✅ Progress bar now shows 65%
   - ✅ Timeline updated with new statuses
   - ✅ Icons changed (checkmark for completed)

### Step 6: Test Mobile View

1. **Open browser dev tools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Select mobile device** (iPhone/Android)

4. **Check mobile header:**
   - ✅ Hamburger menu appears
   - ✅ Click to open menu
   - ✅ See your avatar and info at bottom
   - ✅ Dashboard button visible
   - ✅ Logout button visible

5. **Check mobile dashboard:**
   - ✅ Single column layout
   - ✅ Projects stack vertically
   - ✅ Everything readable and accessible

## Troubleshooting

### "Cannot find module 'jose'" or "'bcryptjs'"
```bash
cd /d/projects/test/3d/pqrix
pnpm add jose bcryptjs
pnpm add -D @types/bcryptjs
```

### Images not uploading
- Check Cloudinary environment variables in `.env`
- Verify API route `/api/upload` is working
- Check browser console for errors

### Tokens not refreshing
- Check JWT secrets are set in `.env`
- Verify browser cookies are enabled
- Check browser console for errors

### "Client not found" after registration
- Check MongoDB connection string
- Verify database name is 'pqrix'
- Check if client was created in database

### Admin can't see clients
- Verify admin authentication is working
- Check MongoDB 'clients' collection exists
- Verify API route `/api/clients` returns data

## Development URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Client Login | http://localhost:3000/client/login |
| Client Register | http://localhost:3000/client/register |
| Client Dashboard | http://localhost:3000/client/dashboard |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Clients | http://localhost:3000/admin/clients |

## MongoDB Collections

Check your database has these collections:
- `clients` - Client documents with authentication and projects
- `services` - Your services
- `projects` - Your portfolio projects
- `teamMembers` - Your team

## Success Indicators

✅ Client can register and login
✅ Avatar uploads to Cloudinary
✅ Client dashboard displays profile
✅ Admin can view all clients
✅ Admin can add/edit/delete projects
✅ Projects appear on client dashboard
✅ Timeline phases display correctly
✅ Progress bars work
✅ Status badges show correct colors
✅ Logout clears session
✅ Header shows avatar or initials
✅ Mobile menu works correctly

## Need Help?

Check these files for detailed information:
- `CLIENT_AUTH_SYSTEM.md` - Full documentation
- `IMPLEMENTATION_COMPLETE.md` - Feature summary
- Console logs in browser dev tools
- Server logs in terminal

## Production Deployment

Before deploying:
1. ✅ Set strong JWT secrets
2. ✅ Set NODE_ENV=production
3. ✅ Configure Cloudinary
4. ✅ Set up MongoDB Atlas
5. ✅ Enable HTTPS (for secure cookies)
6. ✅ Test all features in production mode

```bash
# Build and test production
pnpm build
pnpm start
```

---

**System is ready to use! Enjoy your new client management system! 🎉**
