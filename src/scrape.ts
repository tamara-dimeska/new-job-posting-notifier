import { chromium } from "playwright";
import { Job } from "./types";

export async function scrapeJobs(careersUrl: string): Promise<Job[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(careersUrl, { waitUntil: "networkidle" });

  // ⚠️ This selector is company-specific, needs to be updated once we have a better pattern
  const jobs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"));
    return links
      .filter((a) => a.textContent && a.href.includes("/positions/"))
      .map((a) => ({
        title: a.textContent!.trim(),
        url: a.href,
      }));
  });

  await browser.close();
  return jobs;
}
