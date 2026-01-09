import { chromium } from "playwright";
import { CompanyConfig, Job } from "./types";

export async function scrapeJobs(company: CompanyConfig): Promise<Job[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(company.careersUrl, { waitUntil: "networkidle" });

  const jobs = await page.evaluate(
    ({ companyName, jobSelectorType, jobLinkSelector }) => {
      const elements = Array.from(document.querySelectorAll(jobSelectorType));

      return elements
        .map((el: HTMLAnchorElement | HTMLDivElement) => ({
          title: el.textContent?.trim() || "",
          url:
            el instanceof HTMLAnchorElement
              ? el.href
              : el.textContent?.trim() || "",
          company: companyName,
        }))
        .filter((j) => j.title.length > 3 && j.url.includes(jobLinkSelector));
    },
    {
      companyName: company.name,
      jobSelectorType: company.jobSelectorType,
      jobLinkSelector: company.jobLinkSelector,
    }
  );

  await browser.close();
  return jobs;
}
