import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "KAT Chat", icon: Bot },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-4.5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight text-sidebar-accent-foreground">KAT AI</p>
        <p className="text-[11px] text-sidebar-foreground/60">Workplace Assistant</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Brand />
        <NavList />
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
            <p className="text-[11px] leading-relaxed text-sidebar-foreground/70">
              AI-generated content may require human review.
            </p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg border border-border p-2 text-foreground"
        >
          <Menu className="size-4" />
        </button>
        <span className="text-sm font-bold tracking-tight">KAT AI</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-sidebar-foreground/70"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-start gap-4 px-5 py-7 sm:px-8">
        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:flex">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
