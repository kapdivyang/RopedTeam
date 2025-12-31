# 🏔️ The Roped Team - Habit Tracker App

A collaborative habit tracking application where 8 climbers work together to reach the summit. Built with the powerful metaphor of a roped mountain climbing team - if one person slips, the whole team is affected.

## 🌟 Features

### Core Experience
- **Mountain Climbing Theme**: The entire interface represents a mountaineering ascent
- **Roped Team Visualization**: All 8 members are visually connected, showing their interdependence
- **90-Day Goal**: Reach the summit together in 90 days
- **Daily Check-ins**: Each member secures their "anchor" daily
- **Weekly Milestones**: Establish "Base Camps" when the entire team completes a perfect week

### Key Functionality

#### 1. **Group Dashboard**
- Real-time progress tracking showing the team's ascent
- Altitude meter displaying overall progress (0-100%)
- Team statistics: Base Camps established, team streak, daily check-ins
- Visual representation of all 8 climbers connected by rope

#### 2. **Individual Tracking**
- Each climber has their own:
  - Name and personal habit
  - Current streak (days since last slip)
  - Daily status (checked in or pending)
- Visual feedback when someone is stalled/missed a day

#### 3. **Weekly Milestones (Base Camps)**
- A Base Camp is established when ALL 8 members check in for 7 consecutive days
- Visual celebration animation when achieved
- Progress grid showing all 12+ potential base camps

#### 4. **Daily Check-in System**
- Simple user selection dropdown
- One-click "Anchor Secured" button
- Immediate visual feedback
- Prevents duplicate check-ins

#### 5. **Admin Panel**
- Configure group name (e.g., "K2 Conquerors")
- Set summit prize (e.g., "Team Celebration Dinner")
- Customize all 8 member names and habits
- Reset progress for new expeditions

## 🎨 Design Highlights

- **Modern Aesthetics**: Glassmorphism, gradients, and smooth animations
- **Mountain Theme**: Deep blue to purple gradient sky with twinkling stars
- **Premium Feel**: Gold accents, smooth transitions, micro-animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation

## 🚀 Getting Started

### Installation
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

### First Time Setup
1. Click the "⚙️ Admin" button in the top-right
2. Customize your group name and summit prize
3. Update the 8 team member names and their habits
4. Click "Save Settings"
5. Start checking in daily!

### Daily Usage
1. Each team member selects their name from the dropdown
2. Click "Anchor Secured" to check in for the day
3. Watch the team progress together up the mountain
4. Celebrate when you establish Base Camps!

## 💾 Data Persistence

All data is stored locally in your browser using `localStorage`:
- Group settings
- Member information
- Daily check-ins
- Base camp achievements
- Progress tracking

**Note**: Data is stored per browser. To sync across devices, you would need to implement a backend (see Future Enhancements).

## 🎯 How It Works

### The Roped Team Concept
Just like real mountain climbers roped together:
- **Success is collective**: The team only advances when everyone checks in
- **Accountability**: If one person misses, it's visible to all
- **Shared celebration**: Base Camps are achieved together
- **Motivation**: The visual representation keeps everyone engaged

### Weekly Base Camps
- A week runs from Day 1-7, 8-14, 15-21, etc.
- To establish a Base Camp, ALL 8 members must check in for ALL 7 days
- When achieved, a celebration modal appears
- Base Camps are permanently marked on the progress grid

### Progress Calculation
- **Altitude**: Based on current day / 90 days
- **Team Streak**: Consecutive days where all 8 members checked in
- **Individual Streak**: Days since a member's last missed check-in

## 🛠️ Technical Stack

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Custom properties, gradients, animations, glassmorphism
- **Vanilla JavaScript**: ES6+ features, class-based architecture
- **Local Storage**: Client-side data persistence
- **Google Fonts**: Outfit (headings) and Inter (body text)

## 📱 Future Enhancements

Potential features for future versions:
- **Backend Integration**: Firebase/Supabase for real-time sync
- **Push Notifications**: Daily reminders to check in
- **Mobile Apps**: Native iOS and Android versions
- **Social Features**: Comments, encouragement messages
- **Analytics**: Detailed progress charts and insights
- **Gamification**: Badges, achievements, leaderboards
- **Custom Themes**: Different mountain ranges, color schemes
- **Export Data**: Download progress reports

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-summit: #E8F4FD;
    --color-sky-light: #4A90E2;
    --color-gold: #FFD700;
    /* ... more variables */
}
```

### Changing Goal Duration
Edit in `app.js`:
```javascript
this.state = {
    goalDays: 90, // Change to any number
    // ...
}
```

### Adding More Members
Currently supports exactly 8 members. To change this, you'll need to:
1. Update the members array in `app.js`
2. Adjust the check-in validation logic
3. Update UI text references to "8"

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

Created with ❤️ using Antigravity AI
Design inspired by the power of group accountability and the majesty of mountain climbing

---

**Ready to start your expedition? Open `index.html` and begin your journey to the summit!** 🏔️
