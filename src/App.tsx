import { IconBraces, IconCheck, IconCopy, IconRss } from "@tabler/icons-react";
import { useState } from "react";
import ChangelogJson from "../data/changelog.json";
import ChangelogItem from "./components/ChangelogItem";
import Layout from "./components/Layout";

const feedUrl = `${window.location.origin}/feed.xml`;
const jsonFeedUrl = `${window.location.origin}/changelog.json`;

export default function App() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <Layout className="flex w-dvw flex-col gap-8 px-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <a href={feedUrl} target="_blank" aria-label="Atom Feed">
            <IconRss size={20} />
          </a>
          <div className="flex items-center gap-2 overflow-x-auto rounded bg-gray-200 px-3 py-1 font-mono text-gray-600">
            <span className="whitespace-nowrap">{feedUrl}</span>
          </div>
          <button
            onClick={() => copyToClipboard(feedUrl)}
            aria-label="Copy Atom feed URL"
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          >
            {copiedUrl === feedUrl ? (
              <IconCheck size={20} />
            ) : (
              <IconCopy size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a href={jsonFeedUrl} target="_blank" aria-label="JSON Feed">
            <IconBraces size={20} />
          </a>
          <div className="flex items-center gap-2 overflow-x-auto rounded bg-gray-200 px-3 py-1 font-mono text-gray-600">
            <span className="whitespace-nowrap">{jsonFeedUrl}</span>
          </div>
          <button
            onClick={() => copyToClipboard(jsonFeedUrl)}
            aria-label="Copy JSON feed URL"
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          >
            {copiedUrl === jsonFeedUrl ? (
              <IconCheck size={20} />
            ) : (
              <IconCopy size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        {ChangelogJson.map((entry) => (
          <ChangelogItem
            key={entry.version}
            version={entry.version}
            publishedAt={entry.publishedAt}
            content={entry.content}
          />
        ))}
      </div>
    </Layout>
  );
}
