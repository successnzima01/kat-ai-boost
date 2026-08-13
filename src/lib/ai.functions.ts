import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runPrompt } from "./ai-run.server";

const EmailInput = z.object({
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  length: z.string().min(1),
  context: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => EmailInput.parse(i))
  .handler(async ({ data }) =>
    runPrompt({
      system:
        "You are a senior executive communications specialist. Write workplace emails that are precise, professional and free of filler. Never invent facts; use [bracketed placeholders] for unknown details.",
      prompt: `Write a workplace email.

PURPOSE: ${data.purpose}
AUDIENCE: ${data.audience}
TONE: ${data.tone}
LENGTH: ${data.length}
CONTEXT/NOTES: ${data.context || "none provided"}

OUTPUT FORMAT (markdown):
**Subject:** <compelling, specific subject line>

<email body with greeting, 1-3 tight paragraphs, clear call to action, professional sign-off>

---
**Alternative subject lines:** three options as a bullet list.`,
    }),
  );

const NotesInput = z.object({ notes: z.string().min(1) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => NotesInput.parse(i))
  .handler(async ({ data }) =>
    runPrompt({
      system:
        "You are a meticulous chief of staff who turns raw meeting notes into structured, decision-ready summaries. Only use information present in the notes; mark gaps as 'Not specified'.",
      prompt: `Summarize the meeting notes below.

RAW NOTES:
"""
${data.notes}
"""

OUTPUT FORMAT (markdown, use these exact headings):
## Executive Summary
Two to three sentences.

## Key Discussion Points
Bullet list.

## Decisions Made
Bullet list.

## Action Items
A markdown table with columns: Action | Owner | Deadline | Priority.

## Risks & Open Questions
Bullet list.`,
    }),
  );

const TaskInput = z.object({
  tasks: z.string().min(1),
  hours: z.string().min(1),
  goal: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => TaskInput.parse(i))
  .handler(async ({ data }) =>
    runPrompt({
      system:
        "You are an expert productivity coach applying the Eisenhower matrix, timeboxing and realistic effort estimation. Be concrete and never overload a day.",
      prompt: `Build a prioritized work plan.

TASK LIST:
"""
${data.tasks}
"""
AVAILABLE FOCUS HOURS TODAY: ${data.hours}
PRIMARY GOAL: ${data.goal || "not specified"}

OUTPUT FORMAT (markdown, use these exact headings):
## Priority Ranking
A table: # | Task | Priority (P1-P3) | Est. Effort | Why it ranks here.

## Suggested Schedule
A table: Time Block | Task | Focus Type (Deep/Shallow/Admin).

## Delegate or Drop
Bullet list.

## Momentum Tip
One sentence.`,
    }),
  );

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.string().min(1),
  angle: z.string().optional(),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => ResearchInput.parse(i))
  .handler(async ({ data }) =>
    runPrompt({
      system:
        "You are a business research analyst. Give balanced, structured briefings. Clearly label anything uncertain or time-sensitive rather than stating it as fact. You do not have live web access, so flag where verification is needed.",
      prompt: `Produce a research briefing.

TOPIC: ${data.topic}
DEPTH: ${data.depth}
ANGLE / DECISION CONTEXT: ${data.angle || "general professional overview"}

OUTPUT FORMAT (markdown, use these exact headings):
## Overview
## Key Insights
Numbered list, each with a one-line "So what?".
## Opportunities & Risks
Two bullet lists.
## Recommended Next Steps
Numbered list.
## Verify Before Acting
Bullet list of claims that need up-to-date sources.`,
    }),
  );

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

export const chatWithKat = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => ChatInput.parse(i))
  .handler(async ({ data }) =>
    runPrompt({
      system:
        "You are KAT, an AI workplace productivity assistant. You help professionals draft communication, plan work, summarize information and think through decisions. Be concise, structured and practical. Use markdown. Ask a clarifying question when the request is ambiguous.",
      messages: data.messages,
    }),
  );
