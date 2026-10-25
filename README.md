# LIFE OS: Personal Command Center & Life Management System

> A private, responsive, distraction-resistant personal life-management website designed specifically for engineering students preparing for placements, building an athletic physique, and maintaining disciplined mental well-being without guilt or toxic positivity.

---

## 🧭 Live Dev Server
The development server is running locally:
- **Local URL**: `http://localhost:5173/`
- **Recommended Workspace**: Set `/Users/tarunrookie/.gemini/antigravity/scratch/life-os` as your active workspace in your editor.

---

## 🌟 Core Modules & Architecture

### 1. Dashboard (`/`)
- **Today's Perspective**: Curated calm, realistic daily reflections focused on engineering discipline, sleep recovery, and placement stamina.
- **Daily Goals & Snapshot**: Focused study hours vs target, DSA problems solved (distinguishing pure independent solves), habit completion percentage, and distraction minutes.
- **Interactive Habit Checklist**: 1-click toggling with built-in **Missed-Day Recovery** (missing a single day doesn't wipe out your momentum).
- **Weekly Consistency Score**: Composite score factoring habit execution (40%), study time (30%), workout & sleep recovery (20%), and focus boundary control (10%).

### 2. Daily Habits & Streaks (`/habits`)
- **Default Core Habits**:
  1. DSA Practice (1-2 Problems)
  2. Placement Prep (Core CS / Revision)
  3. Project Work / Engineering
  4. Gym Workout or Badminton
  5. Evening Journal & Check-in
  6. Healthy Sleep Routine (7-8h)
  7. Limited Unplanned Social Media
  8. Intentional Social Interactions
- **Custom Habits**: Create, edit, and delete custom routines with color themes and categories.
- **7-Day Strip & Month Heatmap**: Visual feedback of daily consistency with recovered streak protections.

### 3. Career, DSA & Placement Command (`/career`)
- **DSA Problem Journal**: Name, Platform (LeetCode, Striver Sheet, NeetCode, Codeforces, etc.), Topic, Difficulty (Easy, Medium, Hard), Status (*Solved Independently*, *With Hints / Editorial*, *Needs Review*), time spent, key patterns, and revision flags.
- **Honest Metrics**: Tracks distinct count of pure independent solves—never equating opening a solution video with solving a problem.
- **Study Sessions & Bar Chart**: Visual 7-day study bar chart with daily target indicator.
- **Struggling Topics & Revision**: Weak algorithmic topics categorized with confidence levels (1 to 5) and status cycles (*Needs Revision*, *Revising*, *Mastered*).
- **Placement Pipeline**: Application tracker for campus and off-campus roles (Company, Role, OA deadlines, Technical Rounds, HR, Compensation, and Notes).
- **Portfolio Projects**: Milestone checklists with completion progress bars.

### 4. Mindset, Mood & Daily Journal (`/mood`)
- **Fast 2-Minute Reflection**:
  - Mood (1–10 slider)
  - Energy (1–10 slider)
  - Stress (1–10 slider)
  - Sleep duration & consistency
  - Dominant emotion
  - 3 Reflection prompts: *What went well today?*, *What made today difficult?*, *One small improvement for tomorrow?*
- **Trend Charts**: Dual-axis SVG visualization of Mood, Energy, and Stress over 7, 14, or 30 days.
- **Pattern Discovery**: Automatically surfaces correlations between restorative sleep and daytime mental clarity.
- **Local & Private**: Stored on-device; never forwarded to external telemetry.

### 5. Social Life & Attention Protection (`/social`)
- **Balance, Not Isolation**: Helps you preserve deep study blocks while enjoying intentional friendships.
- **Tracking Parameters**:
  - Chat & social duration (minutes)
  - Planned vs Unplanned
  - Interrupted study? (Yes/No)
  - Felt afterward (Connected, Energized, Neutral, Drained, Guilty)
  - Maintained priorities? (Yes/No)
  - Private notes (no contact scraping, no surveillance)
- **Attention Health Ratio**: Compares planned vs unplanned chatter and highlights study leaks.

### 6. Fitness, Athletic Body & Sleep (`/fitness`)
- **Physique Progress**: Body weight tracking with 14-day trend curve.
- **Key Measurements**: Chest, waist (lean indicator), and arm circumference.
- **Workout Sessions**: Customizable resistance exercises (sets, reps, weight) with 1-click **Skip Exercise** functionality.
- **Cardio & Badminton**: Duration and intensity log.
- **Circadian Rest**: Sleep duration and consistency rating (*Excellent*, *Good*, *Irregular*, *Poor*).

### 7. Analytics & Weekly Retrospective (`/analytics`)
- **Honest Weekly Scorecard**:
  - Total focused study hours
  - DSA problems independently solved
  - Habit completion %
  - Workout frequency
  - Average sleep & mood
  - Unplanned chat / distraction time
- **Feedback & Synergy**: Most consistent habits vs areas needing realistic attention.
- **3 Realistic Priorities**: Lock in next week's 3 core priorities with personal retrospective notes.

### 8. 30 / 90-Day Goals (`/goals`)
- **Timeframe Sprints**: Toggle between 30-day and 90-day views.
- **Goal Cards**: Start and target dates, categorized milestones with checklists, daily/weekly actionable routines, progress bars, and resilience notes.

### 9. Settings & Local Data Vault (`/settings`)
- **Target Customization**: Adjust daily study target, DSA target, workout count, and sleep window.
- **Backup & Restore**: Download full JSON backups and restore on any device with instant validation.
- **Demo Sandbox Mode**: Load realistic engineering student sample data to preview all charts and analytics.
- **Clean Reset**: Clear all records back to a fresh slate.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom obsidian/slate dark theme tokens
- **Icons**: Lucide React
- **Visuals & Charts**: Custom, zero-dependency, responsive SVG charts (Bar Chart, Line Trend Chart, Activity Heatmap, Donut Progress Ring)
- **Persistence Layer**: Repository Pattern (`IStorageService` implemented via `LocalStorageService`) ensuring that switching to IndexedDB, SQLite, or Supabase in the future requires modifying only the storage adapter.
- **Bundler**: Vite 5
