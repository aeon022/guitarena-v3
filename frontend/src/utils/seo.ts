export const stripMarkdown = (input: string): string => {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/[*_#~-]+/g, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const truncate = (input: string, maxLength = 160): string => {
  if (input.length <= maxLength) return input;

  const shortened = input.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${(lastSpace > 90 ? shortened.slice(0, lastSpace) : shortened).trim()}…`;
};

export const toAbsoluteUrl = (path: string, site: URL | string): string =>
  new URL(path, site).toString();
