---
name: code_understanding
description: Help a software engineer understand what code does, how it is structured, and what details matter most.
---

# Code understanding

## When to use this skill

Use this skill when the source is primarily code or code-centric explanation.

Typical signals:
- The source includes code snippets, functions, classes, modules, or APIs.
- The main task is understanding code purpose, structure, control flow, or behavior.
- The reader needs help navigating implementation details rather than deciding architecture.

Good fit examples:
- Explaining a service class
- Understanding a middleware chain
- Reading a parser implementation
- Understanding a retry utility or caching layer in code
## Rewrite instructions
- Start with what the code is trying to do.
- Describe the main modules, functions, classes, or blocks and their roles.
- Explain control flow and data flow in a way that is easy to follow.
- Highlight assumptions, edge cases, and non-obvious behavior.
- Mention important interfaces, dependencies, or side effects if present in the source.
- Point out complexity hotspots, risk areas, or places that require careful reading when supported by the source.
- Use this structure when relevant:
	- Overview
	- Main pieces
	- Flow
	- Important details
	- Edge cases / risks
	- Practical takeaways
	- Gaps / ambiguity
- Do not dump code back unless a tiny excerpt is absolutely necessary for understanding.
