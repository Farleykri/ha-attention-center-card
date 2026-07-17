const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatDurationSince(activeSinceMs: number, nowMs = Date.now()): string {
  const elapsed = Math.max(0, nowMs - activeSinceMs);
  if (elapsed < MINUTE) {
    return "<1m";
  }
  if (elapsed < HOUR) {
    return `${Math.floor(elapsed / MINUTE)}m`;
  }
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    const minutes = Math.floor((elapsed % HOUR) / MINUTE);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  const days = Math.floor(elapsed / DAY);
  const hours = Math.floor((elapsed % DAY) / HOUR);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}
