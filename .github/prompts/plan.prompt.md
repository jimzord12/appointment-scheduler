# Create implementation plan for the current feature branch

Create a comprehensive implementation plan for the feature on the current branch.

This is the second step in the Spec-Driven Development lifecycle.

Given the current feature branch, do this:

1. Run the script `scripts/setup-plan.sh --json` from repo root and parse its JSON output for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. All file paths must be absolute.
2. Read and analyze the feature specification from FEATURE_SPEC
3. Read the constitution at `/memory/constitution.md` (if exists)
4. Execute the implementation plan template loaded from `/templates/plan-template.md`
5. Set Input path to FEATURE_SPEC
6. Run the Execution Flow (main) function steps 1-10:
   - Load feature spec from Input path
   - Fill Technical Context (scan for NEEDS CLARIFICATION)
   - Evaluate Constitution Check section
   - Execute Phase 0 → research.md
   - Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
   - Re-evaluate Constitution Check
   - Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
   - STOP - Ready for /tasks command
7. Incorporate user-provided implementation details from arguments into Technical Context
8. Update Progress Tracking throughout execution
9. Report completion with generated file paths and readiness for next phase

Note: The script copies the plan template and sets up the directory structure.
