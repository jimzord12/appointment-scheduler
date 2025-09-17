# Implement the current feature branch

Execute the implementation tasks for the feature on the current branch.

This is the fourth step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-tasks.sh --json` from repo root and parse its JSON output for IMPL_PLAN, TASKS, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the tasks from TASKS
3. Read the implementation plan from IMPL_PLAN
4. Read the research.md, data-model.md, and contracts from SPECS_DIR
5. Execute the implementation template loaded from `/templates/agent-file-template.md`
6. Set Input path to TASKS
7. Run the Implementation Flow:
   - Load tasks from Input path
   - For each task in order:
     - Mark task as in-progress
     - Implement the task following TDD principles
     - Write tests first, then implementation
     - Ensure code follows project conventions
     - Update progress tracking
     - Mark task as completed
   - Handle dependencies between tasks
   - Run tests after each task completion
   - Update implementation plan progress
8. Write implementation updates to IMPL_PLAN
9. Report completion with implementation summary and readiness for testing
10. Commit changes to the current branch BRANCH and add the Task's ID to the commit message

Note: Follow the project's tech stack and architecture patterns. Ensure all code is properly typed and tested.
