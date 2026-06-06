"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "Overview",
    href: "/",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1.25" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1.25" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1.25" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.25" />
      </svg>
    ),
  },
  {
    label: "Payments",
    href: "/payments",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
        <path d="M1.5 6.5h13" strokeLinecap="round" />
        <path d="M4.5 9.5h3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const path = usePathname();

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 9.5L7 2l1.5 4.5H12L7 12l1.5-4.5H2Z"
              fill="#000000"
              strokeWidth="0"
            />
          </svg>
        </div>
        <span className="sidebar-logo-text">
          Chain<span>Pay</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${isActive(item.href) ? " active" : ""}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link href="/payments/new" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 1v10M1 6h10" strokeLinecap="round" />
          </svg>
          New Payment
        </Link>
      </div>
    </aside>
  );
}
