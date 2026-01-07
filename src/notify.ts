import { Job } from "./types";

export function notifyNewJobs(jobs: Job[]) {
  console.log("🚨 New jobs found:");
  for (const job of jobs) {
    console.log(`- ${job.title}`);
    console.log(`  ${job.url}`);
  }
}
