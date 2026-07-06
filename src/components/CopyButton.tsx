"use client";

import { useState } from "react";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-full bg-accent hover:opacity-90 text-white font-bold text-sm px-4 py-2 transition-opacity"
    >
      {copied ? "Скопировано ✓" : label}
    </button>
  );
}
