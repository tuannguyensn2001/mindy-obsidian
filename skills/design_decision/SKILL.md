---
name: design_decision
description: Clarify the rationale behind a technical or architectural decision.
---

# Design decision

## When to use this skill

Use this skill when the source is mainly explaining why a particular design choice was made.

Typical signals:
- The source contains explicit rationale, constraints, and trade-offs.
- The content is about choosing one design over alternatives.
- The reader needs to understand the reasoning behind a technical decision.

Good fit examples:
- Why a team chose PostgreSQL over DynamoDB
- Why a service uses async processing instead of synchronous requests
- Why a system moved from polling to event-driven architecture
- Why a project adopted CQRS
## Rewrite instructions
- Identify the decision as early as possible.
- Explain the problem, context, and constraints that led to the decision.
- Highlight alternatives if the source mentions them.
- Make trade-offs explicit: what was gained, what was sacrificed, and why.
- Distinguish clearly between requirements, preferences, assumptions, and consequences.
- Use this structure when relevant:
	- Overview
	- Decision
	- Context and constraints
	- Alternatives considered
	- Trade-offs
	- Final rationale
	- Practical implications
	- Gaps / ambiguity
- Keep the focus on the decision logic, not on generic topic summary.
