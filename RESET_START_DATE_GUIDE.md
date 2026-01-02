# Reset Expedition Start Date Guide

## Purpose
This feature allows the admin to change the expedition start date and remove check-ins from before the new date. This is useful when:
- The app was created on a test/trial day (e.g., Dec 31st)
- Some team members couldn't join on the original start date
- You want the journey to officially start on a specific date (e.g., Jan 1st, 2026)

## How to Use

### Step 1: Access Admin Panel
1. Log in as the team admin
2. Click the **⚙️ Admin** button (usually in the top right or sidebar)
3. Scroll down to find the **"Reset Expedition Start Date"** section (it has a red background warning)

### Step 2: Choose New Start Date
1. In the date picker, select your desired start date (default is set to January 1, 2026)
2. Example: `2026-01-01` for January 1st, 2026

### Step 3: Confirm and Reset
1. Click the **"Reset Start Date"** button
2. You'll see a confirmation dialog:
   ```
   ⚠️ WARNING: This will reset the expedition start date to 2026-01-01 
   and DELETE ALL check-ins before this date.

   This action CANNOT be undone!

   Are you absolutely sure you want to proceed?
   ```
3. Click **OK** to confirm or **Cancel** to abort

### Step 4: Wait for Completion
- The button will show "⏳ Resetting..." while processing
- You'll see a success message: `✅ Start date reset! Deleted X old check-in(s). Journey now starts on 2026-01-01.`
- The page will automatically reload after 2 seconds

## What Happens

### In Firebase:
1. **Team Document Updated**: The `startDate` field is updated to the new date
2. **Old Check-ins Deleted**: All check-ins with `day < 1` are permanently deleted from the database
3. **Real-time Sync**: All team members' apps will automatically sync to the new start date

### In the App:
1. **Current Day Recalculated**: The app recalculates the current day based on the new start date
2. **Progress Reset**: Any progress from before the new start date is removed
3. **Mountain Trail Updated**: The trail visualization reflects the new journey timeline

## Example Scenario

**Problem**: 
- App created on Dec 31st, 2025
- Some members checked in on Dec 31st
- You want the official journey to start Jan 1st, 2026

**Solution**:
1. Set new start date to `2026-01-01`
2. Click "Reset Start Date"
3. Result:
   - Dec 31st check-ins are deleted
   - Jan 1st becomes Day 1 of the expedition
   - Everyone starts fresh from the same date

## Important Notes

⚠️ **This action is irreversible!** Once you delete the old check-ins, they cannot be recovered.

✅ **Admin Only**: Only the team admin can reset the start date

🔄 **Auto-Sync**: All team members will see the updated start date automatically (they may need to refresh their browser)

📅 **Future Dates**: You can set a future date if you want to schedule the expedition to start later

## Troubleshooting

**"Firebase not connected"**
- Make sure you're logged in and connected to Firebase
- Refresh the page and try again

**"Only admin can reset start date"**
- You need to be the team admin to use this feature
- Ask your team admin to perform the reset

**Error messages**
- Check the browser console (F12) for detailed error information
- Contact support if the issue persists
