"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Getting Started",
    items: [
      { name: "Introduction", href: "/docs/introduction" },
      { name: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Integration",
    items: [
      { name: "API Reference", href: "/docs/api-reference" },
      { name: "Widget SDK", href: "/docs/widget-sdk" },
    ],
  },
  {
    title: "Deployment",
    items: [
      { name: "Self-Hosted VPS", href: "/docs/deployment" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      <div>
        {/* Brand Logo */}
        <Link href="/docs/introduction" className="sidebar-logo">
          <div className="logo-box">
            <span>C</span>
          </div>
          <span className="logo-text">
            Chain<span>Pay</span>
            <span className="logo-badge">[DOCS]</span>
          </span>
        </Link>

        {/* Navigation Categories */}
        <nav className="sidebar-nav">
          {navigationItems.map((category, catIdx) => (
            <div key={catIdx} className="sidebar-group">
              <span className="sidebar-group-title">
                {category.title}
              </span>
              <ul className="sidebar-list">
                {category.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        className={`sidebar-link ${isActive ? "active" : ""}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer console shortcut */}
      <div className="sidebar-footer">
        <a
          href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000"}
          className="sidebar-footer-link"
        >
          <span>&larr;</span> Enter Merchant Console
        </a>
      </div>
    </aside>
  );
}
