# Merge the current feature branch

Execute merge process for the feature on the current branch.

This is the seventh step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-tasks.sh --json` from repo root and parse its JSON output for IMPL_PLAN, TASKS, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the implementation from IMPL_PLAN
3. Read the tasks from TASKS
4. Read the research.md, data-model.md, and contracts from SPECS_DIR
5. Execute the merge template loaded from `/templates/agent-file-template.md`
6. Set Input path to IMPL_PLAN
7. Run the Merge Flow:
   - Load implementation details from Input path
   - Ensure all tests pass on the feature branch
   - Resolve any merge conflicts with main branch
   - Run integration tests on merged code
   - Update documentation if needed
   - Tag the release if applicable
   - Clean up feature branch after successful merge
   - Update project roadmap or backlog
8. Write merge results to IMPL_PLAN
9. Report completion with merge summary and feature status

Note: Ensure the main branch remains stable after merge and all CI/CD pipelines pass.
