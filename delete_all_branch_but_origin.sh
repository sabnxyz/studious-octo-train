#!/bin/bash

# Get the current branch name
current_branch=$(git symbolic-ref --short HEAD)

# Fetch the latest changes from the remote repository (origin)
git fetch

# List all branches that exist on the remote (origin)
remote_branches=$(git branch -r | awk -F/ '{print $2}')

# Loop through and delete local branches that do not exist on the remote (origin)
for branch in $(git branch); do
  if [[ "$branch" != "$current_branch" && ! "$remote_branches" =~ "$branch" ]]; then
    git branch -D "$branch"
    echo "Deleted local branch: $branch"
  fi
done

echo "Finished deleting branches."