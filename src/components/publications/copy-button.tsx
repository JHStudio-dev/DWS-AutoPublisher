"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copiar texto",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // El portapapeles no está disponible; no se hace nada.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="dws-copy-button rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
