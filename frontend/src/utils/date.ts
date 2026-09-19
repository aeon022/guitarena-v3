export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const isPast = (date: Date): boolean => {
  return date.getTime() < Date.now();
};

// Spielzeit-Jahr: Jahr des nächsten Konzerts, sonst des letzten (statt hartem Kalenderjahr, wichtig um den Jahreswechsel)
export const seasonYear = (dates: Date[]): number => {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  return (sorted.find((d) => !isPast(d)) ?? sorted.at(-1))?.getFullYear() ?? new Date().getFullYear();
};

export const isUpcoming = (date: Date): boolean => {
  return !isPast(date);
};
