# Case Management Platform — Configurable Screening Prototype

A React prototype demonstrating a **single Case Management Platform** supporting multiple screening types through configuration.

> **Architecture documentation:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system design — layers, configuration model, workflow engine, component registry, data flow, and production migration path.

## Overview

```text
One Case Management Platform
  → Multiple Screening Types (Customer, Transaction, Security)
  → Reusable UI Components (Component Registry)
  → Configurable Screening Profiles (screening-profiles.json)
  → Configurable Workflows (workflows.json)
  → Configurable UI Layouts (ui-configurations.json)
  → Configurable Routing (direct L2 entry via workflow config)
  → Common Case Lifecycle
```

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS v4
- JSON mock data with localStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, layers, configuration model, workflows, extension points |
| [README.md](./README.md) | Quick start, demo scenarios, project overview |

## Key Demo Scenarios

| Scenario | Case ID | What to observe |
|----------|---------|-----------------|
| Customer Screening | CASE-2025-0001 | Customer details, related parties, screening results |
| Transaction Screening | CASE-2025-0006 | SWIFT/ISO message, transaction details, related info |
| Security Screening | CASE-2025-0011 | Security event, subject, threat indicators |
| L1 → L2 Escalation | CASE-2025-0001 | Use "Escalate to L2" workflow action |
| Direct L2 Routing | CASE-2025-0009 | Workflow timeline shows L1 skipped, entered at L2 |
| Configurable Workflow | Compare CASE-2025-0006 vs CASE-2025-0009 | Different workflowId configs |

## Data Layer

Components never import JSON directly. All data flows through services:

```text
React Component → caseService / workflowService / configurationService → Mock JSON
```

Later: swap service implementations to call REST APIs without changing components. See [ARCHITECTURE.md §4.2](./ARCHITECTURE.md#42-service-layer) for details.

## Project Structure

```text
src/
├── components/     # UI components by domain
├── config/         # Component registry
├── mock/           # JSON mock data
├── pages/          # Dashboard, Case Queue, Case Details
├── services/       # Data access abstraction
└── types/          # TypeScript definitions
```

## Mock Data

- 15 cases (5 per screening type)
- Multiple priorities, levels, SLA states
- 4 workflow configurations including high-risk direct L2 routing
- 3 UI profile configurations

Changes from case actions persist in browser localStorage.
