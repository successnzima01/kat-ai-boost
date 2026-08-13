import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Disclaimer, ResultPanel } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | KAT AI Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with tone and audience controls powered by KAT AI.",
      },
      { property: "og:title", content: "Smart Email Generator | KAT AI Assistant" },
      {
        property: "og:description",
        content: "Generate polished, audience-aware workplace emails with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Persuasive", "Direct", "Apologetic", "Enthusiastic"];
const AUDIENCES = ["Manager", "Client", "Teammate", "Executive leadership", "Vendor", "New hire"];
const LENGTHS = ["Short (under 100 words)", "Medium (100-180 words)", "Detailed (200+ words)"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!purpose.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await run({ data: { purpose, audience, tone, length, context } });
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
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the intent, pick a tone and audience, and get a ready-to-send draft with subject line options."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="purpose">What is the email about?</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request a two-week extension on the Q3 analytics report"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Key details (optional)</Label>
            <Textarea
              id="context"
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Dates, names, numbers, previous conversation, desired outcome…"
            />
          </div>

          <Button type="submit" disabled={loading || !purpose.trim()} className="w-full">
            <Wand2 className="size-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
          <Disclaimer />
        </form>

        <ResultPanel
          loading={loading}
          error={error}
          result={result}
          emptyHint="Your generated email will appear here, including alternative subject lines."
        />
      </div>
    </AppShell>
  );
}
