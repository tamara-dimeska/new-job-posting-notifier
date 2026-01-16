import Database from "better-sqlite3";
import { Job } from "./types";

export const db = new Database("jobs.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company TEXT,
    title TEXT,
    url TEXT,
    first_seen TEXT
  )
`
).run();

export function isNewJob(job: Job): boolean {
  const row = db.prepare("SELECT 1 FROM jobs WHERE id = ?").get(job.url);

  if (row) return false;

  db.prepare("INSERT INTO jobs VALUES (?, ?, ?, ?, datetime('now'))").run(
    job.url,
    job.company,
    job.title,
    job.url
  );

  return true;
}

export function closeDatabase(): void {
  db.close();
}
