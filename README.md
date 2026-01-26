# Job Watcher

## Problem
I have recently started hunting for my next job. What I observed is that not all companies post their job openings on Linkedin and other similar platforms. I also have a list of companies that I would like to work for and they unfortunetly do not have an open position for me at the moment. So what can I do? Open their website every week, with the hope that they will have something for me? This sounds really time consuming. This is why I developed (or better said - vibe coded) the Job Watcher.

## Solution
It is a simple bot that goes through a list of companies (saved in private-config.json - not commited to git), scrapes their career pages and sends me an email when a new job is published. There is a GitHub Actions workflow that triggers the script to run once a day, and sends the email.

## Technical implementation
TBD
