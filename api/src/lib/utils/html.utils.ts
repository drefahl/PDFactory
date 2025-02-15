export function isValidHtml(html: string) {
  return /<[^>]+>/.test(html)
}
