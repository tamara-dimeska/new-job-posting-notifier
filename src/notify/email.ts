import nodemailer from "nodemailer";
import { Job } from "../types";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendJobEmail(jobs: Job[]) {
  const subject =
    jobs.length === 1
      ? "New job posting found"
      : `${jobs.length} new job postings found`;

  const body = jobs
    .map((job) => `[${job.company}]\n${job.title}\n${job.url}\n`)
    .join("\n");

  await transporter.sendMail({
    from: `"Job Watcher" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    text: body,
  });
}
