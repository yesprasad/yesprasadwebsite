---
name: deep-graph
kicker: Open source · AI code review
tagline: Structural context for AI code review. Answers one question for TypeScript and Java codebases — what breaks if this file changes?
since: "2026"
order: 2
command: npx @yesprasad/deep-graph blast src/types/graph.ts
stack: TypeScript · Java · npm
features: [Path aliases, Barrel re-exports, Cross-package imports, TypeScript & Java]
facts:
  - { label: Status, value: v0.1 · Active }
  - { label: Language, value: TypeScript }
  - { label: Supports, value: "TypeScript, Java" }
  - { label: Since, value: "2026" }
links:
  - { label: GitHub, url: "https://github.com/yesprasad/deep-graph" }
  - { label: npm, url: "https://www.npmjs.com/package/@yesprasad/deep-graph" }
---

AI code review tools read diffs. They don't know what depends on what you changed. deep-graph builds a dependency graph from the strongest semantic information available in the repository and traces a pull request's blast radius, with no string matching.
