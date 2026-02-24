export function replaceTemplatePlaceholders(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function textToHtml(text: string): string {
  return text
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}
