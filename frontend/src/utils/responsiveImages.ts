type KnownImage = {
  width: number;
  height: number;
  variantWidths: number[];
  variantDir?: string;
};

type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

const KNOWN_IMAGES: Record<string, KnownImage> = {
  '/images/about.webp': { width: 1400, height: 933, variantWidths: [480, 800, 1200], variantDir: '/images/responsive' },
  '/images/hero.webp': { width: 1240, height: 827, variantWidths: [480, 800], variantDir: '/images/responsive' },
  '/images/events/crossing-strings.webp': { width: 1920, height: 1280, variantWidths: [480, 768, 1024, 1600], variantDir: '/images/events/responsive' },
  '/images/events/julian-polak.webp': { width: 3000, height: 1414, variantWidths: [480, 768, 1024, 1600], variantDir: '/images/events/responsive' },
  '/images/events/michael-fix.webp': { width: 1920, height: 1281, variantWidths: [480, 768, 1024, 1600], variantDir: '/images/events/responsive' },
  '/images/events/peter-kern.webp': { width: 1920, height: 1920, variantWidths: [480, 768, 1024, 1600], variantDir: '/images/events/responsive' },
};

const withBase = (path: string) => `${BASE}${path}`;

const splitFilename = (path: string) => {
  const segments = path.split('/');
  const filename = segments.at(-1) ?? '';
  const dotIndex = filename.lastIndexOf('.');
  const name = dotIndex >= 0 ? filename.slice(0, dotIndex) : filename;
  const ext = dotIndex >= 0 ? filename.slice(dotIndex + 1) : 'webp';
  return { name, ext };
};

export const getResponsiveImage = (path?: string | null, sizes?: string): ResponsiveImage | null => {
  if (!path) return null;
  if (path.startsWith('http')) return { src: path, sizes };

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const image = KNOWN_IMAGES[normalizedPath];
  const src = withBase(normalizedPath);

  if (!image || !image.variantDir) {
    return { src, sizes };
  }

  const { name, ext } = splitFilename(normalizedPath);
  const variants = image.variantWidths
    .map((width) => `${withBase(`${image.variantDir}/${name}-${width}.${ext}`)} ${width}w`)
    .join(', ');

  const srcset = `${variants}, ${src} ${image.width}w`;

  return {
    src,
    srcset,
    sizes,
    width: image.width,
    height: image.height,
  };
};
