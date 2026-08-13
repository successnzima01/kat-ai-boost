import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Disclaimer } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithKat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "KAT Chat | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with KAT, your AI workplace productivity assistant, for drafting, planning and decision support.",
      },
      { property: "og:title", content: "KAT Chat | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday professional work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Help me prepare for a difficult performance conversation",
  "Draft an agenda for a 30-minute project kickoff",
  "How do I say no to extra work without damaging the relationship?",
];

function ChatPage() {
  const run = useServerFn(chatWithKat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        icon={Bot}
        title="KAT Chat"
        description="Your always-on assistant for drafting, planning, summarizing and thinking things through."
      />
      <div className="mx-auto flex max-w-3xl flex-col px-5 py-8 sm:px-8">
        <div className="min-h-[45vh] space-y-5">
          {messages.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
              <Bot className="mx-auto size-8 text-primary" />
              <p className="mt-3 text-sm font-semibold">Start a conversation with KAT</p>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these:</p>
              <div className="mt-4 flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
                <div className="prose-kat">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 pl-11 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              KAT is thinking…
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="sticky bottom-4 mt-6 space-y-3 rounded-2xl border border-border bg-card p-3 shadow-card"
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Ask KAT anything about your work…"
              className="resize-none border-0 shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <SendHorizonal className="size-4" />
            </Button>
          </div>
          <Disclaimer />
        </form>
      </div>
    </AppShell>
  );
}
