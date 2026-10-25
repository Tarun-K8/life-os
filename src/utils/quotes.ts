export interface DailyReflection {
  quote: string;
  source: string;
  context: string;
}

export const REALISTIC_REFLECTIONS: DailyReflection[] = [
  {
    quote: "A single problem understood from first principles beats five solutions memorized blindly.",
    source: "Engineering Principle",
    context: "Focus on why an algorithm works, not just getting the green tick."
  },
  {
    quote: "Missing a day is an event, not your identity. The next choice you make defines the trajectory.",
    source: "Habit Psychology",
    context: "No guilt. Just resume your standard routine today."
  },
  {
    quote: "Consistency is not 100% every day. It is showing up for 30 minutes on days you only have 20% to give.",
    source: "Discipline Mindset",
    context: "Lower the barrier to start when resistance is high."
  },
  {
    quote: "Distractions are not personal flaws; they are symptoms of friction, fatigue, or boredom.",
    source: "Attention Design",
    context: "Notice what triggers the urge to scroll or chat, then remove that friction."
  },
  {
    quote: "An athletic physique and sharp mental clarity are built by compounding recovery and sleep, not burnout.",
    source: "Physical Readiness",
    context: "Sleep is where learning consolidates and muscle recovers."
  },
  {
    quote: "Placements test resilience and calm problem-solving under uncertainty, not your self-worth.",
    source: "Career Perspective",
    context: "Treat every OA and interview as an iteration loop, not a final verdict."
  },
  {
    quote: "True social balance is enjoying intentional conversations without letting unconscious tab-switching rob your focus.",
    source: "Digital Minimalism",
    context: "Deep work when working, deep presence when connecting."
  }
];

export function getTodayReflection(dateStr: string): DailyReflection {
  // Deterministic daily reflection based on date hash
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % REALISTIC_REFLECTIONS.length;
  return REALISTIC_REFLECTIONS[index];
}
