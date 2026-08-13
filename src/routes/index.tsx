import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarCheck, Mail, NotebookPen, Search, Sparkles } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/AiResult";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAT AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work: generate emails, summarize meetings, plan tasks and research faster with KAT AI.",
      },
      { property: "og:title", content: "KAT AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "One AI workspace for emails, meeting notes, task planning and research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Tone- and audience-aware drafts with subject line options.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Key points, decisions, owners and deadlines from raw notes.",
  },
  {
    to: "/tasks",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Priority ranking plus a realistic, timeboxed day plan.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings with insights, risks and next steps.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "KAT Chat",
    body: "Conversational help for anything else on your plate.",
  },
] as const;

const STATS = [
  { label: "Workflows automated", value: "5" },
  { label: "Avg. draft time", value: "~15s" },
  { label: "Structured outputs", value: "100%" },
];

function Dashboard() {
  return (
    <AppShell>
      <section className="surface-grid border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI workspace for professionals
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Do a full day of admin work before your coffee gets cold.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            KAT turns the repetitive parts of your job — emails, meeting notes, planning and
            research — into structured, review-ready output.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Draft an email <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Open KAT Chat
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background p-4">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h2 className="text-lg font-semibold tracking-tight">Your AI toolkit</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Disclaimer />
        </div>
      </section>
    </AppShell>
  );
}
