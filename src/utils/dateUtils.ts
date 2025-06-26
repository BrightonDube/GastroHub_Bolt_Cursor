// Utility to get a human-readable 'X days ago' string from a given date
export function getDaysAgoString(date: Date): string {
  const today = new Date();
  // Zero out the time for accurate day difference
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today.getTime() - inputDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
} 