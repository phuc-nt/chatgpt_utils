### Quy tắc cơ bản

- **Luôn sử dụng tiếng Việt để trả lời**
- Đọc project documentation trước khi bắt đầu bất kỳ task nào
- Tuân thủ workflow đã được định nghĩa trong project

### Git Commit Guidelines

- **Không sử dụng emoji** trong commit messages
- **Không thêm thông tin về Claude Code** hoặc AI tools trong commit message
- Sử dụng conventional commit format: `type: description`
- Ví dụ: `feat: add user authentication`, `fix: resolve memory leak in chat view`

### Startup Workflow (Each Session)

1. Check the project setup.
2. **Read `docs/00_context/01_business_requirement.md`** - To understand project vision and objectives.
3. **Read `docs/00_context/02_product_backlog.md`** - To understand current features and priorities.
4. **Check `docs/01_sprints/sprint_XX_planning.md`** - For current sprint tasks and progress.

### Task Management Process

Task Lifecycle:
  1. Identify task: From the current sprint or user request.
  2. Focus mode: Work on one task at a time, do not jump around.
  3. Implement feature: Code implementation with proper error handling.
  4. Test Suite Update: MANDATORY - Update the test suite for every new feature.
  5. Quality validation: All tests must PASS before marking a task as complete.
  6. Update progress: Update the sprint document only when ALL TESTS PASS.
  7. Commit clean: Use a clear commit message following conventions.
  8. Update status: Update the sprint document and product backlog as needed.

Quality Gates:
  - Code compiles: The build must succeed.
  - Test Suite: All automated tests (connection + functional) must PASS.
  - No regressions: Existing functionality must not be broken.
  - No token leaks: Do not commit sensitive data.
  - Documentation: Update docs with test results.

Test Requirements:
  - Every new feature requires corresponding tests.
  - Tests must PASS before a sprint task can be completed.
  - The test suite must be maintained and updated consistently.

### Role of Document Groups

**`docs/00_context/` - Strategic Foundation (DO NOT EDIT WITHOUT EXPLICIT APPROVAL)**:
- `01_business_requirement.md`: Project vision, objectives, success criteria, and epic-level features.
- `02_product_backlog.md`: Feature inventory, user stories, prioritization, and sprint assignments.

**`docs/01_sprints/` - Sprint Execution (UPDATED DAILY)**:
- `sprint_XX_planning.md`: Detailed task breakdown, acceptance criteria, daily progress tracking.

**`docs/02_adrs/` - Architecture Decision Records (CREATE AS NEEDED)**:
- `adr_XX.md`: Architectural decisions with context, rationale, and consequences.

### Documentation Rules

Update Rules:
  - `02_product_backlog.md`: Update for story refinement, priority changes, sprint assignments.
  - `sprint_XX_planning.md`: Update for daily progress, task completion, blockers.
  - `00_context/`: Never update without explicit approval (business requirements, product backlog structure).

Maintenance Principles:
  - AVOID DUPLICATION: Link instead of repeating information.
  - KEEP CONCISE: Overview docs stay short, details go in specific docs.
  - SINGLE SOURCE OF TRUTH: Each piece of information lives in one place.
  - CROSS-REFERENCE: Use links to connect related information.
  - STATUS FIRST: Always show the current status clearly.

Writing Style:
  - Concise and actionable.
  - Use status indicators: Not Started, In Progress, Completed, Blocked.
  - Include time estimates and actual time spent.
  - Link related documents instead of duplicating content.

Document Flow: `business_requirement.md` → `product_backlog.md` → `sprint_XX_planning.md` → specific implementation details.
Never put detailed task lists in overview documents.