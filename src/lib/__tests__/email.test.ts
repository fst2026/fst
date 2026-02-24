import { describe, expect, it } from "vitest";
import { escapeHtml, textToHtml } from "../email-template";

describe("email sanitization", () => {
  it("escapes potentially dangerous html", () => {
    const payload = `<img src=x onerror="alert('xss')">`;
    const escaped = escapeHtml(payload);

    expect(escaped).not.toContain("<img");
    expect(escaped).toContain("&lt;img");
    expect(escaped).toContain("&quot;");
  });

  it("renders text paragraphs with escaped html", () => {
    const html = textToHtml("Czesc <b>Jan</b>\nlinia 2");

    expect(html).toContain("<p>");
    expect(html).toContain("Czesc &lt;b&gt;Jan&lt;/b&gt;");
    expect(html).toContain("<br/>");
    expect(html).not.toContain("<b>Jan</b>");
  });
});
