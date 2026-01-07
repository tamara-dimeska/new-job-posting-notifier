import { scrapeJobs } from "./scrape";
import { isNewJob } from "./db";
import { notifyNewJobs } from "./notify";

const CAREERS_URL = "https://google.com";

async function run() {
  const jobs = await scrapeJobs(CAREERS_URL);

  const newJobs = jobs.filter(job =>
    isNewJob(job)
  );

  if (newJobs.length > 0) {
    notifyNewJobs(newJobs);
  } else {
    console.log("No new jobs today.");
  }
}

run().catch(console.error);
