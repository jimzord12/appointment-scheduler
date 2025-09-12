#!/bin/bash

# Setup tasks script for spec-driven development
# This script sets up the environment for task generation and implementation

set -e

# Get the absolute path of the repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$REPO_ROOT/scripts"

# Source common functions
source "$SCRIPT_DIR/common.sh"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Validate we're on a feature branch
if [[ ! "$CURRENT_BRANCH" =~ ^[0-9]+- ]]; then
    echo "Error: Not on a feature branch. Current branch: $CURRENT_BRANCH" >&2
    exit 1
fi

# Extract feature number
FEATURE_NUM=$(echo "$CURRENT_BRANCH" | cut -d'-' -f1)

# Set up paths
SPECS_DIR="$REPO_ROOT/specs/$CURRENT_BRANCH"
IMPL_PLAN="$SPECS_DIR/plan.md"
TASKS="$SPECS_DIR/tasks.md"

# Validate required files exist
if [[ ! -f "$IMPL_PLAN" ]]; then
    echo "Error: Implementation plan not found: $IMPL_PLAN" >&2
    exit 1
fi

# Output JSON for consumption by other tools
if [[ "$1" == "--json" ]]; then
    cat << EOF
{
  "BRANCH": "$CURRENT_BRANCH",
  "FEATURE_NUM": "$FEATURE_NUM",
  "SPECS_DIR": "$SPECS_DIR",
  "IMPL_PLAN": "$IMPL_PLAN",
  "TASKS": "$TASKS",
  "REPO_ROOT": "$REPO_ROOT"
}
EOF
else
    echo "Feature branch: $CURRENT_BRANCH"
    echo "Feature number: $FEATURE_NUM"
    echo "Specs directory: $SPECS_DIR"
    echo "Implementation plan: $IMPL_PLAN"
    echo "Tasks file: $TASKS"
    echo "Repository root: $REPO_ROOT"
fi
