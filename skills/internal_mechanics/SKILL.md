---
name: internal_mechanics
description: Explain how a system works internally in a clear, learnable order.
---

# Internal mechanics

## When to use this skill

Use this skill when the source is mainly about how something works internally.

Typical signals:
- The source explains runtime behavior, architecture flow, lifecycle, state transitions, or component interactions.
- The content describes mechanisms, pipelines, request flow, data flow, or execution order.
- The main value comes from understanding internals, not from deciding whether to use it.

Good fit examples:
- How a database query planner works
- How a message queue processes messages
- How React rendering works internally
- How a cache invalidation flow is executed
## Rewrite instructions

- Focus on how the system works internally.
- Identify the main components, states, flows, and interactions.
- Rewrite the mechanism in a more learnable order if needed.
- Explain cause-and-effect clearly.
- Highlight inputs, outputs, transformations, side effects, and control points.
- Call out invariants, bottlenecks, constraints, or failure points if the source mentions them.
- Use this structure when relevant:
	- Overview
	- Main components
	- Execution flow
	- Key mechanisms
	- Constraints / failure points
	- Practical takeaways
	- Gaps / ambiguity
- Favor operational understanding over abstract summary.
