
#!/bin/bash

# Get the current branch name
current_branch=$(git symbolic-ref --short HEAD)

# List all branches except the current one
branches_to_delete=$(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v "^$current_branch$")

# Loop through and delete each branch
for branch in $branches_to_delete; do
  git branch -D $branch
  echo "Deleted branch: $branch"
done

echo "Finished deleting branches."