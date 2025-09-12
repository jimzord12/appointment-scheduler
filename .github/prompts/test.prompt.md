# Test the current feature branch

Execute comprehensive testing for the feature on the current branch.

This is the fifth step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-tasks.sh --json` from repo root and parse its JSON output for IMPL_PLAN, TASKS, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the implementation from IMPL_PLAN
3. Read the tasks from TASKS
4. Read the research.md, data-model.md, and contracts from SPECS_DIR
5. Execute the testing template loaded from `/templates/agent-file-template.md`
6. Set Input path to IMPL_PLAN
7. Run the Testing Flow:
   - Load implementation details from Input path
   - Run unit tests for all new code
   - Run integration tests for API endpoints
   - Run end-to-end tests for user workflows
   - Test edge cases and error scenarios
   - Validate against acceptance criteria from tasks
   - Check code coverage requirements
   - Run linting and type checking
   - Test performance requirements
   - Validate security requirements
8. Write test results to IMPL_PLAN
9. Report completion with test summary and readiness for review

Note: Ensure all tests pass and code meets quality standards before proceeding to review.
