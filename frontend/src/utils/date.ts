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

export const isUpcoming = (date: Date): boolean => {
  return !isPast(date);
};
