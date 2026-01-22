import { chromium } from "playwright";
import { CompanyConfig, Job } from "./types";

export async function scrapeJobs(company: CompanyConfig): Promise<Job[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.goto(company.careersUrl, {
      waitUntil: company.waitNetwork ? "networkidle" : "domcontentloaded",
      timeout: 60000,
    });

    const jobs = await page.evaluate(
      ({ companyName, careersUrl, jobSelectorType, jobLinkSelector }) => {
        const lookForList = [
          "qa",
          "test",
          "testing",
          "automation",
          "sdet",
          "engineer",
          "software",
          "developer",
          "lead",
          "ingenieur",
        ];

        // Map selector types to CSS selectors
        const selectorMap: Record<string, string> = {
          a: "a",
          div: "div",
          "data-test-id": `[data-test-id="${jobLinkSelector}"]`,
          class: `.${jobLinkSelector}`,
        };

        const selector = selectorMap[jobSelectorType] || "a";
        const elements = Array.from(document.querySelectorAll(selector));

        return elements
          .map((el: Element) => {
            const title = el.textContent?.trim() || "";
            const url =
              el instanceof HTMLAnchorElement
                ? el.href
                : el.querySelector("a")?.href || careersUrl;

            return { title, url, company: companyName };
          })
          .filter((job) => {
            // Check if title contains relevant keywords
            const titleLower = job.title.toLowerCase();
            if (!lookForList.some((word) => titleLower.includes(word))) {
              return false;
            }

            // For generic selectors (a, div), verify it matches the jobLinkSelector
            if (jobSelectorType === "a" || jobSelectorType === "div") {
              return (
                job.url.includes(jobLinkSelector) ||
                job.title.includes(jobLinkSelector)
              );
            }

            return true;
          });
      },
      {
        companyName: company.name,
        careersUrl: company.careersUrl,
        jobSelectorType: company.jobSelectorType,
        jobLinkSelector: company.jobLinkSelector,
      }
    );

    return jobs;
  } finally {
    // Always close the browser, even if an error occurs
    await browser.close();
  }
}
