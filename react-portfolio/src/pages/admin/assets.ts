export function filenameFromUrl(url: string): string {
  const clean = url.split('?')[0].split('#')[0];
  return clean.split('/').filter(Boolean).pop() || 'asset';
}

export function formatSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
