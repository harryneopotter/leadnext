/**
 * Determines whether a URL is safe for redirection.
 *
 * A safe URL is a relative path that begins with exactly one forward slash (`/`)
 * and is not followed immediately by a second forward slash (`/`) or a backslash (`\`).
 * Falsy inputs (`null`, `undefined`, or empty string) are considered unsafe.
 *
 * @param url - The URL to validate; may be `null` or `undefined`.
 * @returns `true` if `url` is a safe relative path as described, `false` otherwise.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  // Ensure it starts with / and not // or /\
  return /^\/(?!\/|\\)/.test(url);
}
