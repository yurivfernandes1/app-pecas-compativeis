export function getObjectPosition(url: string): string {
  if (!url) return 'center';
  const match = url.match(/[?&]pos=([\d.]+),([\d.]+)/);
  if (match) {
    return `${match[1]}% ${match[2]}%`;
  }
  return 'center';
}
