import "dotenv/config";
import { loadConfig } from "./config";
import { scrapeJobs } from "./scrape";
import { isNewJob } from "./db";
import { sendJobEmail, sendNoJobsEmail } from "./notify/email";
import { Job } from "./types";

async function run() {
  const companies = loadConfig();
  const newJobs: Job[] = [];

  for (const company of companies) {
    console.log(`🔍 Checking...`);
    // console.log(`🔍 Checking ${company.name}`);

    try {
      const jobs = await scrapeJobs(company);

      for (const job of jobs) {
        if (isNewJob(job)) {
          newJobs.push(job);
        }
      }
    } catch (error) {
      console.error(
        // `⚠️  Failed to scrape ${company.name}:`,
        "⚠️ Failed to scrape, continuing with next company",
        // error instanceof Error ? error.message : error
      );
      // Continue with next company
    }
  }

  if (newJobs.length > 0) {
    console.log(`📧 Sending email for ${newJobs.length} new job(s)`);
    await sendJobEmail(newJobs);
  } else {
    console.log("No new job postings found today.");
    await sendNoJobsEmail();
  }
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
