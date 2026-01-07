import type { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function Layout({ className, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <header className="text-center">
        <h1 className="mb-1 text-3xl">Claude Code Changelog</h1>
        <p className="text-sm">
          Unofficial changelog for{" "}
          <a
            className="text-blue-600 underline"
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            rel="noreferrer"
          >
            Claude Code
          </a>
          .
        </p>
      </header>

      <main className={className}>{children}</main>

      <footer className="flex flex-col items-center gap-2">
        <span className="text-sm">&copy; 2025 Luke</span>
        <a
          className="text-blue-600 underline"
          href="https://github.com/luke3butler/claude-code-changelog"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
