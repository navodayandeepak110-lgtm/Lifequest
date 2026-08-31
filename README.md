# LifeQuest - Gamified Productivity App

A modern, gamified personal productivity web application where users can track daily habits, manage goals, earn XP, level up, and visualize their progress.

## Features

### 🎮 Gamification System
- **XP & Leveling**: Earn experience points by completing habits
- **7 Levels**: Progress from Beginner to Legend
- **Visual Progress Bars**: Track your journey to the next level
- **Streak Tracking**: Build momentum with daily streaks

### ✅ Integrated Habit Tracking
- **Monthly Grid View**: Track each habit across every day of the month
- **Visual Completion Matrix**: See all your habits and their daily completions at a glance
- **Month Navigation**: Navigate between months to view historical data
- **Quick Completion Toggle**: Click any day to mark a habit as complete
- Create, edit, and delete custom habits
- Set habit duration and XP rewards (10-100 XP)
- Choose from 15 custom icons
- Automatic streak calculation based on consecutive completions
- Real-time XP and level updates
- Completion statistics and rates

**Layout:**
- Habits displayed vertically (rows)
- Days of the month displayed horizontally (columns)
- Each intersection is a clickable checkbox
- Complete visual feedback with checkmarks
- Today's date highlighted
- Future dates disabled

### 🎯 Goal Setting
- Add and manage personal goals (completely separate from habits)
- 8 goal categories (Personal, Health, Learning, Career, etc.)
- Set due dates and track progress
- Visual progress indicators with sliders
- Mark goals as complete
- Overdue notifications
- Active vs completed goal views

### 📊 Dashboard
- Personalized greeting based on time of day
- Current level and XP progress
- Today's habit completion overview
- Quick access to mark today's habits complete
- Best streak display
- Weekly progress visualization
- Motivational daily quest

### ⚙️ Profile & Settings
- Editable display name
- Profile avatar with initials
- Dark/Light theme toggle
- Reset data functionality
- Detailed statistics overview
- Level progression tracking

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with CSS variables
- **LocalStorage** - Client-side data persistence

## Installation

1. **Navigate to project directory**
   ```bash
   cd ~/Desktop/lifequest-app
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
lifequest-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   └── Sidebar.css
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard with today's overview
│   │   ├── Dashboard.css
│   │   ├── Habits.jsx           # Integrated habit tracker with monthly grid
│   │   ├── Habits.css
│   │   ├── Goals.jsx            # Goal management (separate from habits)
│   │   ├── Goals.css
│   │   ├── Profile.jsx          # User profile and settings
│   │   └── Profile.css
│   ├── hooks/
│   │   └── useLocalStorage.js   # LocalStorage persistence hook
│   ├── utils/
│   │   └── defaults.js          # Data initialization, XP/level logic, migrations
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles and theme variables
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Key Features Explained

### Integrated Habit Tracking
The Habits page combines habit management with monthly tracking in one view:
- **Grid Layout**: Each habit is a row, each day is a column
- **Click to Complete**: Simply click any day's box to toggle completion
- **Month Navigation**: Browse through months using arrow buttons
- **Automatic Calculations**: XP and streaks update instantly
- **Future Prevention**: Cannot accidentally mark future dates

### Data Structure
Habits now use a `completions` object:
```javascript
{
  id: '1',
  name: 'Morning Meditation',
  icon: '🧘',
  duration: '10 min',
  xp: 20,
  streak: 5,
  completions: {
    '2026-08-25': true,
    '2026-08-26': true,
    '2026-08-27': true,
    '2026-08-28': true,
    '2026-08-29': true,
  }
}
```

### Data Migration
The app automatically migrates old data formats:
- Converts old `completed` and `lastCompleted` fields to new `completions` object
- Recalculates XP based on all historical completions
- Updates streaks based on consecutive completion patterns
- Preserves all existing data during migration

## Navigation

- **Dashboard** → Today's overview and quick habit completion
- **Habits** → Integrated habit management and monthly tracking
- **Goals** → Goal setting and progress tracking (independent from habits)
- **Profile** → User settings and statistics

## Leveling System
- Level 1: Beginner (0 XP)
- Level 2: Explorer (100 XP)
- Level 3: Adventurer (250 XP)
- Level 4: Achiever (500 XP)
- Level 5: Champion (1000 XP)
- Level 6: Master (2000 XP)
- Level 7: Legend (4000 XP)

## Data Persistence
All data is automatically saved to LocalStorage:
- User profile (name, XP, level)
- Habits with completion history
- Goal progress
- Theme preference
- Weekly progress tracking

Data persists across page refreshes and browser sessions.

## Responsive Design
- **Desktop**: Full monthly grid with all days visible
- **Tablet**: Optimized grid with horizontal scrolling if needed
- **Mobile**: Habit names stay fixed, dates scroll horizontally

## Streak Calculation
Streaks are calculated by counting consecutive days backward from today (or yesterday if today isn't complete yet). The calculation:
1. Checks if today or yesterday is completed
2. Counts backwards through consecutive completed days
3. Stops at the first incomplete day
4. Updates automatically on every completion toggle

## XP System
- Each habit has a customizable XP reward (10-100 XP)
- XP is awarded when marking a habit complete
- XP is removed when unmarking a completion
- Total XP is sum of all completions across all time
- Level up happens automatically when XP thresholds are reached

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## Tips for Users

1. **Track Multiple Habits**: View all your habits on one monthly grid
2. **Build Consistency**: Complete habits daily to build impressive streaks
3. **Review History**: Use month navigation to see your progress over time
4. **Set Goals Separately**: Use the Goals page for larger objectives
5. **Check Dashboard Daily**: Quick overview of today's tasks

## What's New (v2.0)

### Integrated Habit Tracking
- ✅ Merged Habits and Monthly Tracker into one unified page
- ✅ Grid-based monthly view with habits as rows, days as columns
- ✅ Click any day to toggle habit completion
- ✅ Month navigation with historical data
- ✅ Automatic data migration from old format
- ✅ Real-time XP and streak updates
- ✅ Goals remain completely separate

### Removed
- ❌ Separate Monthly Tracker page (functionality now in Habits)

## Development Notes

### Adding New Features
- Habits and Goals are completely independent
- Habit completions use date strings as keys (YYYY-MM-DD format)
- XP recalculation happens on every completion toggle
- Streaks are calculated from the completions object
- Data migrations run automatically on app load

### Data Safety
- All operations preserve existing data
- Migration function safely converts old formats
- XP is recalculated from actual completions, not stored totals
- Deleting a habit removes its XP contribution

## License
Personal use - Educational project

## Credits
Built with modern web technologies and gamification principles to make productivity engaging and rewarding.

---

**Small actions. Big transformation.** ⚡
