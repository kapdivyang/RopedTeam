# 🚀 Firebase Deployment Guide - The Roped Team

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `roped-team-app` (or your choice)
4. Disable Google Analytics (optional for MVP)
5. Click "Create Project"

---

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

---

## Step 3: Create Firestore Database

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in **production mode**" (we'll add security rules)
4. Choose your location (closest to your users)
5. Click "Enable"

---

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, click "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Team members can read their team data
    match /teams/{teamId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.memberIds;
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.adminId;
    }
    
    // Check-ins: users can only create their own
    match /checkins/{checkinId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // Check-ins are immutable
    }
  }
}
```

3. Click "Publish"

---

## Step 5: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the **Web** icon `</>`
5. Register app:
   - App nickname: `Roped Team Web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
6. **Copy the Firebase configuration** - you'll need this!

It looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

7. Save this configuration - we'll use it in the next step

---

## Step 6: Update Your App with Firebase Config

1. Open `firebase-config.js` in your project
2. Replace the placeholder config with your actual Firebase config
3. Save the file

---

## Step 7: Test Locally

1. Open `index.html` in your browser
2. You should see the login page
3. Try creating an account
4. Test the functionality

---

## Step 8: Deploy to Firebase Hosting (Optional)

### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Login to Firebase:
```bash
firebase login
```

### Initialize Firebase in your project:
```bash
cd d:\AI_tools\Antigravity\RopedTeam
firebase init
```

Select:
- Hosting
- Use existing project (select your project)
- Public directory: `.` (current directory)
- Single-page app: Yes
- Don't overwrite index.html

### Deploy:
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## Step 9: Create Admin Account

1. Open your deployed app (or local version)
2. Click "Create Account"
3. Use email: `admin@yourteam.com` (or your choice)
4. Set a strong password
5. This will be your admin account

---

## Step 10: Create Your First Team

1. Login as admin
2. Click "Admin Panel" (⚙️ icon)
3. Click "Create New Team"
4. Enter:
   - Team Name: "K2 Conquerors"
   - Goal Days: 90
   - Summit Prize: "Team Celebration Dinner"
5. Add 8 team members with their emails
6. Click "Create Team & Send Invites"

---

## 🎉 You're Done!

Your app is now:
- ✅ Live on the internet
- ✅ Multi-user enabled
- ✅ Secure with authentication
- ✅ Real-time synced
- ✅ Free (Firebase free tier)

---

## 📧 Inviting Team Members

When you create a team, each member will need to:
1. Go to your app URL
2. Click "Create Account"
3. Use the **exact email** you added to the team
4. Create their password
5. They'll automatically join the team!

---

## 🔒 Security Features

- ✅ Each user has their own account
- ✅ Users can only check in for themselves
- ✅ Team data is private to team members
- ✅ Admin controls team settings
- ✅ Passwords are securely hashed by Firebase

---

## 💰 Firebase Free Tier Limits

**More than enough for your MVP:**
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage
- 10 GB/month bandwidth

**Your 8-person team will use:**
- ~240 writes/day (8 users × 30 operations)
- ~1,000 reads/day
- Well within free limits! ✅

---

## 🆘 Troubleshooting

### "Permission denied" errors:
- Check Firestore security rules are published
- Verify user is logged in
- Ensure user email matches team member email

### Users can't see team data:
- Verify their email exactly matches the one in team setup
- Check they're logged in
- Refresh the page

### Can't deploy:
- Run `firebase login` first
- Ensure you selected the correct project
- Check you have internet connection

---

## 📚 Next Steps

After your MVP is working:
1. Add email notifications (Firebase Cloud Functions)
2. Add password reset functionality
3. Add team invitation system
4. Add profile pictures
5. Add push notifications
6. Export progress reports

---

**Need help?** Check the Firebase documentation or the troubleshooting section above!

**Ready to scale?** Firebase can handle thousands of users on the free tier, and paid plans are very affordable.

🏔️ **Happy climbing to the summit!**
