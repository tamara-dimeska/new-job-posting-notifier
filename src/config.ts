import fs from "fs";
import path from "path";
import { CompanyConfig } from "./types";

const configPath = path.resolve("private-config.json");

export function loadConfig(): CompanyConfig[] {
  if (!fs.existsSync(configPath)) {
    throw new Error("private-config.json not found");
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const parsed = JSON.parse(raw);

  return parsed.companies as CompanyConfig[];
}
