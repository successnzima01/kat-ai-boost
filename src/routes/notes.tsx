import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Disclaimer, ResultPanel } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | KAT AI Assistant" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into decisions, action items, owners and deadlines with KAT AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | KAT AI Assistant" },
      {
        property: "og:description",
        content: "Structured meeting summaries with key points, actions and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Weekly product sync - attendees: Lerato (PM), Sipho (Eng), Amy (Design)
- Checkout redesign is behind, Sipho says API contract changed
- Amy will ship final mobile mockups Friday
- Decision: postpone launch from 12 Sept to 26 Sept
- Lerato to inform sales team this week
- Open question: do we need legal review for the new refund copy?`;

function NotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await run({ data: { notes } });
      setResult(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. KAT extracts key points, decisions, owners and deadlines."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Raw meeting notes</Label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setNotes(SAMPLE)}>
              Use sample
            </Button>
          </div>
          <Textarea
            id="notes"
            rows={16}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes or transcript here…"
          />
          <Button type="submit" disabled={loading || !notes.trim()} className="w-full">
            <Wand2 className="size-4" />
            {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
          <Disclaimer />
        </form>

        <ResultPanel
          loading={loading}
          error={error}
          result={result}
          emptyHint="You'll get an executive summary, decisions, an action-item table and open risks."
        />
      </div>
    </AppShell>
  );
}
