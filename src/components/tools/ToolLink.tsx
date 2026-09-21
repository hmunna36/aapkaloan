"use client";

import type { ReactNode } from "react";

/** Event the tools panel listens for, so a click works even when the hash is unchanged. */
export const TOOL_EVENT = "akl:tool";

/**
 * Link to a tool in the homepage tools panel.
 *
 * A plain hash link isn't enough: Next's client-side navigation updates the URL
 * through the History API, which doesn't fire `hashchange`, so the panel would
 * never react. This sets the hash for shareable links *and* dispatches an event
 * the panel listens for — which also covers clicking the same link twice.
 */
export function ToolLink({ tool, className, children }: { tool: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#tool-${tool}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        history.replaceState(null, "", `#tool-${tool}`);
        window.dispatchEvent(new CustomEvent(TOOL_EVENT, { detail: tool }));
      }}
    >
      {children}
    </a>
  );
}
