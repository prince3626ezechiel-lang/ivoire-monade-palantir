# n8n-workflow-automation

Use this skill when the task relates to n8n workflow automation: designing, inspecting, editing, or deploying n8n workflows; choosing nodes; validating compatibility; or applying ready-made templates.

Source repo: https://github.com/PentagonRBX/n8n-skills

## When to use
- User mentions n8n workflows, automation, node compatibility, or templates.
- Need structured guidance for 545 n8n nodes or 20 common workflow templates.
- Want to validate whether chosen nodes can be connected and executed.

## Default workflow
1. Clarify the automation goal and inputs/outputs.
2. Map the goal to n8n nodes using ranked guidance from the source skill pack.
3. Check compatibility between chosen nodes before finalizing connections.
4. Prefer a ready template from the collection when it closely matches the requirement.
5. If credentials are required, flag them explicitly and do not store secrets in exported JSON.
6. Export or describe the workflow as JSON, and note any manual setup steps.

## Constraints
- Do not assume credentials are configured.
- Do not modify live n8n instances without explicit confirmation.
- Keep exports minimal and redact secrets.
