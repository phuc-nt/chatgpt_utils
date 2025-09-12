# Documentation Structure

This directory contains all project documentation organized by purpose and lifecycle.

## 📁 Directory Structure

### `00_context/` - Strategic Foundation
**Purpose**: High-level project context and requirements  
**Audience**: Product owners, stakeholders, team members  
**Lifecycle**: Living documents, updated as vision evolves

- `01_business_requirement.md` - Project vision, objectives, and success criteria
- `02_product_backlog.md` - Feature inventory, user stories, and prioritization

### `01_sprints/` - Sprint Planning & Execution
**Purpose**: Detailed sprint-level implementation planning  
**Audience**: Development team  
**Lifecycle**: Created per sprint, archived after retrospective

- `sprint_XX_planning.md` - Sprint goals, selected stories, task breakdown

### `02_adrs/` - Architecture Decision Records  
**Purpose**: Document architectural decisions and rationale  
**Audience**: Development team, future maintainers  
**Lifecycle**: Immutable records, created as decisions are made

- `adr_XX.md` - Individual architecture decisions with context and consequences

## 📋 Document Relationships

```
Business Requirements (00_context/)
├── Informs → Product Backlog (feature prioritization)
└── Validates → Sprint Planning (business alignment)

Product Backlog (00_context/)
├── Sources from ← Business Requirements
├── Feeds into → Sprint Planning (story selection)
└── Updated by ← Sprint retrospectives

Sprint Planning (01_sprints/)
├── Selects from ← Product Backlog
├── References ← Business Requirements
└── May generate → ADRs (02_adrs/)
```

## 🔄 Maintenance Guidelines

**Weekly**: Update product backlog based on sprint learnings  
**Per Sprint**: Create new sprint planning documents  
**As Needed**: Create ADRs for architectural decisions  
**Quarterly**: Review and update business requirements if needed

