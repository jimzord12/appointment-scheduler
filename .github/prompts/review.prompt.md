# Review the current feature branch

Execute code review for the feature on the current branch.

This is the sixth step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-tasks.sh --json` from repo root and parse its JSON output for IMPL_PLAN, TASKS, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the implementation from IMPL_PLAN
3. Read the tasks from TASKS
4. Read the research.md, data-model.md, and contracts from SPECS_DIR
5. Execute the review template loaded from `/templates/agent-file-template.md`
6. Set Input path to IMPL_PLAN
7. Run the Review Flow:
   - Load implementation details from Input path
   - Review code quality and adherence to standards
   - Validate implementation against original requirements
   - Check for security vulnerabilities
   - Review test coverage and quality
   - Assess performance implications
   - Verify documentation is complete
   - Check for proper error handling
   - Validate API contracts are implemented correctly
   - Ensure accessibility requirements are met
8. Write review feedback to IMPL_PLAN
9. Report completion with review summary and readiness for merge

Note: Address any critical issues found during review before proceeding to merge.
