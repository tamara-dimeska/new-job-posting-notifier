import Database from "better-sqlite3";
import { Job } from "./types";
import { createJobKey } from "./utils/jobKey";

export const db = new Database("jobs.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS jobs (
    job_key TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

export function isNewJob(job: Job): boolean {
  const jobKey = createJobKey(job.company, job.title, job.url);

  const row = db.prepare("SELECT 1 FROM jobs WHERE job_key = ?").get(jobKey);

  if (row) return false;

  db.prepare(
    `
    INSERT INTO jobs (job_key, company, title, url)
    VALUES (?, ?, ?, ?)
  `
  ).run(jobKey, job.company, job.title, job.url);

  return true;
}

export function closeDatabase(): void {
  db.close();
}
