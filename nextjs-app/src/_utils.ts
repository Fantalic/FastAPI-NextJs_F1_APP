export function isWikipediaUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      // Must be wikipedia.* domain (e.g., en.wikipedia.org, de.wikipedia.org)
      const isWikipediaDomain = /^([a-z]+)\.wikipedia\.org$/.test(parsedUrl.hostname);
      return isWikipediaDomain
    } catch (e) {
      return false; // invalid URL
    }
}

export function parseNumberOrString(value: string): number | string {
  const parsed = Number(value);
  // Prüfen, ob parsed eine gültige Zahl ist (nicht NaN)
  if (!isNaN(parsed)) {
    return parsed;
  }
  return value;
}
