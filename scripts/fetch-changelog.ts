import fs from "node:fs";
import path from "node:path";
import versions from "../data/versions.json";

async function fetchChangelog(): Promise<string> {
  const endpoint =
    "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md";

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch changelog: ${response.status} ${await response.text()}`,
    );
  }

  return response.text();
}

type ChangelogEntry = {
  version: string;
  content: string;
  publishedAt: Date | null;
};

async function parseChangelog(content: string): Promise<ChangelogEntry[]> {
  const entries: ChangelogEntry[] = [];
  const lines = content.split("\n");

  let currentVersion: string | null = null;
  const currentContentLines: string[] = [];
  for (const line of lines) {
    // Match version numbers in the format `## x.y.z`
    const versionMatch = line.match(/^## (\d+\.\d+\.\d+)/);
    if (versionMatch) {
      // Save the previous entry if it exists
      if (currentVersion) {
        const publishedAt = new Date(
          versions[currentVersion as keyof typeof versions],
        );
        entries.push({
          version: currentVersion,
          content: currentContentLines.join("\n").trim(),
          publishedAt: Number.isNaN(publishedAt.getTime()) ? null : publishedAt,
        });
      }
      // Start a new entry
      currentVersion = versionMatch[1];
      currentContentLines.length = 0; // Clear the content lines
    } else if (currentVersion) {
      // Accumulate content lines for the current version
      currentContentLines.push(line);
    }
  }

  // Save the last entry if it exists
  if (currentVersion) {
    entries.push({
      version: currentVersion,
      content: currentContentLines.join("\n").trim(),
      publishedAt: new Date(versions[currentVersion as keyof typeof versions]),
    });
  }

  return entries;
}

// ---

// Fetch the latest changelog from GitHub
const changelog = await fetchChangelog();

// Parse the changelog into individual entries
const entries = await parseChangelog(changelog);

// Write the parsed entries to a JSON file
fs.writeFileSync(
  path.join(process.cwd(), "data/changelog.json"),
  JSON.stringify(entries, null, 2) + "\n",
);
