import { createHash } from "crypto";

export function normalizeUrl(rawUrl: string, baseUrl?: string) {
  const url = new URL(rawUrl, baseUrl);
  url.search = ""; // remove tracking params
  url.hash = "";
  return url.toString();
}

export function createJobKey(company: string, title: string, rawUrl: string) {
  const normalizedUrl = normalizeUrl(rawUrl);

  const keySource = `${company}|${title.trim()}|${normalizedUrl}`;
  return createHash("sha256").update(keySource).digest("hex");
}
