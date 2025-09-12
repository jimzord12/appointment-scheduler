# Generate implementation tasks for the current feature branch

Generate detailed implementation tasks for the feature on the current branch.

This is the third step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-tasks.sh --json` from repo root and parse its JSON output for IMPL_PLAN, TASKS, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the implementation plan from IMPL_PLAN
3. Read the research.md, data-model.md, and contracts from SPECS_DIR
4. Execute the task generation template loaded from `/templates/tasks-template.md`
5. Set Input path to IMPL_PLAN
6. Run the Task Generation Flow:
   - Load implementation plan from Input path
   - Analyze technical context and requirements
   - Break down into logical task groups (backend, frontend, integration)
   - Generate individual tasks with:
     - Clear descriptions
     - Acceptance criteria
     - Dependencies
     - Estimated effort
     - Links to relevant specs
   - Follow TDD principles (tests before implementation)
   - Ensure tasks are traceable to original requirements
7. Write the tasks to TASKS file
8. Update Progress Tracking in IMPL_PLAN
9. Report completion with tasks file path and readiness for implementation

Note: Tasks should be organized by component/feature with clear dependencies and acceptance criteria.
