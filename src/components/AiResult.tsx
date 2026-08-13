import { Check, Copy, Info, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 text-xs text-muted-foreground">
      <Info className="mt-px size-3.5 shrink-0" />
      AI-generated content may require human review.
    </p>
  );
}

export function ResultPanel({
  loading,
  error,
  result,
  emptyHint,
}: {
  loading: boolean;
  error: string | null;
  result: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" />
          AI Output
        </div>
        {result && !loading && (
          <Button variant="ghost" size="sm" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>

      <div className="px-5 py-5">
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              KAT is drafting your output…
            </div>
            {[92, 100, 74, 88, 60].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-full bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && !error && !result && (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        )}

        {!loading && !error && result && (
          <>
            <div className="prose-kat">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <div className="mt-6 border-t border-border pt-3">
              <Disclaimer />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
