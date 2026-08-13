import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Disclaimer, ResultPanel } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | KAT AI Assistant" },
      {
        name: "description",
        content:
          "Turn a messy to-do list into a prioritized, timeboxed daily plan with effort estimates.",
      },
      { property: "og:title", content: "AI Task Planner | KAT AI Assistant" },
      {
        property: "og:description",
        content: "Prioritization and scheduling for your workday, powered by AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("6");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tasks.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await run({ data: { tasks, hours, goal } });
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
        icon={CalendarCheck}
        title="AI Task Planner"
        description="Dump everything on your plate. KAT ranks it, estimates effort and builds a realistic schedule."
      />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={10}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish board deck\nReview 3 PRs\nCall supplier about delayed order"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours">Focus hours available</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={14}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Top goal (optional)</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ship the pricing page"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading || !tasks.trim()} className="w-full">
            <Wand2 className="size-4" />
            {loading ? "Planning…" : "Build my plan"}
          </Button>
          <Disclaimer />
        </form>

        <ResultPanel
          loading={loading}
          error={error}
          result={result}
          emptyHint="You'll get a priority ranking, a timeboxed schedule and delegate/drop suggestions."
        />
      </div>
    </AppShell>
  );
}
