"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  snippets: Record<string, string>; // e.g. { curl: "...", node: "..." }
}

export default function CodeBlock({ snippets }: CodeBlockProps) {
  const tabs = Object.keys(snippets);
  const [activeTab, setActiveTab] = useState(tabs[0] || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = snippets[activeTab];
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (tabs.length === 0) return null;

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-block-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`code-block-tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="code-block-copy">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="code-block-body">
        <code>{snippets[activeTab]}</code>
      </pre>
    </div>
  );
}
