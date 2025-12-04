# AI Agent Workflow Log

This document describes how AI agents (ChatGPT, Cursor Agent, GitHub Copilot, Claude Code) were used during the development of the FuelEU Maritime Compliance Platform.

## 1. Agents Used
🧠 ChatGPT (GPT-5.1)

Used for:

High-level architectural planning

Breaking down domain logic (CB formula, pooling maths)

Generating initial use-case scaffolds

Creating documentation (README.md, AGENT_WORKFLOW.md, REFLECTION.md)

🖥️ Cursor AI Agent

Used for:

File-by-file code generation

Maintaining folder structure aligned with hexagonal architecture

Continuous refactoring and code completion

⚡ GitHub Copilot

Used for:

Inline code suggestions

Boilerplate Express controller patterns

Quick React component scaffolding

Tailwind utility suggestions

🧩 Claude Code (Anthropic)

Used for:

Refactoring pooling logic

Detecting edge cases in CB calculations

Improving validation rules

## 2. Prompts & Outputs

Below are real examples of prompts and the resulting outputs (summarized).

### Example 1 — Backend Architecture Generation

Prompt given to ChatGPT:

“Generate a backend folder structure using Hexagonal Architecture for a FuelEU Maritime project with domain, application, ports, Prisma repositories, and Express controllers.”

AI Output Summary:

Core domain & use cases structured

Ports (interfaces) created for Routes, Compliance, Banking, Pooling

Adapters separated cleanly between inbound/outbound

Server bootstrap created under infrastructure

Refinement:
I removed unnecessary abstractions and added missing modules specific to the FuelEU specification (like adjusted CB & greedy pooling allocation).

### Example 2 — Pooling Logic Refactor (Claude Code)

Prompt:

“Refactor the pooling allocation algorithm to avoid mutating original arrays and enforce FuelEU rules (no deficit ship exits worse, no surplus ship becomes negative).”

Output:

Claude generated a pure-function version using map & reduce

Removed mutation bugs and ensured compliant transitions

Corrections:

Added missing validation: total pool CB ≥ 0

Added sorting logic for greedy allocation

### Example 3 — React Routes Table (Copilot)

Prompt inline inside file:

// Create a responsive Tailwind Routes table with baseline button


Copilot Output:
Generated:

<table> with proper headers

Map through routes data

“Set Baseline” button with callback

Fixes applied:

Added accessibility roles

Added better key indexing

Added conditional badge UI

### Example 4 — Documentation Generation (ChatGPT)

Prompt:

“Create a professional README for FuelEU Maritime with setup instructions and architecture summary.”

Output:

Provided structure

Included diagrams and explanations

Corrections:

Added missing screenshot placeholders

Added example API responses

## 3. Validation / Corrections

Every AI-generated output was manually verified:

✔ Code validated through:

TypeScript compiler

Runtime execution in backend

Prisma schema migration

Test runs (manual + automated)

Frontend component rendering

✔ Manual corrections included:

Fixing incorrect CB calculations

Rewriting state mutation logic in pooling

Adding missing error handling

Aligning with exact FuelEU formulas (Annex IV)

Enforcing hexagonal architecture rules

Ensuring no domain logic leaked into controllers or UI

✔ Security validations:

Removed unused imports

Sanitized Express handler inputs

Disabled implicit any

Ensured environment variables loaded properly

## 4. Observations
Where AI saved significant time

Creating boilerplate (ports, use-cases, controllers)

React table/chart components

Prisma repository scaffolding

Documentation formatting

Where AI hallucinated

Suggesting wrong CB formula

Creating duplicate layers in architecture

Express v5 syntax instead of stable v4

Suggesting invalid Prisma field names

How I resolved hallucinations

Manually checked FuelEU regulation PDF

Ran Prisma schema validations

Simplified architecture to avoid over-engineering

Rewrote parts of pooling logic manually

Where AI combined well with human input

Cursor allowed rapid navigation & refactoring

Copilot accelerated UI development

ChatGPT excelled at domain modelling and explanations

## 5. Best Practices Followed
✔ Used Cursor’s tasks.md

For breaking down the project into modular tasks, like:

Creating domain entities

Implementing use-case

Defining ports

Writing repositories

✔ Copilot for inline code generation

Tables

Hooks

TypeScript interfaces

Express handlers

✔ Claude for deeper refactoring

Ensured pooling constraints were correct

Helped avoid side-effects and mutations

✔ ChatGPT for:

Stepwise planning

Debugging Prisma migration failures

Writing documentation

Reviewing architecture decisions

## 🔚 Final Remarks

AI agents significantly accelerated development,
but critical business logic (FuelEU rules) still required manual verification.
The combination of AI + human domain reasoning resulted in a maintainable, production-grade implementation