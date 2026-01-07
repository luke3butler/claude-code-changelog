import { Feed } from "feed";
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";
import ChangelogJson from "../data/changelog.json";

const SITE_URL =
  process.env.SITE_URL || "https://claude-code-changelog.pages.dev";

function parseChanges(content: string): string[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

const feed = new Feed({
  title: "Claude Code Changelog",
  id: SITE_URL,
  copyright: "All rights reserved 2025, Luke",
});

await Promise.all(
  ChangelogJson.slice(0, 50).map(async (item, i) => {
    const publishedAt: Date = (() => {
      if (item.publishedAt) {
        return new Date(item.publishedAt);
      }

      let count = 1;
      while (true) {
        const nextItem = ChangelogJson[i + count];
        if (!nextItem) {
          return new Date();
        }
        if (nextItem.publishedAt) {
          return new Date(nextItem.publishedAt);
        }

        count++;
      }
    })();

    feed.addItem({
      title: item.version,
      link: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#${item.version.replaceAll(".", "")}`,
      date: publishedAt,
      content: await marked.parse(item.content),
    });
  }),
);

fs.writeFileSync(
  path.join(process.cwd(), "public", "feed.xml"),
  feed.atom1() + "\n",
);

// Generate structured JSON for 3rd party integrations
const jsonFeed = {
  updated: new Date().toISOString(),
  entries: ChangelogJson.slice(0, 50).map((item, i) => {
    const publishedAt: string | null = (() => {
      if (item.publishedAt) {
        return item.publishedAt;
      }
      let count = 1;
      while (true) {
        const nextItem = ChangelogJson[i + count];
        if (!nextItem) {
          return new Date().toISOString();
        }
        if (nextItem.publishedAt) {
          return nextItem.publishedAt;
        }
        count++;
      }
    })();

    const changes = parseChanges(item.content);
    return {
      version: item.version,
      link: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#${item.version.replaceAll(".", "")}`,
      publishedAt,
      changes,
      changeCount: changes.length,
    };
  }),
};

fs.writeFileSync(
  path.join(process.cwd(), "public", "changelog.json"),
  JSON.stringify(jsonFeed, null, 2) + "\n",
);
