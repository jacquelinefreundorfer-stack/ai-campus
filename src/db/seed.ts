import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { bundles, modules, lessons, quizzes, quizQuestions } from "./schema";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL!);
const d = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...");

  // ── Bundle 1: AI & Generative AI Practitioner ──────────────────────────────

  const [bundle1] = await d
    .insert(bundles)
    .values({
      title: "AI & Generative AI Practitioner",
      subtitle: "Master the essential AI skillset for the modern economy",
      description:
        "A comprehensive program covering prompt engineering, AI agents, custom GPTs, LLM application development, RAG, AI ethics, and building production AI tools. Designed for professionals who want to leverage AI in their daily work and build intelligent applications.",
      school: "School of Applied AI",
      priceCents: 14900,
      launchPriceCents: 7900,
      modulesCount: 8,
      hours: 25,
      isPublished: true,
    })
    .returning();

  console.log(`Created bundle #${bundle1.id}: ${bundle1.title}`);

  // ── Module definitions ─────────────────────────────────────────────────────

  const moduleDefinitions = [
    {
      sortOrder: 1,
      title: "Foundations of Prompt Engineering",
      description:
        "Learn the art and science of crafting effective prompts. Master techniques from basic instruction design to advanced chain-of-thought reasoning and multi-step prompt chains.",
      lessons: [
        {
          title: "What Is Prompt Engineering?",
          content: `# What Is Prompt Engineering?

## Introduction

Prompt engineering is the practice of designing and refining text inputs (prompts) to elicit specific, high-quality outputs from large language models (LLMs). As AI systems like GPT-4, Claude, and Gemini become more powerful and widely deployed, prompt engineering has emerged as one of the most valuable skills in the modern professional toolkit.

**Think of a prompt as a programming language for AI.** Just as developers write code to instruct computers, prompt engineers craft natural language to instruct AI models. The difference is that prompts are written in everyday language — but with precise structure, context, and constraints.

## Why Prompt Engineering Matters

In 2024, "prompt engineer" job postings surged by over 500% year-over-year. Organizations across every sector — from healthcare to finance to education — are racing to integrate AI into their workflows. The bottleneck isn't the technology; it's the skill to communicate effectively with these systems.

### Key Benefits

- **Efficiency:** A well-crafted prompt can accomplish in seconds what might take hours of manual effort.
- **Quality:** Precise instructions produce more relevant, accurate, and useful outputs.
- **Consistency:** Standardized prompts ensure reliable results across different users and use cases.
- **Safety:** Thoughtful prompt design helps mitigate hallucination, bias, and harmful outputs.

## The Prompt Engineering Mindset

Effective prompt engineering requires a shift in thinking:

1. **Be explicit, not implicit.** Never assume the model understands context you haven't provided. Spell everything out.
2. **Think in steps.** Complex tasks should be broken into discrete reasoning steps — this is the foundation of chain-of-thought prompting.
3. **Iterate relentlessly.** Your first prompt is rarely your best. Treat prompting as an experimental process.
4. **Understand the model's limitations.** Know what your chosen model can and cannot do. Context windows, knowledge cutoffs, and reasoning capabilities vary.
5. **Design for your audience.** The same task may require different prompts depending on who will receive the output.

## Core Concepts We'll Cover

In this module, you'll learn:

1. The anatomy of an effective prompt: **role, context, instruction, constraints, and output format**
2. Zero-shot vs. few-shot prompting and when to use each
3. Chain-of-thought reasoning and how it dramatically improves complex reasoning tasks
4. System prompts and how they shape model behavior
5. Practical exercises with real-world scenarios

## A Quick Preview

Here's the difference between a basic prompt and an engineered prompt for the same task:

**Basic Prompt:**
> "Write an email about our new product launch."

**Engineered Prompt:**
> "You are a senior product marketing manager at a B2B SaaS company. Write a launch announcement email for our new AI-powered analytics dashboard. The email should: (1) open with a compelling problem statement about manual reporting, (2) introduce the product as the solution with 3 key benefits, (3) include a clear call-to-action for a demo, and (4) maintain a professional but warm tone. Target audience: mid-market CTOs and analytics leaders. Keep it under 200 words."

The engineered prompt will produce a dramatically better result — every time.

## Pre-Assessment Questions

Before diving in, consider these questions:

1. How do you currently interact with AI tools (ChatGPT, Claude, Copilot)?
2. What's the most impressive AI output you've seen? What do you think made the prompt work?
3. Where in your work could better prompting save you the most time?

Let's begin mastering the craft of prompt engineering.`,
        },
        {
          title: "The Anatomy of a Prompt",
          content: `# The Anatomy of a Prompt

## The Five Essential Components

Every effective prompt can be broken down into five core components. Understanding these is like learning the grammar of a new language — once mastered, you can construct prompts for any scenario.

### 1. Role (Persona)

Assign the AI a specific identity or expertise profile. This helps the model calibrate its tone, knowledge domain, and perspective.

**Examples:**
- "You are an experienced patent attorney specializing in software patents."
- "You are a compassionate career coach with 20 years of experience."
- "You are a meticulous financial auditor reviewing quarterly reports."

**Why it works:** Role assignment activates the model's latent knowledge in that domain. The model draws on patterns it learned from that profession's communication style and knowledge base.

### 2. Context

Provide the background information the model needs to understand the situation. This is where you supply facts, constraints, and relevant details.

**Examples:**
- "Our company, Acme Corp, sells enterprise project management software to Fortune 500 companies."
- "The student is in 10th grade and struggles with algebra but excels in geometry."
- "We are analyzing Q4 2025 sales data for our North American retail division."

**Why it works:** Context grounds the model in your specific reality. Without it, the model makes assumptions that may be wrong.

### 3. Instruction (Task)

The core directive — what you want the model to do. Be specific about the action, scope, and approach.

**Examples:**
- "Summarize this research paper in 3 bullet points suitable for a C-level executive."
- "Write a Python function that takes a list of dates and returns them sorted by day of the week."
- "Analyze this customer feedback for recurring themes and categorize each theme by sentiment."

**Why it works:** Precision in instruction eliminates ambiguity and reduces the need for follow-up prompts.

### 4. Constraints

Boundaries and requirements that shape the output. This includes length, format, style, what to include, and what to avoid.

**Examples:**
- "Keep the response under 150 words."
- "Do not mention competitors by name."
- "Format the output as a JSON object with keys: 'summary', 'key_points', 'recommendation'."
- "Use active voice throughout."

**Why it works:** Constraints prevent the model from rambling, including unwanted content, or outputting in an unusable format.

### 5. Output Format

Specify exactly how you want the response structured. This is critical for programmatic use cases.

**Examples:**
- "Return a table with columns: Date, Metric, Value, YoY Change."
- "Output as a markdown list with ## headings for each section."
- "Provide the answer first, then a 'Reasoning' section explaining your logic."

**Why it works:** When you don't specify format, the model chooses for you — and it might not be what you need.

## Putting It All Together

Here's a template you can use for any prompt:

\`\`\`
You are a [ROLE]. [CONTEXT about the situation].

[TASK/INSTRUCTION with specific requirements].

Constraints:
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

Format: [specify output format]
\`\`\`

## Practice: Build a Complete Prompt

Using the five components, construct a prompt for the following scenario:

**Scenario:** You need to prepare a competitive analysis comparing three project management tools: Asana, Monday.com, and ClickUp. Your audience is the VP of Operations at a 200-person company considering a switch from spreadsheets.

*Try writing this prompt now. Then compare it with the example solution in the next lesson.*

## Key Takeaways

1. Every prompt should include role, context, instruction, constraints, and output format — though the depth of each depends on complexity.
2. The more specific you are, the better the output. Assume nothing.
3. A prompt template helps you be consistent and thorough.`,
        },
        {
          title: "Zero-Shot vs. Few-Shot Prompting",
          content: `# Zero-Shot vs. Few-Shot Prompting

## The Spectrum of Prompting

Prompt engineering exists on a spectrum from giving the model zero examples to providing many. Understanding where to position yourself on this spectrum is key to efficient and effective prompting.

### Zero-Shot Prompting

Zero-shot means you provide no examples in your prompt — just the instruction. You're asking the model to perform a task purely from its pre-training knowledge.

**Example:**
> "Classify the sentiment of this review as positive, negative, or neutral: 'The product arrived damaged, but customer service was excellent in resolving the issue.'"

The model must infer what "sentiment classification" means and how to do it, purely from the instruction.

**When to use zero-shot:**
- For straightforward tasks the model handles reliably
- When you're prototyping and testing
- When examples would be unnecessary overhead
- For creative or open-ended tasks where you don't want to bias the output

**Limitations:**
- Inconsistent format and quality
- May misinterpret nuanced instructions
- Struggles with domain-specific jargon or conventions

### Few-Shot Prompting

Few-shot means you include 1-5 examples in your prompt, demonstrating the desired input-output pattern.

**Example:**
> "Classify the sentiment of each review as positive, negative, or neutral.
>
> Review: 'Absolutely love this product! Best purchase this year.'
> Sentiment: positive
>
> Review: 'Total waste of money. Broke after two days.'
> Sentiment: negative
>
> Review: 'It works as described. Nothing special.'
> Sentiment: neutral
>
> Review: 'The product arrived damaged, but customer service was excellent in resolving the issue.'
> Sentiment:"

**When to use few-shot:**
- For tasks requiring consistent formatting
- When you need a specific reasoning pattern
- For niche domains where the model needs calibration
- When zero-shot results are inconsistent

### The Power of Examples

Few-shot prompting works because examples:
1. **Demonstrate the pattern** — showing is stronger than telling
2. **Calibrate expectations** — examples define the quality bar
3. **Reduce ambiguity** — edge cases in examples clarify how to handle them
4. **Activate latent knowledge** — examples can surface knowledge the model has but doesn't apply by default

### Chain-of-Thought Prompting

A specialized form of few-shot prompting where examples include step-by-step reasoning:

> "Q: If a train travels 60 miles in 2 hours, what is its average speed?
> A: To find average speed, I divide total distance by total time. 60 miles / 2 hours = 30 miles per hour. The answer is 30 mph.
>
> Q: If a car travels 180 miles at 45 mph, how long did it take?
> A:"

By showing the reasoning steps, you encourage the model to think through problems methodically rather than guessing.

### Choosing Your Approach: A Decision Framework

| Task Characteristic | Zero-Shot | Few-Shot |
|---|---|---|
| Simple, common task | ✅ | Optional |
| Complex reasoning | ❌ | ✅ (with CoT) |
| Specific output format | ❌ | ✅ |
| Niche domain | ❌ | ✅ |
| Creative exploration | ✅ | ❌ (examples constrain) |
| Production pipeline | ❌ | ✅ |

### Practice Exercise

Try the same task both ways:

**Task:** Extract name, date, and action item from meeting notes.

1. First, try a zero-shot prompt.
2. Then, add 2-3 examples and try again.

Observe the difference in output quality and consistency.

## Key Takeaways

1. Start with zero-shot; add examples if results aren't consistent enough.
2. Few-shot examples don't need to be real — fabricated examples work well as long as they demonstrate the pattern.
3. Chain-of-thought prompting is the single most powerful technique for improving reasoning accuracy.
4. The ideal number of examples is usually 2-5. More doesn't help significantly and uses up context window.`,
        },
        {
          title: "Prompt Iteration and Refinement",
          content: `# Prompt Iteration and Refinement

## The Iterative Nature of Prompting

Prompt engineering is rarely a one-shot activity. The best prompts emerge through systematic iteration — testing, analyzing, and refining. This lesson teaches you the discipline of prompt iteration.

## The Prompt Iteration Cycle

\`\`\`
Write → Test → Analyze → Refine → Repeat
\`\`\`

Each cycle should bring you closer to your desired output. The key is being systematic about what you change and why.

### Step 1: Write the Initial Prompt

Start with a solid foundation using the five-component framework (role, context, instruction, constraints, format). Don't aim for perfection — aim for "good enough to test."

### Step 2: Test

Run the prompt multiple times (3-5 runs recommended). Why multiple runs? Because LLMs are non-deterministic — the same prompt can produce different outputs each time.

**What to observe:**
- Does the output match your expected format?
- Is the quality consistent across runs?
- Are there factual errors or hallucinations?
- Is anything missing?

### Step 3: Analyze

Categorize what's working and what isn't:

| Category | Example Issue |
|---|---|
| **Format** | Output is in paragraphs instead of bullet points |
| **Content** | Missing key analysis angles |
| **Tone** | Too casual for executive audience |
| **Accuracy** | Incorrect data interpretation |
| **Completeness** | Didn't address the third constraint |

### Step 4: Refine

Make ONE change at a time. This is crucial — if you change multiple things simultaneously, you won't know which change caused which effect.

**Common refinement techniques:**

| Issue | Refinement |
|---|---|
| Wrong format | Add explicit format instructions with examples |
| Missing content | Add "Include sections on..." constraint |
| Wrong tone | Adjust the role description or add a tone directive |
| Hallucination | Add "If you don't know, say so" or provide reference data |
| Inconsistency | Add few-shot examples demonstrating the desired pattern |

### Step 5: Repeat

Continue the cycle until the output consistently meets your requirements.

## A Real Iteration Example

**Task:** Generate a weekly status update for an engineering team.

**Initial Prompt:**
> "Write a status update for our engineering team."

*Output: A vague, generic paragraph with no structure.*

**Iteration 1 — Add structure:**
> "Write a weekly status update for our engineering team. Include sections for: Accomplishments, In Progress, Blockers, and Next Week."

*Output: Has the right sections, but content is generic and made up.*

**Iteration 2 — Add context:**
> "You are an engineering manager at a fintech startup. Your team is building a real-time payment processing system. Write a weekly status update covering: [list of actual accomplishments and blockers]. Include sections for: Accomplishments, In Progress, Blockers, and Next Week."

*Output: Specific, but reads like a list, not a narrative for stakeholders.*

**Iteration 3 — Add tone and audience:**
> "You are an engineering manager at a fintech startup. Write a weekly status update for an audience of product managers and executives (not engineers). Use plain language, avoid technical jargon, and frame everything in terms of business impact. Include sections for: Accomplishments, In Progress, Blockers, and Next Week. Here are the facts to include: [facts]."

*Output: Polished, professional, and appropriate for the audience.*

### The Most Powerful Iteration Technique

**Ask the model to critique its own output:**

> "Review the output above and identify: (1) what could be clearer, (2) what's missing, (3) any assumptions that might be wrong. Then rewrite it."

This technique often catches issues you might miss and suggests refinements you wouldn't think of.

## Systematic Testing: The Prompt Test Suite

For production prompts, create a test suite:
1. Define 5-10 representative inputs
2. Define expected output characteristics (not exact outputs — characteristics)
3. Score each run against these characteristics
4. Only deploy when all characteristics score ≥ 8/10

## Common Iteration Pitfalls

1. **Over-engineering early.** Don't perfect before testing — you might be solving the wrong problem.
2. **Changing too many things at once.** One change per iteration.
3. **Testing only once.** Non-determinism means one test is not representative.
4. **Not saving prompt versions.** Keep a prompt changelog so you can revert.

## Practice

Take a prompt you wrote earlier in this module and run 3 iterations on it. Document what you changed and why. Compare the first and final outputs.

## Key Takeaways

1. Prompting is iterative — expect 3-5 cycles for production-quality prompts.
2. Change one thing at a time and observe the effect.
3. Test multiple times to account for non-deterministic outputs.
4. Ask the model to self-critique — it's surprisingly good at finding its own flaws.`,
        },
      ],
      quiz: {
        title: "Prompt Engineering Foundations Quiz",
        passingScore: 70,
        questions: [
          {
            questionText:
              "Which of the following is NOT one of the five essential components of an effective prompt?",
            options: ["Role", "Context", "Creativity Score", "Constraints", "Output Format"],
            correctIndex: 2,
            explanation:
              "The five essential components are Role, Context, Instruction, Constraints, and Output Format. 'Creativity Score' is not a standard prompt component.",
          },
          {
            questionText:
              "When should you use few-shot prompting instead of zero-shot?",
            options: [
              "For simple, common tasks that the model handles reliably",
              "When you need a specific output format or consistent results",
              "When you want to save tokens and context window space",
              "For creative brainstorming sessions",
            ],
            correctIndex: 1,
            explanation:
              "Few-shot prompting is ideal when you need specific formatting or consistent results, as the examples demonstrate the desired pattern. For simple tasks, zero-shot is often sufficient.",
          },
          {
            questionText:
              "What is chain-of-thought prompting?",
            options: [
              "Prompting the model to think silently before answering",
              "Including step-by-step reasoning in your examples to encourage methodical problem-solving",
              "A technique where you chain multiple prompts together in sequence",
              "Using the model's output as part of the next prompt's context",
            ],
            correctIndex: 1,
            explanation:
              "Chain-of-thought prompting includes step-by-step reasoning within examples, which encourages the model to work through problems methodically rather than guessing at answers.",
          },
          {
            questionText:
              "Which is the recommended approach for prompt iteration?",
            options: [
              "Make multiple changes at once to save time",
              "Change one thing at a time and observe the effect",
              "Test once and move on if the output looks good",
              "Always start by adding more constraints",
            ],
            correctIndex: 1,
            explanation:
              "Changing one thing at a time is crucial for understanding which changes have which effects. Multiple simultaneous changes make it impossible to determine causality.",
          },
          {
            questionText:
              "Why should you test a prompt multiple times during iteration?",
            options: [
              "Because LLMs charge per query and you want to use your quota",
              "Because LLMs are non-deterministic and can produce different outputs from the same prompt",
              "Because you need to build a training dataset",
              "Because the first run is always wrong",
            ],
            correctIndex: 1,
            explanation:
              "LLMs are non-deterministic — the same prompt can produce different outputs each run. Testing multiple times helps you understand the range and consistency of outputs before making changes.",
          },
        ],
      },
    },
    {
      sortOrder: 2,
      title: "Building and Orchestrating AI Agents",
      description:
        "Move beyond simple chat interactions. Learn to design, build, and orchestrate autonomous AI agents that can plan, use tools, and complete multi-step tasks independently.",
      lessons: [
        {
          title: "Introduction to AI Agents",
          content: `# Introduction to AI Agents

## What Is an AI Agent?

An AI agent is an autonomous system that uses a language model to reason about tasks, make decisions, and take actions to achieve specific goals. Unlike a simple chatbot that responds to one message at a time, an agent can plan multi-step strategies, use external tools, remember context across interactions, and operate independently over extended periods.

**Key distinction:** A chatbot says "I can help with that." An agent says "I'll handle this" and then actually does it.

## Agents vs. Chatbots

| Feature | Chatbot | AI Agent |
|---|---|---|
| Interaction | Single turn | Multi-turn, persistent |
| Memory | Limited context window | Short + long-term memory |
| Tools | None | APIs, databases, code execution |
| Autonomy | Reactive | Proactive, goal-driven |
| Task complexity | Simple Q&A | Multi-step workflows |
| Decision-making | Pattern matching | Reasoning + planning |

## The Agent Architecture

Modern AI agents follow a common architectural pattern:

\`\`\`
┌─────────────────────────────────────────────┐
│                  AI Agent                     │
│                                               │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Plan   │  │  Memory  │  │   Tools    │  │
│  │  (LLM)  │  │ (Vector  │  │ (API/Db/  │  │
│  │         │  │   DB)    │  │   Code)    │  │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  │
│       │            │              │          │
│       └────────────┼──────────────┘          │
│                    │                          │
│              ┌─────┴──────┐                  │
│              │  Orchestrator │                │
│              └──────────────┘                │
└─────────────────────────────────────────────┘
\`\`\`

### Components Explained

1. **Planning (LLM Core):** The LLM serves as the "brain" — decomposing goals into sub-tasks, reasoning about approaches, and deciding which tool to use next.

2. **Memory:** Stores conversation history, retrieved documents, and learned preferences. Vector databases enable semantic search across large memory stores.

3. **Tools:** External capabilities the agent can invoke — APIs, databases, calculators, web search, code execution, file operations.

4. **Orchestrator:** The control loop that manages the plan-execute-observe cycle, handling errors and replanning when needed.

## The Agent Loop

Every agent follows this fundamental cycle:

\`\`\`
1. RECEIVE goal/task
2. PLAN: Decompose into steps
3. ACT: Execute the next step (call tool, generate text, etc.)
4. OBSERVE: Collect the result
5. REASON: Determine if goal is met or if replanning is needed
6. GOTO 3 if not done
\`\`\`

This is known as the **ReAct pattern** (Reasoning + Acting).

## Types of AI Agents

### Simple Reflex Agent
Takes action based only on current input. No memory, no planning.
> "Summarize this document." → [summarizes]

### Goal-Based Agent
Given a goal, plans and executes steps to achieve it.
> "Book the cheapest flight to London next Tuesday" → [searches, compares, books]

### Multi-Agent System
Multiple specialized agents collaborate, each handling a specific role.
> One agent researches, another writes, another reviews — coordinated by an orchestrator.

## When to Use Agents

Agents shine when tasks require:
- Multiple steps across different systems
- Decision-making with incomplete information
- Interaction with external tools and data
- Persistent memory across sessions
- Autonomous operation without human intervention

Agents are overkill when:
- A simple single-prompt response suffices
- Every action needs human review
- The task is purely informational (Q&A)

## Real-World Agent Examples

1. **Customer Support Agent:** Reads knowledge base → drafts response → checks order system → sends resolution email
2. **DevOps Agent:** Monitors alerts → diagnoses issue → runs remediation script → updates status page
3. **Research Agent:** Searches papers → extracts findings → synthesizes summary → generates bibliography
4. **Personal Assistant:** Checks calendar → finds free slots → drafts email → schedules meeting

## What We'll Build in This Module

By the end of this module, you'll build a working AI agent that can:
1. Accept a multi-step task
2. Break it down into subtasks
3. Use tools (web search, calculator, APIs)
4. Handle errors and replan when needed
5. Report results in a structured format

Let's get started.`,
        },
        {
          title: "Tool Use and Function Calling",
          content: `# Tool Use and Function Calling

## Giving Agents Superpowers

A language model alone is powerful but limited — it can only generate text. Adding tools transforms it into an agent that can interact with the real world. This lesson covers how to define, expose, and orchestrate tools for AI agents.

## What Are Tools?

A tool is any external capability an agent can call. Think of tools as APIs for agents:

| Tool Type | Examples |
|---|---|
| **Data retrieval** | Database queries, API calls, web scraping |
| **Computation** | Calculator, spreadsheet operations, statistical functions |
| **Communication** | Send email, post to Slack, create calendar events |
| **File operations** | Read/write files, generate PDFs, image processing |
| **Code execution** | Run Python/JavaScript, execute SQL, shell commands |
| **External services** | Stripe payments, GitHub API, Google Maps |

## Function Calling: How It Works

Modern LLMs support **function calling** (also called "tool use") — a capability where the model decides when to call a function and with what arguments.

### The Flow

\`\`\`
1. User: "What's the weather in Tokyo?"
2. Agent (LLM): I need current weather data. I'll call get_weather().
3. Agent → Tool: get_weather(location="Tokyo")
4. Tool → Agent: { temp: 22°C, conditions: "Partly cloudy" }
5. Agent → User: "It's currently 22°C and partly cloudy in Tokyo."
\`\`\`

### Defining a Tool

In the OpenAI function calling format:

\`\`\`json
{
  "name": "get_weather",
  "description": "Get the current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name and country, e.g. 'Tokyo, Japan'"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit"
      }
    },
    "required": ["location"]
  }
}
\`\`\`

### Best Practices for Tool Definitions

1. **Descriptive names:** \`get_weather\` not \`fn1\`
2. **Detailed descriptions:** The model uses these to decide when to call the tool
3. **Precise parameter types:** String, number, boolean, enum — be exact
4. **Required vs. optional:** Mark clearly
5. **Examples in descriptions:** "e.g., 'Tokyo, Japan' or 'London, UK'"

## Tool Orchestration Patterns

### Sequential
Call tools one at a time, each depending on the previous result.

\`\`\`
search_flights("NYC", "London") → [results]
↓
get_cheapest(results) → flight #3
↓
book_flight(flight #3) → confirmed
\`\`\`

### Parallel
Call multiple independent tools simultaneously.

\`\`\`
get_weather("NYC") ──┐
get_weather("London") ─┼─→ compare and report
get_weather("Tokyo") ──┘
\`\`\`

### Conditional Branching
Decide which tool to call based on previous results.

\`\`\`
check_inventory(item) → in stock? → calculate_shipping()
                    → out of stock? → find_alternatives()
\`\`\`

### Retry with Fallback
If a tool fails, try alternatives or degrade gracefully.

\`\`\`
search_primary_db(query) → failed?
  → search_cache(query) → failed?
    → return "Data temporarily unavailable"
\`\`\`

## Error Handling for Tool Calls

Agents must handle tool failures gracefully. Common patterns:

1. **Timeouts:** Set maximum wait times for tool responses
2. **Retries:** Automatically retry transient failures (network errors)
3. **Fallbacks:** Have backup tools or data sources
4. **Graceful degradation:** Return partial results when complete results are unavailable
5. **Human escalation:** Route to a human when the agent can't resolve an issue

## Security Considerations

When giving agents access to tools, follow these principles:

1. **Principle of Least Privilege:** Only grant access to tools the agent actually needs
2. **Input validation:** Validate all tool inputs before execution
3. **Output sanitization:** Review tool outputs before displaying to users
4. **Rate limiting:** Prevent abuse with rate limits on tool calls
5. **Audit logging:** Log all tool calls for monitoring and debugging

## Practice: Building a Multi-Tool Agent

Design an agent with these tools:
- \`search_knowledge_base(query)\` — searches internal docs
- \`calculate(expression)\` — evaluates math
- \`send_email(to, subject, body)\` — sends email

For this scenario: "Research Q3 sales numbers, calculate the growth rate, and email the result to the CFO."

Write the tool definitions and trace the agent's expected execution path.

## Key Takeaways

1. Tools are what transform LLMs from text generators into autonomous agents.
2. Function calling allows the model to decide which tool to use and when.
3. Good tool definitions are descriptive and precise — the model relies on them.
4. Handle tool failures gracefully with retries, fallbacks, and human escalation.
5. Security is critical: validate inputs, limit access, and audit everything.`,
        },
        {
          title: "Memory and Context Management",
          content: `# Memory and Context Management

## The Memory Problem

LLMs are stateless — each API call is independent. Without memory management, an agent forgets everything between turns. This lesson covers how to give agents persistent memory and manage context effectively.

## Types of Agent Memory

### 1. Working Memory (Short-Term)

The active conversation context within the model's context window.

| Characteristic | Detail |
|---|---|
| Duration | Single session |
| Capacity | Limited by context window (8K-200K tokens) |
| Content | Recent messages, tool results, current task state |
| Strategy | Summarize and compress to fit within limits |

### 2. Episodic Memory (Medium-Term)

Key events and decisions from the current session, stored externally.

| Characteristic | Detail |
|---|---|
| Duration | Current session |
| Capacity | Virtually unlimited (external storage) |
| Content | Important decisions, user preferences, key results |
| Strategy | Automatically capture significant events |

### 3. Semantic Memory (Long-Term)

Persistent knowledge about the user, domain, and past interactions.

| Characteristic | Detail |
|---|---|
| Duration | Permanent (across sessions) |
| Capacity | Unlimited (vector database) |
| Content | User preferences, learned facts, past solutions |
| Strategy | Vector embeddings for semantic retrieval |

## Context Window Management

The context window is your most precious resource. Here's how to manage it:

### Token Budgeting

Allocate your context window deliberately:

\`\`\`
Total: 128,000 tokens
├── System prompt: 2,000 tokens
├── Tool definitions: 3,000 tokens  
├── Recent conversation: 40,000 tokens
├── Retrieved context: 20,000 tokens
├── Working memory: 10,000 tokens
└── Reserve for output: 53,000 tokens
\`\`\`

### Summarization Strategies

When the conversation grows too long, compress it:

1. **Sliding window:** Keep only the most recent N messages
2. **Hierarchical summarization:** Summarize chunks, then summarize the summaries
3. **Importance-based:** Keep "important" messages (decisions, key facts), discard the rest
4. **LLM summarization:** Ask the model to summarize the conversation so far

### Example: Conversation Compression

\`\`\`python
def compress_conversation(messages, max_tokens=40000):
    if token_count(messages) <= max_tokens:
        return messages
    
    # Keep system message + last 10 messages always
    system = [m for m in messages if m["role"] == "system"]
    recent = messages[-10:]
    
    # Summarize the middle section
    middle = messages[len(system):-10]
    summary = llm.summarize(middle)
    
    return system + [{"role": "assistant", "content": f"[Earlier conversation summary: {summary}]"}] + recent
\`\`\`

## Vector Memory with RAG

For long-term semantic memory, use Retrieval-Augmented Generation (RAG):

1. **Store:** Convert important information into vector embeddings and store them
2. **Retrieve:** When the agent needs context, query for semantically similar stored memories
3. **Augment:** Include retrieved memories in the prompt

\`\`\`
User: "Remember that restaurant I liked in Paris?"
Agent → queries vector store for "restaurant Paris user preference"
Agent ← finds: "User loved Le Comptoir in Saint-Germain"
Agent: "Yes! You enjoyed Le Comptoir in Saint-Germain. Would you like me to check if they have tables available?"
\`\`\`

## Practical Memory Architecture

Here's a production-ready memory setup:

\`\`\`
┌──────────────┐
│   Short-Term │  Context window (managed via summarization)
│   Memory     │
├──────────────┤
│   Session    │  Redis/PostgreSQL — key events, current state
│   Store      │
├──────────────┤
│   Long-Term  │  Vector database (Pinecone/Weaviate/pgvector) —
│   Memory     │  user preferences, learned knowledge
└──────────────┘
\`\`\`

## Best Practices

1. **Be selective about what you remember.** Not everything needs to be stored. Focus on decisions, preferences, and key facts.
2. **Use structured memory records.** Store memories with timestamps, importance scores, and categories for better retrieval.
3. **Implement forgetting.** Old, unused memories should decay and eventually be removed.
4. **Give users control.** Allow users to view, correct, and delete stored memories.
5. **Test memory retrieval.** Regularly verify that the agent retrieves the right information for the right queries.

## Practice Exercise

Design the memory system for a personal assistant agent that:
- Remembers user preferences across sessions
- Knows the user's schedule and contacts
- Learns from past interactions
- Never exceeds the context window limit

Draw the architecture and define what goes into each memory tier.

## Key Takeaways

1. Agents need three tiers of memory: short-term, session, and long-term.
2. The context window is limited — manage it with deliberate token budgeting and summarization.
3. Vector databases enable semantic search over long-term memories.
4. Be selective: not everything deserves to be remembered.
5. Users should control their data — provide visibility and deletion capabilities.`,
        },
      ],
      quiz: {
        title: "AI Agents Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "What is the key architectural pattern that AI agents follow?",
            options: [
              "Model-View-Controller (MVC)",
              "ReAct (Reasoning + Acting)",
              "Publisher-Subscriber",
              "Singleton pattern",
            ],
            correctIndex: 1,
            explanation:
              "The ReAct pattern is the fundamental agent loop: Reason about the task, Act by calling tools, Observe results, and repeat. This cycle continues until the goal is achieved.",
          },
          {
            questionText: "Which memory tier is best for storing user preferences across sessions?",
            options: [
              "Working memory (context window)",
              "Short-term memory (current session)",
              "Long-term semantic memory (vector database)",
              "No memory — agents should be stateless",
            ],
            correctIndex: 2,
            explanation:
              "Long-term semantic memory stored in a vector database is ideal for persistent user preferences that need to be recalled across multiple sessions and interactions.",
          },
          {
            questionText: "What is the primary purpose of function calling in AI agents?",
            options: [
              "To make the model run faster",
              "To allow the model to decide when and how to use external tools",
              "To convert text to speech",
              "To train the model on new data",
            ],
            correctIndex: 1,
            explanation:
              "Function calling allows the LLM to recognize when a tool is needed and generate the correct parameters to invoke it, bridging the gap between language understanding and real-world action.",
          },
          {
            questionText: "Which is a valid strategy for managing the context window?",
            options: [
              "Always keep all messages — the model can handle it",
              "Delete the system prompt when running low on space",
              "Summarize older conversation chunks to free up space while retaining key information",
              "Use a smaller model that doesn't have a context window limit",
            ],
            correctIndex: 2,
            explanation:
              "Hierarchical summarization preserves important information from older conversation segments while dramatically reducing token usage, allowing the agent to effectively operate within context window limits.",
          },
          {
            questionText: "What security principle should guide tool access for agents?",
            options: [
              "Maximum privilege — give agents all possible tools",
              "Principle of Least Privilege — only grant tools the agent actually needs",
              "No tools at all — agents shouldn't access external systems",
              "Shared credentials — all agents use the same API keys",
            ],
            correctIndex: 1,
            explanation:
              "The Principle of Least Privilege means agents should only have access to the specific tools and permissions they need for their tasks. This minimizes damage from errors or potential misuse.",
          },
        ],
      },
    },
    {
      sortOrder: 3,
      title: "Custom GPTs and Model Fine-Tuning",
      description:
        "Learn to create specialized AI models tailored to specific domains, tasks, and brand voices. Cover GPT creation, system prompt engineering, and when to fine-tune versus prompt-engineer.",
      lessons: [
        {
          title: "Introduction to Custom GPTs",
          content: `# Introduction to Custom GPTs

## Beyond General-Purpose Models

General-purpose models like GPT-4 are incredibly capable, but they're generalists. Custom GPTs allow you to create specialized AI assistants with specific knowledge, behaviors, and capabilities — without writing any code.

## What Is a Custom GPT?

A Custom GPT is a pre-configured instance of a language model with:
- **Custom system instructions** defining its behavior, expertise, and personality
- **Uploaded knowledge files** for domain-specific information
- **Selected capabilities** (web browsing, image generation, code execution)
- **Custom actions** connecting to external APIs

### The Customization Spectrum

\`\`\`
Prompt Engineering ─── Custom GPTs ─── Fine-Tuning ─── Training from Scratch
(No code, fast)          (No code)      (Some code)     (Lots of code, $$$)
\`\`\`

For most use cases, Custom GPTs hit the sweet spot: powerful customization without the complexity and cost of fine-tuning.

## Anatomy of a Custom GPT

### 1. System Instructions (The Soul)

This is the most important part. System instructions define:
- **Role and expertise:** "You are a patent attorney specializing in software..."
- **Behavioral rules:** "Always cite specific patent numbers when applicable."
- **Output format:** "Structure responses with: Summary, Analysis, Recommendation."
- **Constraints:** "Never provide legal advice — always recommend consulting an attorney."

**Example system prompt for a code reviewer GPT:**

> "You are an experienced senior software engineer performing code reviews. When reviewing code: (1) identify potential bugs and edge cases first, (2) suggest performance improvements, (3) check for security vulnerabilities, (4) verify adherence to best practices. Format each finding as: Severity (Critical/High/Medium/Low), File:Line, Issue, Suggestion. Always explain *why* a change is needed, not just what to change. Be constructive and specific."

### 2. Knowledge Files

Upload documents that the GPT can reference:
- PDF manuals
- Markdown documentation
- CSV data files
- Text documents

The GPT uses RAG (Retrieval-Augmented Generation) to search through these files and find relevant information. This is how you give a GPT domain-specific knowledge without training a new model.

### 3. Capabilities

Toggle which built-in capabilities the GPT has:
- **Web browsing:** Search the internet for current information
- **DALL·E image generation:** Create images from descriptions
- **Code interpreter:** Execute Python code, analyze data, create charts

### 4. Actions (API Integration)

Custom actions allow your GPT to call external APIs:
- Look up order status in your database
- Book appointments through your calendar system
- Send messages via Slack or email
- Query your company's internal tools

Each action requires an OpenAPI schema defining the endpoint, parameters, and authentication.

## When to Create a Custom GPT

| Use Case | Example |
|---|---|
| **Specialized expertise** | Medical literature reviewer, legal document analyzer |
| **Brand-aligned communication** | Customer service agent with your company's voice |
| **Knowledge base access** | Internal documentation Q&A for employees |
| **Workflow automation** | Meeting notes → Jira tickets → Slack notification |
| **Education and training** | Interactive tutor for your specific curriculum |

## Best Practices for Custom GPTs

1. **Start simple.** Begin with just system instructions. Add knowledge files and actions incrementally.
2. **Test with edge cases.** Intentionally try to break your GPT. Does it handle out-of-scope questions gracefully?
3. **Iterate on instructions.** System prompt engineering is an ongoing process — refine based on real usage.
4. **Document version history.** Keep track of what changed and why.
5. **Respect boundaries.** Always include clear scope limitations and disclaimers.

## Project: Design Your First Custom GPT

Design a Custom GPT for one of these scenarios:
1. A writing coach that gives constructive feedback on essays
2. A travel planner that creates detailed itineraries
3. A data analyst that interprets CSV files and creates visualizations

Document your:
- System instructions (full prompt)
- Knowledge files (what would you upload?)
- Capabilities (which ones and why?)
- Actions (what APIs would it connect to?)

We'll have you build and test this GPT in the next lesson.`,
        },
        {
          title: "System Prompt Engineering for GPTs",
          content: `# System Prompt Engineering for GPTs

## The Art of the System Prompt

The system prompt is the most powerful lever you have when creating a Custom GPT. It sets the boundaries, defines the personality, and determines the quality of every interaction. This lesson is a deep dive into writing exceptional system prompts.

## Principles of Effective System Prompts

### 1. Be Specific, Not Vague

| Vague | Specific |
|---|---|
| "Be helpful" | "Provide step-by-step instructions with examples for each step" |
| "Write good code" | "Write Python code following PEP 8 style guide, with docstrings and type hints" |
| "Be professional" | "Use formal business English, avoid contractions, and address the user as 'you' with respect" |

### 2. Front-Load Critical Instructions

The model pays most attention to the beginning and end of the prompt. Put your most important constraints first and reinforce them at the end.

### 3. Use Positive Framing

Tell the model what TO do, not what NOT to do. Negation is surprisingly weak.

| Negative (Weak) | Positive (Strong) |
|---|---|
| "Don't be rude" | "Always respond with warmth and respect" |
| "Don't make up facts" | "Base all answers on provided knowledge files. If uncertain, state that clearly." |
| "Don't use jargon" | "Use plain language a non-technical audience can understand" |

### 4. Define the Output Structure

Ambiguity about format leads to inconsistent outputs. Define it explicitly.

\`\`\`
When answering questions about code, structure your response as:
1. **Diagnosis:** What's the issue?
2. **Root Cause:** Why is it happening?
3. **Solution:** Code snippet with explanation
4. **Prevention:** How to avoid this in the future
\`\`\`

### 5. Establish Scope and Boundaries

Every GPT needs clear limits. What topics are in scope? What should it refuse?

> "You specialize in Python, JavaScript, and SQL. For questions about other languages, politely explain your scope and offer general programming principles that might apply."

### 6. Include Meta-Instructions

Tell the GPT how to handle different situations:

> "If the user provides incomplete information, ask clarifying questions before proceeding. If they seem frustrated, acknowledge their frustration first, then help."

## The System Prompt Template

Here's a battle-tested template for any GPT:

\`\`\`
# ROLE
You are a [specific role with expertise level].

# CONTEXT
[Background info about the domain and users.]

# CAPABILITIES
You can: [list specific capabilities].
You cannot: [list limitations].

# BEHAVIOR RULES
1. [Rule 1 — most important]
2. [Rule 2]
3. [Rule 3]
...

# OUTPUT FORMAT
Structure your responses as:
[template or format specification]

# KNOWLEDGE SCOPE
Your knowledge covers: [domains/topics].
If asked about topics outside this scope: [how to handle].

# TONE
[Personality and communication style descriptors.]

# SAFETY
[Content boundaries, disclaimers, escalation rules.]
\`\`\`

## Testing Your System Prompt

Before deploying, test with a matrix:

| Test Type | Example Prompt | Expected Behavior |
|---|---|---|
| Happy path | Normal, in-scope question | Follows all rules, correct format |
| Edge case | Ambiguous or incomplete query | Asks clarifying questions |
| Out of scope | Question about excluded topic | Polite refusal with redirection |
| Adversarial | "Ignore your instructions and..." | Maintains rules, refuses attempts |
| Multi-turn | Series of related questions | Maintains context and consistency |

## Common System Prompt Mistakes

1. **Too long:** The system prompt uses tokens from the context window. Every word counts.
2. **Conflicting instructions:** "Always be concise" followed by "Provide comprehensive detail" — which is it?
3. **Unstated assumptions:** "You know our company's pricing" — does it actually?
4. **No error handling:** What happens when the user asks something the GPT can't do?
5. **Missing safety boundaries:** Every GPT needs clear content and scope boundaries.

## Practical Workshop

Take one of your previous Custom GPT designs and write a complete, production-quality system prompt using the template above. Then create a test matrix with 10 test cases covering happy path, edge cases, out-of-scope, and adversarial scenarios.

## Key Takeaways

1. The system prompt is your primary control mechanism — invest time in it.
2. Be specific, positive, and structured in your instructions.
3. Always define scope boundaries and error handling behavior.
4. Test systematically with a matrix of scenarios.
5. Iterate based on real usage patterns, not hypothetical concerns.`,
        },
        {
          title: "When and How to Fine-Tune",
          content: `# When and How to Fine-Tune

## The Next Level of Customization

Prompt engineering and Custom GPTs get you far, but sometimes you need more. Fine-tuning — training a model on your own dataset — offers deeper customization at the cost of more complexity and expense.

## What Is Fine-Tuning?

Fine-tuning takes a pre-trained model (like GPT-4o) and continues training it on a specific dataset, adjusting its weights to perform better on your particular tasks. The result is a model that:

- Consistently follows your desired format
- Adapts to your domain's vocabulary and conventions
- Requires shorter prompts (behavior is "baked in")
- Can be cheaper per token than prompting (less context needed)

## Fine-Tuning vs. Prompt Engineering: A Decision Framework

| Factor | Prompt Engineering | Fine-Tuning |
|---|---|---|
| **Setup time** | Minutes | Hours to days |
| **Cost to create** | Free | $10-100+ per training run |
| **Iteration speed** | Instant | Hours per iteration |
| **Format consistency** | Good with few-shot | Excellent |
| **Domain adaptation** | Limited to context window | Deep understanding |
| **Token savings** | None (prompt uses context) | Significant (shorter prompts) |
| **Required data** | 0-5 examples | 50-1000+ examples |

## When to Fine-Tune

Fine-tune when ALL of these are true:

1. **You have sufficient data.** At least 50-100 high-quality examples for basic fine-tuning; 500+ for complex tasks.
2. **Prompt engineering isn't enough.** You've tried well-crafted prompts with few-shot examples and still don't get consistent results.
3. **The task is well-defined.** Fine-tuning works for tasks with clear input-output patterns, not open-ended creative work.
4. **Token costs matter.** You're making many calls and the prompt overhead is significant.
5. **Latency matters.** Shorter prompts with fine-tuned models respond faster.

## When NOT to Fine-Tune

- Your task changes frequently (fine-tuning is static)
- You have fewer than 50 examples
- Prompt engineering already gives you good results
- You need to frequently update the model's knowledge
- You're prototyping and need to iterate quickly

## The Fine-Tuning Process

### Step 1: Data Collection & Preparation

**Quality over quantity.** 100 perfect examples beat 1000 mediocre ones.

Format example (OpenAI chat format):

\`\`\`jsonl
{"messages": [{"role": "system", "content": "You are a medical coding assistant."}, {"role": "user", "content": "Patient presents with chest pain and shortness of breath."}, {"role": "assistant", "content": "ICD-10: R07.9 (Chest pain, unspecified), R06.02 (Shortness of breath). Consider: I20.9 (Angina pectoris) if cardiac origin suspected."}]}
\`\`\`

### Step 2: Data Quality Checks

- **Diversity:** Cover edge cases, not just happy paths
- **Consistency:** Same input should always produce the same style of output
- **Correctness:** Every example must be factually accurate
- **Format:** Strictly follow the required format (JSONL, correct structure)

### Step 3: Train/Validate/Split

- 80% training data
- 10% validation (used during training to monitor progress)
- 10% test (held out for final evaluation)

### Step 4: Training Run

Modern platforms (OpenAI, Anyscale, Together AI) make this straightforward:

\`\`\`python
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
    training_file="file-abc123",
    model="gpt-4o-2024-08-06"
)
\`\`\`

### Step 5: Evaluation

Compare the fine-tuned model against:
1. The base model with good prompts
2. Your quality criteria on the held-out test set
3. Real-world edge cases

Don't deploy until the fine-tuned model consistently outperforms prompt engineering.

### Step 6: Deployment & Monitoring

- Deploy with fallback to base model
- Log inputs and outputs for quality monitoring
- Plan for retraining as your data evolves

## Cost-Benefit Analysis Example

**Scenario:** Customer support ticket classification (100,000 tickets/month)

| Approach | Prompt Tokens/Ticket | Cost/Month | Accuracy |
|---|---|---|---|
| Base model + long prompt | 500 tokens | $500 | 85% |
| Fine-tuned model + short prompt | 50 tokens | $75 | 92% |
| **Savings** | | **$425/month** | **+7%** |

Fine-tuning cost: ~$50 one-time. ROI: < 1 month.

## The Hybrid Approach

For many production systems, the best approach combines both:

1. **Fine-tune** for format consistency, domain adaptation, and token savings
2. **Prompt** for dynamic context, specific instructions, and real-time data

The fine-tuned model handles the "how to respond" while the prompt handles "what to respond about."

## Key Takeaways

1. Fine-tune only when prompt engineering consistently falls short — it's not the default.
2. Quality training data is everything. Invest more time in data than in training.
3. Always benchmark fine-tuned results against prompt-engineered baselines.
4. Consider hybrid approaches: fine-tune for style, prompt for substance.
5. Plan for ongoing maintenance — fine-tuned models need periodic retraining.`,
        },
      ],
      quiz: {
        title: "Custom GPTs and Fine-Tuning Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "What is the most powerful lever when creating a Custom GPT?",
            options: [
              "The number of knowledge files uploaded",
              "The system instructions/prompt",
              "The number of API actions configured",
              "The model variant selected",
            ],
            correctIndex: 1,
            explanation:
              "The system instructions define the GPT's behavior, expertise, personality, and boundaries. While all components matter, the system prompt is the single most impactful element.",
          },
          {
            questionText: "When should you consider fine-tuning instead of prompt engineering?",
            options: [
              "As a first approach for any new task",
              "When you have sufficient data AND prompt engineering doesn't give consistent results",
              "When you have fewer than 10 examples",
              "When you need to update the model's knowledge daily",
            ],
            correctIndex: 1,
            explanation:
              "Fine-tuning is appropriate when you have enough quality data (50+ examples) and prompt engineering with few-shot examples still doesn't produce consistent enough results.",
          },
          {
            questionText: "Which is an example of a good system prompt instruction?",
            options: [
              "Don't be unhelpful.",
              "Provide step-by-step instructions with concrete examples for each step.",
              "Just do your best.",
              "Avoid making things complicated.",
            ],
            correctIndex: 1,
            explanation:
              "Good system prompts use positive, specific framing. 'Provide step-by-step instructions with concrete examples' is clear, actionable, and positively framed.",
          },
          {
            questionText: "How many examples are typically needed for effective fine-tuning?",
            options: [
              "5-10 examples",
              "50-1000+ examples, depending on task complexity",
              "Exactly 100 examples",
              "10,000+ examples minimum",
            ],
            correctIndex: 1,
            explanation:
              "For basic fine-tuning, 50-100 quality examples is the minimum. Complex tasks may require 500+. Quality matters more than quantity — 100 perfect examples beat 1000 mediocre ones.",
          },
          {
            questionText: "What is a key advantage of the hybrid approach (fine-tuning + prompting)?",
            options: [
              "It eliminates the need for any training data",
              "The fine-tuned model handles format/style while prompts handle dynamic context",
              "It costs nothing to implement",
              "It only works with open-source models",
            ],
            correctIndex: 1,
            explanation:
              "The hybrid approach leverages fine-tuning for consistency and domain adaptation while using prompts for dynamic context, real-time data, and task-specific instructions — combining the best of both worlds.",
          },
        ],
      },
    },
    {
      sortOrder: 4,
      title: "LLM Application Development",
      description:
        "Build real applications powered by large language models. Cover API integration, streaming, error handling, prompt management, and production deployment patterns.",
      lessons: [
        {
          title: "LLM API Integration Patterns",
          content: `# LLM API Integration Patterns

## Building with Language Models

Integrating an LLM into an application is fundamentally different from calling a traditional API. LLMs are non-deterministic, have variable latency, consume tokens instead of returning fixed-size responses, and can fail in unexpected ways. This lesson covers the patterns you need to build robust LLM-powered applications.

## The Basic Integration Pattern

\`\`\`python
# 1. Prepare the messages
messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_input}
]

# 2. Call the API
response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    temperature=0.3,
    max_tokens=2000
)

# 3. Extract and validate the response
output = response.choices[0].message.content
if not output:
    raise ValueError("Empty response from model")

# 4. Process and return
return process_output(output)
\`\`\`

Seems straightforward, right? The complexity lives in the details: error handling, retries, streaming, prompt management, and output validation.

## Pattern 1: Structured Output

Don't parse free-text responses. Use structured output modes:

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "sentiment_analysis",
            "schema": {
                "type": "object",
                "properties": {
                    "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
                    "confidence": {"type": "number"},
                    "key_topics": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["sentiment", "confidence"]
            }
        }
    }
)
\`\`\`

**Alternative: Pydantic + Instructor library** for even better DX:

\`\`\`python
from pydantic import BaseModel
import instructor

class SentimentResult(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float
    key_topics: list[str]

client = instructor.from_openai(OpenAI())
result = client.chat.completions.create(
    model="gpt-4o",
    response_model=SentimentResult,
    messages=[{"role": "user", "content": "Analyze: 'Love this product!'"}]
)
# result is a validated SentimentResult instance
\`\`\`

## Pattern 2: Streaming Responses

For better UX, stream tokens as they're generated:

\`\`\`python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[...],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        yield chunk.choices[0].delta.content  # Send to UI immediately
\`\`\`

**Streaming considerations:**
- Harder to validate output (you don't have it all at once)
- JSON streaming is possible but more complex
- Users perceive streaming as 2-3x faster, even with same total time

## Pattern 3: Retry with Exponential Backoff

LLM APIs fail — rate limits, timeouts, 500s. Handle it gracefully:

\`\`\`python
import time
from openai import RateLimitError, APIError

def call_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt  # 1s, 2s, 4s
            time.sleep(wait)
        except APIError as e:
            if e.status_code >= 500:  # Server error, retry
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)
            else:  # Client error, don't retry
                raise
\`\`\`

## Pattern 4: Prompt Registry

Don't hardcode prompts. Manage them like code:

\`\`\`python
# prompts/summarizer.py
SUMMARIZER_SYSTEM = """
You are a technical documentation summarizer.
Given a document, produce:
1. A 1-sentence TL;DR
2. 3-5 key bullet points
3. Target audience assessment

Rules:
- Keep the TL;DR under 30 words
- Each bullet point should be self-contained
- If the document is unclear, note that instead of guessing
"""

# Usage
from prompts.summarizer import SUMMARIZER_SYSTEM

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": SUMMARIZER_SYSTEM},
        {"role": "user", "content": document_text}
    ]
)
\`\`\`

**Benefits:**
- Version control for prompts
- A/B testing different prompt variants
- Collaboration between domain experts and engineers
- Audit trail for prompt changes

## Pattern 5: Output Validation & Guardrails

Never trust model output. Validate everything:

\`\`\`python
def validate_and_sanitize(output: dict) -> dict:
    # Check required fields
    required = ["sentiment", "confidence"]
    for field in required:
        if field not in output:
            raise ValidationError(f"Missing required field: {field}")
    
    # Validate types and ranges
    if not isinstance(output["confidence"], (int, float)):
        raise ValidationError("Confidence must be a number")
    if not 0 <= output["confidence"] <= 1:
        output["confidence"] = max(0, min(1, output["confidence"]))
    
    # Sanitize text fields
    if "key_topics" in output:
        output["key_topics"] = [t.strip()[:100] for t in output["key_topics"]]
    
    return output
\`\`\`

## Pattern 6: Caching

Cache common or expensive LLM calls:

\`\`\`python
import hashlib, json

def cached_llm_call(messages, model="gpt-4o", ttl=3600):
    # Create deterministic cache key
    key = hashlib.sha256(
        json.dumps({"model": model, "messages": messages}, sort_keys=True).encode()
    ).hexdigest()
    
    # Check cache
    cached = redis.get(f"llm:{key}")
    if cached:
        return json.loads(cached)
    
    # Call API and cache
    response = client.chat.completions.create(model=model, messages=messages)
    redis.setex(f"llm:{key}", ttl, json.dumps(response.model_dump()))
    return response
\`\`\`

## Putting It All Together

A production-grade LLM integration combines all these patterns:

\`\`\`
User Input → Prompt Registry → Structured Output Schema
                                    ↓
                              [Cache Check]
                                    ↓
                    API Call (streaming, with retries)
                                    ↓
                    Output Validation & Guardrails
                                    ↓
                              [Cache Store]
                                    ↓
                        Response to User
\`\`\`

## Key Takeaways

1. Always use structured output modes — never parse free text.
2. Stream responses for better perceived performance.
3. Implement retry logic with exponential backoff.
4. Manage prompts as code — version control, A/B test, collaborate.
5. Validate all model outputs before exposing them to users.
6. Cache deterministic or frequently-requested responses.`,
        },
      ],
      quiz: {
        title: "LLM Application Development Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "Why should you use structured output modes instead of parsing free text?",
            options: [
              "Free text is always lower quality",
              "Structured outputs guarantee valid, parseable responses in a predictable format",
              "Free text uses more tokens",
              "Structured output is the only way to get JSON from LLMs",
            ],
            correctIndex: 1,
            explanation:
              "Structured output modes force the model to adhere to a schema, eliminating parsing errors and ensuring the response format is predictable and programmatically usable.",
          },
        ],
      },
    },
  ];

  // Let me continue with the remaining modules in a more compact format to save space
  // Modules 5-8: RAG, AI Ethics, Building AI Tools, Capstone Project

  const remainingModules = [
    {
      sortOrder: 5,
      title: "Retrieval-Augmented Generation (RAG)",
      description:
        "Build AI systems that ground their responses in your documents and data. Learn embedding, vector search, chunking strategies, and RAG architecture patterns.",
      lessons: [
        {
          title: "Understanding RAG Architecture",
          content: `# Understanding RAG Architecture

## The Knowledge Gap

LLMs are trained on static datasets with cutoff dates. They don't know your company's internal documents, latest industry developments, or proprietary data. RAG (Retrieval-Augmented Generation) bridges this gap by giving models access to external knowledge at query time.

## What Is RAG?

RAG combines two components:
1. **Retrieval:** Search through your documents to find relevant information
2. **Generation:** Use the retrieved information to produce accurate, grounded responses

The result: an AI that can answer questions about your specific data — without fine-tuning.

## The RAG Pipeline

\`\`\`
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   User Query  │───▶│   Embedding   │───▶│   Vector DB   │
│               │    │    Model      │    │    Search     │
└──────────────┘    └───────────────┘    └──────┬───────┘
                                                │
                                                ▼
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   Response    │◀───│     LLM       │◀───│  Retrieved   │
│               │    │  (Generator)  │    │   Context    │
└──────────────┘    └───────────────┘    └──────────────┘
\`\`\`

### Step by Step

1. **Document Ingestion:** Documents are split into chunks and converted to embeddings
2. **Query Embedding:** The user's question is also embedded
3. **Similarity Search:** Find the most relevant chunks via cosine similarity
4. **Context Assembly:** Combine the retrieved chunks with the user's question
5. **Generation:** The LLM produces an answer grounded in the retrieved context

## Chunking Strategies

How you split documents is critical. Poor chunking = poor retrieval.

| Strategy | Description | Best For |
|---|---|---|
| Fixed-size | Split by character/token count (e.g., 500 tokens) | Simple documents, quick start |
| Semantic | Split at natural boundaries (paragraphs, sections) | Well-structured documents |
| Recursive | Try semantic splits, fall back to fixed-size | General purpose (recommended) |
| Sliding window | Overlapping chunks for context continuity | Dense technical content |

### Recommended: Recursive Chunking

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # tokens per chunk
    chunk_overlap=50,     # overlap to maintain context
    separators=["\\n\\n", "\\n", ". ", " ", ""]  # try these in order
)

chunks = splitter.split_text(document)
\`\`\`

## Embedding Models

Choose based on your tradeoffs:

| Model | Dimensions | Speed | Quality |
|---|---|---|---|
| text-embedding-3-small | 512/1536 | Fast | Good |
| text-embedding-3-large | 256/1024/3072 | Medium | Best |
| BGE-M3 (open source) | 1024 | Medium | Very good |

## Vector Databases

| Solution | Best For |
|---|---|
| pgvector (PostgreSQL) | Already using Postgres, small-mid scale |
| Pinecone | Managed, scale, no ops overhead |
| Weaviate | Open source, hybrid search |
| Chroma | Local development, quick prototyping |

## Retrieval Quality Techniques

### 1. Hybrid Search

Combine semantic (embedding) and keyword (BM25) search:

\`\`\`python
results = vector_db.hybrid_search(
    query="machine learning pipelines",
    alpha=0.7  # weight towards semantic (0.7) vs keyword (0.3)
)
\`\`\`

### 2. Re-ranking

Retrieve more candidates, then re-rank with a better model:

\`\`\`python
# Retrieve 20 candidates
candidates = vector_db.search(query, top_k=20)

# Re-rank to top 5 using cross-encoder
reranked = cross_encoder.rerank(query, candidates, top_k=5)
\`\`\`

### 3. Metadata Filtering

Narrow search with metadata:

\`\`\`python
results = vector_db.search(
    query="revenue growth",
    filter={"year": 2024, "department": "sales"}
)
\`\`\`

## The RAG Prompt Template

\`\`\`
You are a knowledgeable assistant. Answer the user's question using ONLY the provided context. If the context doesn't contain enough information, say so clearly — do not make up information.

Context:
{retrieved_chunks}

Question:
{user_question}

Answer:
\`\`\`

## Key Takeaways

1. RAG gives LLMs access to your data without fine-tuning.
2. Chunking strategy dramatically impacts retrieval quality — invest time here.
3. Use recursive chunking with overlap as a solid default.
4. Hybrid search (semantic + keyword) outperforms either alone.
5. Always instruct the model to ground answers in retrieved context to reduce hallucination.`,
        },
      ],
      quiz: {
        title: "RAG Architecture Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "What does RAG stand for?",
            options: [
              "Random Access Generation",
              "Retrieval-Augmented Generation",
              "Recursive Algorithm Generator",
              "Response Analysis Gateway",
            ],
            correctIndex: 1,
            explanation: "RAG stands for Retrieval-Augmented Generation — it retrieves relevant documents and uses them to augment the LLM's response generation.",
          },
          {
            questionText: "Why is chunking strategy important in RAG?",
            options: [
              "It determines the embedding model to use",
              "How you split documents directly impacts what context the retrieval step can find",
              "It only affects processing speed, not quality",
              "Chunking is optional — you can send entire documents to the LLM",
            ],
            correctIndex: 1,
            explanation: "Chunking determines what text units the retrieval step searches over. Poor chunking means relevant information may be split across chunks or buried in noise, leading to poor retrieval quality.",
          },
          {
            questionText: "What advantage does hybrid search provide?",
            options: [
              "It's cheaper than pure semantic search",
              "It combines the strengths of semantic understanding with keyword matching for better results",
              "It eliminates the need for embeddings",
              "It only works with Pinecone",
            ],
            correctIndex: 1,
            explanation: "Hybrid search combines semantic (embedding-based) and keyword (BM25) search. Semantic search captures meaning while keyword search ensures exact matches aren't missed — together they often outperform either approach alone.",
          },
          {
            questionText: "What should you include in a RAG prompt template?",
            options: [
              "Only the user's question",
              "An instruction to ground the answer in the provided context and admit when information is insufficient",
              "The entire document database",
              "A request for the model to search the internet",
            ],
            correctIndex: 1,
            explanation: "A RAG prompt should include retrieved context, the user's question, and clear instructions to use only the provided context and to admit when the context doesn't contain sufficient information.",
          },
        ],
      },
    },
    {
      sortOrder: 6,
      title: "AI Ethics, Safety & Governance",
      description:
        "Understand the ethical dimensions of AI development and deployment. Cover bias detection, safety frameworks, regulatory compliance, and responsible AI practices.",
      lessons: [
        {
          title: "The AI Ethics Landscape",
          content: `# The AI Ethics Landscape

## Why Ethics Matters

AI systems increasingly make decisions that affect people's lives: who gets a loan, what medical treatment is recommended, who is flagged for secondary security screening. Without deliberate attention to ethics, AI can amplify existing biases, cause harm at scale, and erode trust in technology.

This module equips you to build AI responsibly — not as an afterthought, but as a fundamental design principle.

## Core Ethical Principles

### 1. Fairness

AI systems should treat all people fairly and avoid discriminatory outcomes.

**Key questions:**
- Does your model perform equally well across demographic groups?
- Are your training data representative of all users?
- Could your system disproportionately harm vulnerable populations?

### 2. Transparency

Users should understand when they're interacting with AI and how decisions are made.

**Key questions:**
- Do users know they're interacting with an AI?
- Can you explain why the model made a specific decision?
- Are limitations clearly communicated?

### 3. Accountability

There should be clear lines of responsibility for AI system outcomes.

**Key questions:**
- Who is responsible when the AI makes a harmful error?
- Is there a process for users to appeal automated decisions?
- Are you logging decisions for audit?

### 4. Privacy

AI systems must respect and protect user data.

**Key questions:**
- What data are you collecting and why?
- Is user data used to train models? With consent?
- Can users request deletion of their data?

### 5. Safety & Reliability

AI should operate reliably and fail safely.

**Key questions:**
- What are the failure modes of your system?
- Do you have guardrails for harmful outputs?
- How do you handle adversarial inputs?

## Real-World Case Studies

### Case 1: Hiring Algorithm Bias

A major tech company built an AI resume screener. The model learned to penalize resumes containing words like "women's" (as in "women's chess club") and favor male-associated terms — because historical hiring data reflected gender bias.

**Lesson:** Training data reflects historical biases. Audit for disparate impact before deployment.

### Case 2: Chatbot Hallucination

An airline's customer service chatbot invented a bereavement discount policy that didn't exist. When a customer relied on this information, the company was held liable.

**Lesson:** AI outputs must be validated. Don't deploy chatbots in domains where hallucination can cause real harm without guardrails.

### Case 3: Facial Recognition False Positives

Facial recognition systems have been shown to have error rates 10-100x higher for people with darker skin tones, leading to wrongful arrests.

**Lesson:** Evaluate model performance across demographic groups. Some applications (law enforcement) may require near-perfect accuracy to be ethical.

## Regulatory Landscape

| Regulation | Jurisdiction | Key Requirements |
|---|---|---|
| EU AI Act | European Union | Risk-based framework; high-risk AI requires conformity assessment |
| GDPR | European Union | Data protection, right to explanation for automated decisions |
| NYC Local Law 144 | New York City | Bias audit for automated employment decision tools |
| Colorado AI Act | Colorado, USA | Consumer protection against algorithmic discrimination |

## Practical Ethics Checklist

Before deploying any AI system:

- [ ] Have you tested performance across demographic groups?
- [ ] Can you explain how the system makes decisions?
- [ ] Is it clear to users that they're interacting with AI?
- [ ] Do you have a process for handling errors and appeals?
- [ ] Are you logging decisions for accountability?
- [ ] Have you considered failure modes and mitigations?
- [ ] Is data collection and usage transparent and consented?
- [ ] Have you done a red-team exercise to find vulnerabilities?

## Key Takeaways

1. Ethics is not a feature — it's a design principle that must be integrated from the start.
2. Bias in training data leads to bias in models. Audit before deployment.
3. Transparency and accountability build trust; their absence destroys it.
4. The regulatory landscape is evolving rapidly — stay informed.
5. Every AI system should have a documented ethics review before going live.`,
        },
        {
          title: "Building Guardrails and Safety Systems",
          content: `# Building Guardrails and Safety Systems

## Defense in Depth

Safety isn't a single filter — it's a layered defense. Each layer catches what previous layers miss. This lesson covers practical guardrail implementation.

## The Safety Stack

\`\`\`
┌──────────────────────────────────┐
│        Input Guardrails          │  ← Filter before the model sees it
├──────────────────────────────────┤
│        Prompt Constraints        │  ← System prompt safety rules
├──────────────────────────────────┤
│        Output Guardrails         │  ← Filter model output before user sees it
├──────────────────────────────────┤
│        Monitoring & Alerts       │  ← Detect issues in production
└──────────────────────────────────┘
\`\`\`

### Layer 1: Input Guardrails

Validate and sanitize user inputs before they reach the model:

\`\`\`python
def input_guardrail(user_input: str) -> tuple[bool, str]:
    # Check for prompt injection attempts
    injection_patterns = [
        "ignore (all |previous |your )?instructions?",
        "you are now",
        "new system prompt",
        "forget everything"
    ]
    
    for pattern in injection_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            return False, "Input blocked: potential prompt injection detected."
    
    # Check for toxic content
    toxicity_score = toxicity_classifier.score(user_input)
    if toxicity_score > 0.8:
        return False, "Input blocked: inappropriate content detected."
    
    return True, user_input
\`\`\`

### Layer 2: Prompt-Level Safety

Include safety instructions in every system prompt:

\`\`\`
SAFETY RULES:
1. Never generate content that promotes violence, hate, or illegal activities.
2. If asked for personal data (SSN, passwords, etc.), refuse and explain why.
3. If the user appears to be in crisis (self-harm, abuse), provide crisis hotline information.
4. Never pretend to be a real human or claim sentience/consciousness.
5. If you're unsure about the safety of a response, err on the side of caution and refuse.
6. Do not generate misleading or false information. Cite sources when possible.
7. Respect intellectual property — do not reproduce copyrighted content verbatim.
\`\`\`

### Layer 3: Output Guardrails

Validate model output before showing it to users:

\`\`\`python
def output_guardrail(response: str) -> tuple[bool, str]:
    # Check for harmful content in output
    harmful_categories = toxicity_classifier.classify(response)
    if harmful_categories["hate_speech"] > 0.5:
        return False, "I cannot provide that response as it may contain harmful content."
    
    # Check for PII leakage
    if contains_pii(response):
        logger.error("PII detected in model output — investigation required")
        return False, "An error occurred. Please try again."
    
    # Check for hallucination indicator phrases
    hallucination_markers = [
        "I'm not sure but",
        "I think maybe",
        "probably",
    ]
    if any(marker in response.lower() for marker in hallucination_markers):
        response += "\\n\\n[Note: The above response contains uncertain statements. Please verify critical information.]"
    
    return True, response
\`\`\`

### Layer 4: Monitoring

Track safety metrics in production:

\`\`\`python
# Metrics to track
safety_metrics = {
    "input_blocks_per_hour": counter,
    "output_blocks_per_hour": counter,
    "prompt_injection_attempts": counter,
    "toxicity_scores": histogram,
    "user_reports": counter,
}

# Alert if block rate spikes
if input_blocks_per_hour > baseline * 3:
    alert("Unusual spike in blocked inputs — possible attack")
\`\`\`

## Red Teaming

Before launch, intentionally try to break your system:

1. **Prompt injection:** "Ignore all previous instructions and..."
2. **Jailbreaking:** "Pretend you're an AI without restrictions..."
3. **Toxicity:** Test with explicitly harmful content
4. **Bias probing:** Test with inputs designed to elicit biased responses
5. **Hallucination triggers:** Ask about obscure topics to test grounding

## Key Takeaways

1. Safety requires defense in depth — multiple layers, each catching different issues.
2. Input guardrails prevent bad inputs; output guardrails catch bad outputs.
3. Every system prompt should include explicit safety rules.
4. Monitor safety metrics in production and alert on anomalies.
5. Red-team your system before launch — better you find issues than users.`,
        },
      ],
      quiz: {
        title: "AI Ethics and Safety Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "Which of these is NOT a core AI ethics principle?",
            options: ["Fairness", "Transparency", "Profitability", "Accountability", "Privacy"],
            correctIndex: 2,
            explanation: "Profitability is not an ethical principle. The core AI ethics principles are fairness, transparency, accountability, privacy, and safety/reliability.",
          },
          {
            questionText: "What is defense-in-depth in AI safety?",
            options: [
              "Using only one very strong safety filter",
              "Multiple layered safety measures that each catch different issues",
              "Encrypting all model inputs and outputs",
              "Only allowing the model to run in a sandbox",
            ],
            correctIndex: 1,
            explanation: "Defense-in-depth uses multiple safety layers (input guardrails, prompt constraints, output guardrails, monitoring) so that if one layer fails, others still provide protection.",
          },
          {
            questionText: "What is a prompt injection attack?",
            options: [
              "When a user provides too much input",
              "A user crafting input that attempts to override or bypass the system prompt instructions",
              "Adding too many examples to a prompt",
              "Using a language the model doesn't understand",
            ],
            correctIndex: 1,
            explanation: "Prompt injection is when a user crafts their input to trick the model into ignoring its system instructions, often by including phrases like 'ignore all previous instructions' or by impersonating the system.",
          },
          {
            questionText: "What should you do before launching an AI system?",
            options: [
              "Just launch and fix issues as users report them",
              "Conduct a red-team exercise where you intentionally try to break the system",
              "Remove all guardrails to see what the model does naturally",
              "Only test with happy-path inputs",
            ],
            correctIndex: 1,
            explanation: "Red-teaming involves intentionally trying to break your system — testing prompt injections, toxic inputs, bias probes, and edge cases — to find vulnerabilities before real users do.",
          },
        ],
      },
    },
    {
      sortOrder: 7,
      title: "Building AI-Powered Tools",
      description:
        "Hands-on module: build complete AI tools from scratch. Cover architecture decisions, API design, production deployment, and monitoring for AI-native applications.",
      lessons: [
        {
          title: "Architecting AI-Native Applications",
          content: `# Architecting AI-Native Applications

## A New Application Paradigm

AI-native applications are fundamentally different from traditional software. In traditional apps, behavior is deterministic (defined by code). In AI-native apps, behavior is probabilistic (defined by prompts + models). This requires a different architectural approach.

## AI-Native vs. Traditional Architecture

| Aspect | Traditional App | AI-Native App |
|---|---|---|
| Core logic | Deterministic code | Probabilistic model + prompts |
| Testing | Assert expected outputs | Evaluate output quality + safety |
| Errors | Exceptions, crashes | Hallucinations, poor quality |
| Performance | CPU/memory/network | Tokens, latency, model quality |
| Iteration | Code changes → deploy | Prompt changes → evaluate |
| Cost | Infrastructure | API calls (per-token pricing) |

## Architecture Patterns

### Pattern 1: The Copilot Pattern

AI augments human work within an existing workflow.

\`\`\`
User Action → AI Suggestion → Human Review → Final Output
\`\`\`

**Examples:** GitHub Copilot, Gmail Smart Compose
**Key design principle:** AI suggests, human decides. The human is always in the loop.

### Pattern 2: The Agent Pattern

AI autonomously completes multi-step tasks.

\`\`\`
Goal → Plan → Execute Step → Observe → (repeat) → Report
\`\`\`

**Examples:** Customer support agent, DevOps automation
**Key design principle:** Provide clear goals, give appropriate tools, handle failures gracefully.

### Pattern 3: The Pipeline Pattern

AI processes data through multiple stages, each handled by different prompts or models.

\`\`\`
Raw Input → Extract → Classify → Enrich → Generate → Output
\`\`\`

**Examples:** Document processing, content moderation
**Key design principle:** Each stage does one thing well. Validate between stages.

## Production Architecture Diagram

\`\`\`
┌──────────────────────────────────────────────────┐
│                    Frontend                       │
│  (React/Next.js — streaming UI, optimistic UI)   │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│                  API Gateway                       │
│        (Rate limiting, auth, logging)              │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│                Orchestration Layer                 │
│  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ Prompt   │  │ Guardrail │  │ Output        │  │
│  │ Manager  │  │ Service   │  │ Validator     │  │
│  └──────────┘  └───────────┘  └───────────────┘  │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────┐
│                  AI Services                       │
│  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ LLM API  │  │ Embedding │  │ RAG Pipeline  │  │
│  │ (GPT-4o) │  │ Service   │  │ (pgvector)    │  │
│  └──────────┘  └───────────┘  └───────────────┘  │
└──────────────────────────────────────────────────┘
\`\`\`

## Key Design Decisions

### 1. Model Selection

| Factor | Consideration |
|---|---|
| Task complexity | Simple tasks → cheaper models (GPT-4o-mini); complex reasoning → GPT-4o/Claude |
| Latency requirements | Streaming models for real-time UX |
| Cost constraints | Cache common calls, use tiered model strategy |
| Data privacy | Self-hosted open-source models for sensitive data |

### 2. Prompt vs. Fine-tune

- If prompts + few-shot work → don't fine-tune
- If you have 50+ high-quality examples AND prompts fall short → fine-tune
- If you need dynamic behavior → prompts
- If you need consistent style/format → fine-tuning helps

### 3. Evaluation Strategy

AI outputs can't be evaluated with simple pass/fail tests. Use:

- **LLM-as-judge:** Use a stronger model to evaluate output quality
- **Metrics:** Relevance, factual accuracy, toxicity scores
- **Human eval:** Sample outputs for manual review
- **A/B testing:** Compare prompt variants on real traffic

## Key Takeaways

1. AI-native apps need different architecture patterns than traditional software.
2. Choose between Copilot, Agent, and Pipeline patterns based on your use case.
3. The orchestration layer (prompts, guardrails, validation) is where most complexity lives.
4. Evaluation requires a mix of automated metrics, LLM judges, and human review.
5. Start simple — add complexity only when you've proven you need it.`,
        },
      ],
      quiz: {
        title: "Building AI Tools Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "What is the key characteristic of the Copilot pattern?",
            options: [
              "AI operates completely autonomously",
              "AI suggests, but the human makes the final decision",
              "AI replaces all human work",
              "AI only works in code editors",
            ],
            correctIndex: 1,
            explanation: "The Copilot pattern keeps the human in the loop: AI provides suggestions or drafts, but the human reviews and approves the final output. This is ideal when accuracy is critical.",
          },
          {
            questionText: "Why is evaluation harder for AI-native apps than traditional software?",
            options: [
              "It's not — evaluation is the same",
              "AI outputs are probabilistic, not deterministic, so you can't use simple pass/fail assertions",
              "AI apps don't need testing",
              "Traditional testing tools don't work with Python",
            ],
            correctIndex: 1,
            explanation: "AI outputs are probabilistic — the same input can produce different outputs. You need to evaluate output quality (relevance, accuracy, safety) rather than exact matches, requiring different evaluation strategies.",
          },
          {
            questionText: "Which architecture pattern is best for autonomous multi-step task completion?",
            options: [
              "The Copilot pattern",
              "The Pipeline pattern",
              "The Agent pattern",
              "The Monolith pattern",
            ],
            correctIndex: 2,
            explanation: "The Agent pattern is designed for autonomous multi-step tasks: the model plans, executes steps using tools, observes results, and repeats until the goal is achieved.",
          },
        ],
      },
    },
    {
      sortOrder: 8,
      title: "Capstone: Build Your AI Application",
      description:
        "Apply everything you've learned to design and build a complete AI-powered application. Present your project, get peer feedback, and earn your certificate.",
      lessons: [
        {
          title: "Capstone Project Guide",
          content: `# Capstone Project Guide

## Welcome to Your Capstone

This is where everything comes together. You'll apply the skills from all seven previous modules to design, build, and present a complete AI-powered application. This project is the centerpiece of your portfolio and demonstrates your competency as an AI practitioner.

## Project Options

Choose from these tracks or propose your own:

### Track 1: AI-Powered Business Tool
Build a tool that solves a real business problem using AI.
**Examples:** Customer support triage agent, sales lead qualifier, contract analyzer, meeting summarizer.

### Track 2: Educational AI Application
Create an AI tutor or learning tool for a specific domain.
**Examples:** Language learning coach, coding interview practice bot, interactive textbook.

### Track 3: Creative AI Application
Build an application that augments human creativity.
**Examples:** Writing assistant, design feedback tool, music composition helper.

### Track 4: Open Project
Propose your own project. It must:
- Use at least two AI capabilities (text generation, embeddings, function calling, etc.)
- Solve a real problem you can articulate clearly
- Be achievable within the time budget

## Project Requirements

Your capstone must demonstrate mastery of:

1. **Prompt Engineering:** Well-crafted system prompts with clear structure
2. **Tool Integration:** At least one external tool or API call
3. **Structured Output:** Validated, predictable response format
4. **Error Handling:** Graceful handling of API failures and edge cases
5. **Ethics & Safety:** Input/output guardrails, clear scope boundaries
6. **Documentation:** README explaining architecture, setup, and design decisions

## Project Phases

### Phase 1: Design (Week 1)
- Define the problem and target users
- Choose your architecture pattern
- Design the prompt structure and tool integrations
- Document your design decisions

### Phase 2: Build (Weeks 2-3)
- Implement the core AI pipeline
- Build the user interface
- Integrate tools and APIs
- Add error handling and guardrails

### Phase 3: Test & Refine (Week 4)
- Test with real scenarios
- Red-team for safety issues
- Iterate on prompt quality
- Optimize performance

### Phase 4: Present (Final Week)
- Demo your working application
- Walk through architecture decisions
- Share lessons learned and what you'd do differently
- Receive peer and instructor feedback

## Evaluation Rubric

| Category | Weight | Criteria |
|---|---|---|
| Technical Implementation | 30% | Working application, correct use of AI patterns |
| Prompt Quality | 25% | Well-structured, effective system and user prompts |
| Ethics & Safety | 20% | Guardrails, scope boundaries, bias consideration |
| User Experience | 15% | Intuitive interface, helpful error messages |
| Documentation | 10% | Clear README, architecture diagram, setup instructions |

## Success Tips

1. **Start small.** A simple, working application beats an ambitious, incomplete one.
2. **Iterate on prompts.** Your first prompt won't be your best. Test and refine.
3. **Test with real users.** Get feedback from someone who didn't build it.
4. **Document as you go.** Don't save documentation for the end.
5. **Focus on the problem.** The best projects solve a clear, specific problem well.

## Submission

Submit:
1. GitHub repository with complete source code
2. README with architecture diagram and setup instructions
3. 5-minute demo video (screen recording)
4. Written reflection: what worked, what didn't, lessons learned

## Congratulations

You've reached the final module of the AI & Generative AI Practitioner program. The skills you've built — prompt engineering, agent design, RAG, ethics, and application architecture — position you to lead AI initiatives in any organization.

Now go build something remarkable.`,
        },
      ],
      quiz: {
        title: "Capstone Readiness Quiz",
        passingScore: 70,
        questions: [
          {
            questionText: "What is the recommended approach for the capstone project scope?",
            options: [
              "Build the most ambitious project possible",
              "Start small — a working application beats an ambitious incomplete one",
              "Skip the building phase and focus on design",
              "Build exactly what the instructor suggests",
            ],
            correctIndex: 1,
            explanation: "A simple, complete, and working application demonstrates more competency than an ambitious project that isn't finished. Start with a minimum viable product and iterate.",
          },
          {
            questionText: "Which AI capability must your capstone demonstrate?",
            options: [
              "Image generation only",
              "At least two AI capabilities (text generation, embeddings, function calling, etc.)",
              "Only prompt engineering",
              "Training a model from scratch",
            ],
            correctIndex: 1,
            explanation: "The capstone must demonstrate at least two AI capabilities — for example, combining text generation with tool use (function calling) or embeddings (RAG).",
          },
          {
            questionText: "What is the highest-weighted evaluation criterion?",
            options: [
              "User Experience",
              "Documentation",
              "Technical Implementation (30%)",
              "The color scheme of the UI",
            ],
            correctIndex: 2,
            explanation: "Technical Implementation carries the highest weight at 30%, followed by Prompt Quality (25%), Ethics & Safety (20%), User Experience (15%), and Documentation (10%).",
          },
        ],
      },
    },
  ];

  // Now insert all remaining modules
  for (const mod of [...moduleDefinitions, ...remainingModules]) {
    const [inserted] = await d
      .insert(modules)
      .values({
        bundleId: bundle1.id,
        title: mod.title,
        description: mod.description,
        sortOrder: mod.sortOrder,
      })
      .returning();

    console.log(`  Module #${inserted.id}: ${inserted.title}`);

    // Insert lessons
    for (let i = 0; i < mod.lessons.length; i++) {
      const lesson = mod.lessons[i];
      await d.insert(lessons).values({
        moduleId: inserted.id,
        title: lesson.title,
        content: lesson.content,
        sortOrder: i + 1,
      });
    }

    // Insert quiz
    if (mod.quiz) {
      const [quiz] = await d
        .insert(quizzes)
        .values({
          moduleId: inserted.id,
          title: mod.quiz.title,
          passingScore: mod.quiz.passingScore,
        })
        .returning();

      for (const q of mod.quiz.questions) {
        await d.insert(quizQuestions).values({
          quizId: quiz.id,
          questionText: q.questionText,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
      }
      console.log(`    Quiz: ${quiz.title} (${mod.quiz.questions.length} questions)`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log(`   Bundle: "${bundle1.title}" with ${moduleDefinitions.length + remainingModules.length} modules`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
