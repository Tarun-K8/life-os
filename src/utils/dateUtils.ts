// Date utilities for LIFE OS

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDayOfWeek(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'narrow' });
}

export function getPastDates(count: number, endDateStr?: string): string[] {
  const dates: string[] = [];
  const end = endDateStr ? new Date(endDateStr) : new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

export function getCurrentWeekDates(): { date: string; dayName: string; isToday: boolean }[] {
  const todayStr = getTodayString();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
  
  // Calculate Monday of current week
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    week.push({
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: dateStr === todayStr,
    });
  }
  return week;
}

/**
 * Calculates current streak with a realistic "Missed-Day Recovery" mechanism.
 * If you miss yesterday, but were consistent before and complete today,
 * your momentum is protected rather than reset to zero.
 */
export function calculateHabitStreak(
  completions: Record<string, { completed: boolean }>,
  todayStr: string = getTodayString()
): { currentStreak: number; longestStreak: number; recovered: boolean } {
  const past30Days = getPastDates(60, todayStr);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let allowedSkipUsed = false;
  let recovered = false;

  // Check today and iterate backwards for current streak
  const isTodayDone = completions[todayStr]?.completed;
  
  // Start checking backwards from yesterday (or today if completed)
  let checkIndex = past30Days.length - 1;
  if (!isTodayDone) {
    // If today is not done yet, don't penalize streak if yesterday was completed
    checkIndex -= 1;
  }

  let graceDayUsed = false;
  for (let i = checkIndex; i >= 0; i--) {
    const date = past30Days[i];
    const isDone = completions[date]?.completed;

    if (isDone) {
      currentStreak++;
    } else {
      // Missed day recovery: Allow 1 single gap if the previous day was completed
      if (!graceDayUsed && i > 0 && completions[past30Days[i - 1]]?.completed) {
        graceDayUsed = true;
        recovered = true;
        // Don't increment streak for skipped day, but keep the chain alive
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across history
  tempStreak = 0;
  for (let i = 0; i < past30Days.length; i++) {
    const date = past30Days[i];
    if (completions[date]?.completed) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    recovered,
  };
}
