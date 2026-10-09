---
title: "FluentGraph — Semantic Intelligence Layer for ServiceNow Fluent & LLM Systems"
date: 2026-02-15
section: essay
tags: ["Fluent-Graph","ServiceNow","AI","Blast Radius","CI/CD"]
summary: "Map every table, script and relationship across your ServiceNow Fluent application, and know the full blast radius of any change before it reaches production."
---

*Open Source · MIT License · ServiceNow Fluent SDK 4.x.x*

Map every table, script, and relationship across your Fluent application. Know the full blast radius of any change — before it reaches production.

FluentGraph is an semantic layer that enables LLMs to safely understand, reason about, and interact with ServiceNow Fluent systems using structured context instead of raw code.

[Get started free on npm](https://www.npmjs.com/package/@yesprasad/fluent-graph) · [View on GitHub](https://github.com/yesprasad/fluent-graph)

▶ MCP compatible · ⏱ One-command analysis · ⚙ Zero configuration · ▶ CI/CD compatible

```text title="fluent-graph analyze — ITSM Application"
$ fluent-graph analyze
── Scanning project artifacts...

📦 DATA SCHEMA ─────────────────────────────────────
Table                         Source File          Status
x_1566_seventh_account        tables/account.ts    ✓ active
x_1566_seventh_customer       tables/customer.ts   ✓ active
x_1566_seventh_risk_score     tables/risk_score.ts ✓ active
x_1566_seventh_fraud_alert    tables/fraud.ts      ✓ active

🔗 SCHEMA RELATIONSHIPS ────────────────────────────
Source Field          → Target Table               Type
account.owner         → x_1566_seventh_customer    reference
fraud_alert.account   → x_1566_seventh_account     reference
critical_account.team → sys_user_group             reference

⚙️ LOGIC ATTACHMENTS ──────────────────────────────
Artifact                     Table           Trigger     State
bank_incident_onload         incident        [onLoad]    active
cs_incident_onload           incident        [onLoad]    active
cs_incident_onchange_caller  incident        [onChange]  active
cs_account_onchange_type     x_1566_account  [onChange]  active
Auto-close empty Changes     change_request  [action]    review

✓ Analysis complete — 9 tables · 8 relationships · 9 scripts
Output written to fluent-graph.json
```

## The problem: production breaks are *preventable*

ServiceNow Fluent applications grow quickly. What begins as a handful of clean tables becomes a dense network of scripts, business rules, and cross-references. Without visibility into those connections, every refactor is a gamble.

### Scenario A: You delete a field. Production breaks.

Fourteen client scripts fail. Three business rules throw errors. Two dashboards go blank. You discover the full scope — at runtime, in production.

```text
Error: Field 'caller_id' not found
  at ClientScript: cs_incident_onload
  at ClientScript: bank_incident_onload
  + 12 more...
```

### Scenario B: A new developer joins. No one knows the app.

Understanding how tables interconnect, which scripts are active, and why certain business rules exist takes days of exploration — time that should be spent shipping features.

### Root cause: ServiceNow Fluent needs a dependency graph

The most critical question before any change: *what else does this touch?* FluentGraph is that answer — a free, one-command tool that draws a complete map of your project.

## Everything your team needs to *ship with confidence*

FluentGraph surfaces the architectural intelligence already embedded in your project — structured, queryable, and ready for automated pipelines.

- **Artifact lineage.** A complete inventory of every table, field, client script, business rule, UI action, and ACL — each mapped to its source file and active state.
- **Schema relationships.** Every foreign-key reference and table extension within your app, including links to platform tables like `sys_user` and `incident`.
- **Blast radius analysis.** Run a single command to enumerate every artifact affected if you modify or remove a target table. Know the full impact before the first line changes.
- **CI/CD integration.** Outputs a machine-readable `fluent-graph.json` artifact purpose-built for automated pipeline checks. Intercept conflicts before the merge queue.
- **Logic attachment mapping.** Associates every onLoad, onChange, and onSubmit script with its owning table, trigger type, and active state — making dormant code visible at a glance.
- **Rapid onboarding.** New engineers understand the full application architecture in minutes rather than days. The entire dependency graph is a single command away.

## Three sections. *Complete visibility.*

Run `fluent-graph analyze` and get a clean, readable report divided into three sections — plus a machine-readable JSON file for your pipelines.

### 01 — Data schema: your table inventory

A clean list of every custom table alongside its source file and active status.

- Table name and scope
- Source file location
- Active / deleted status
- Visibility attributes

### 02 — Schema relationships: how your tables talk

Every reference field connection — including links out to platform tables outside your scope.

- Source table and field name
- Target table (local or platform)
- Reference type and direction
- Cross-scope dependencies

### 03 — Logic attachments: every script mapped

Each client script, business rule, and UI action listed with the table it attaches to and its trigger type.

- onLoad / onChange / onSubmit
- Business rules and script includes
- UI actions and ACLs
- Active vs inactive state

## Know what breaks *before you deploy*

Before renaming, modifying, or removing any table, run one additional command. FluentGraph traverses your entire dependency graph and returns a ranked list of every artifact affected — along with a calculated risk level.

```bash
$ fluent-graph blast incident
```

**🔥 Blast Radius — incident · LOW RISK**

| Artifact | Type | Trigger |
| --- | --- | --- |
| bank_incident_onload | client_script | onLoad |
| cs_incident_onload | client_script | onLoad |
| cs_incident_onchange_caller | client_script | onChange |

*Total impacted: 3 artifacts · client_script ×3*

**🔥 Blast Radius — x_1566039_seventh_account · MEDIUM RISK**

| Artifact | Type | Reason |
| --- | --- | --- |
| cs_account_onchange_type | client_script | onChange |
| x_1566_seventh_fraud_alert | field | FK via account |
| x_1566_seventh_risk_score | field | FK via account |
| x_1566_seventh_account_ext | field | FK via linked_account |

*Total impacted: 5 artifacts · client_script ×1 · field ×3*

> "Running blast radius before a major refactor revealed that deleting a custom field would have broken four client scripts, two business rules, and a UI action — all before a single line was deployed to production." — Eshwar Prasad Yaddanapudi, Creator of FluentGraph

## Up and running *in under a minute*

FluentGraph requires Node.js 18 or later and an initialized ServiceNow Fluent SDK project. No account, no configuration file, no API keys.

1. **Install globally via npm.** Install the package once and use it across all your Fluent projects. Or invoke on-demand with npx without a global install.

   ```bash
   npm install -g @yesprasad/fluent-graph
   ```

2. **Analyze your Fluent project.** Navigate to the root of any Fluent project and run the analysis command. FluentGraph scans your artifact directory and produces a full dependency report in seconds.

   ```bash
   fluent-graph analyze
   ```

3. **Run blast radius before any breaking change.** Before modifying any table, supply its name as a target. FluentGraph returns the complete list of affected artifacts and a risk-level assessment.

   ```bash
   fluent-graph blast <table_name>
   ```

4. **Wire into your CI/CD pipeline.** The generated `fluent-graph.json` integrates with any pipeline. Add the step to your GitHub Actions workflow to block merges that introduce identity conflicts.

## Catch conflicts *before the merge*

FluentGraph outputs structured JSON designed for automated pipeline consumption. Gate your deployments on dependency integrity without writing a single custom script.

```yaml title=".github/workflows/fluent-check.yml"
name: Fluent Dependency Check
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      # Extract full artifact lineage
      - name: Run FluentGraph
        run: npx @yesprasad/fluent-graph analyze

      # Block merge on identity conflicts
      - name: Validate dependency graph
        run: |
          if grep -q '"action": "CONFLICT"' fluent-graph.json; then
            echo "Identity conflicts detected"
            exit 1
          fi
```

- ✓ Runs in GitHub Actions, GitLab CI, or Jenkins
- ✓ No authentication or external network calls required
- ✓ Structured JSON output for custom pipeline logic
- ✓ Automatically blocks deploys with unresolved identity conflicts
- ✓ Integrates with existing Fluent SDK toolchain workflows

---

**Open Source · Free Forever.** Map your application. *Ship with certainty.* Drop FluentGraph into any ServiceNow Fluent project and get your complete dependency graph in under sixty seconds. [View on npm](https://www.npmjs.com/package/@yesprasad/fluent-graph) · [Star on GitHub](https://github.com/yesprasad/fluent-graph)
