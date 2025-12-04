# Reflection on AI-Augmented Development

This project was my first fully AI-augmented implementation of a complete full-stack system following a strict architectural pattern (Hexagonal / Ports & Adapters).
Working with AI agents such as ChatGPT, Cursor Agent, GitHub Copilot, and Claude Code provided a unique opportunity to compare manual development with AI-assisted workflows and understand where these tools excel or struggle.

## 1. What I Learned Using AI Agents
1.1 AI is excellent at scaffolding and boilerplate generation

I learned that AI tools can instantly produce clean scaffolds for use-cases, ports, controllers, repository patterns, and React UI components.
This allowed me to focus more on domain correctness rather than repetitive setup code.

1.2 AI accelerates architectural thinking

When designing the Hexagonal Architecture, ChatGPT helped explore multiple layouts before finalizing one that matched the FuelEU specifications.
It acted almost like a senior engineer reviewing decisions and pointing out missing abstractions.

1.3 AI cannot replace domain understanding

FuelEU Maritime regulation has mathematical and legal nuance.
AI frequently hallucinated parts of the CB formula or pooling constraints.
I learned that AI outputs must always be validated against the official regulatory documents.

1.4 Combining multiple agents is more powerful than using one

ChatGPT → reasoning + structure

Copilot → inline code

Cursor → project-wide refactoring

Claude → deeper refactoring & bug detection

Each tool has different strengths, and coordinating them produced the best results.

## 2. Efficiency Gains vs Manual Coding
2.1 Time saved in setup and boilerplate

Tasks that typically take 3–4 hours manually (folder structure, file creation, controller skeletons, UI layout) were reduced to 20–30 minutes with AI.

2.2 Faster iteration cycles

AI agents allowed me to quickly prototype different approaches to pooling logic, adjust domain entities, and rewrite UI sections without losing momentum.

2.3 Reduced cognitive load

AI handled repetitive tasks, letting me focus on:

domain constraints,

validation rules,

API correctness,

overall architecture.

This is where human judgement matters most.

2.4 Time lost debugging hallucinations

AI occasionally produced incorrect Prisma fields, invalid TypeScript types, or theoretical formulas that didn’t match FuelEU regulation.
Fixing these required manual judgement.

Still, the net efficiency was significantly higher compared to building everything manually.

## 3. Improvements I Would Make Next Time
3.1 More up-front constraints for AI prompts

I would describe constraints more explicitly, such as:

“Do not invent fields not present in schema.”

“Keep domain logic pure and side-effect free.”

“Follow the Ports & Adapters pattern strictly.”

Better prompts → better output.

3.2 Maintain a prompt log from the beginning

Although AGENT_WORKFLOW.md documents key prompts, next time I would maintain a continuous prompt log to track decisions and changes more systematically.

3.3 Earlier integration testing

Integration issues (like mismatched field names) appeared late.
Next time, I would generate integration tests earlier to detect mismatches sooner.

3.4 Use AI to compare different algorithmic approaches

Especially for pooling, AI could have generated multiple strategies side-by-side.
Doing this earlier would have made final decisions quicker.

## Final Thoughts

This assignment demonstrated the true potential of AI-augmented development:
AI does not replace engineering skill — it amplifies it.
Where AI provided speed, I provided correctness.
Where AI generalized, I applied domain understanding.

The result was a cleaner, faster, and more maintainable implementation than what I could have built alone in the same time window.