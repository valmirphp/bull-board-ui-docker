#!/bin/bash

# Ask for the version name
read -p "Enter the version name: " version_name

# Execute the commands
echo "Running commands for version: $version_name"

# Example commands
echo "Build image...."

docker build -t bull-board-ui-docker .
docker tag bull-board-ui-docker valmirphp/bull-board-ui-docker:latest-alpine
docker tag bull-board-ui-docker valmirphp/bull-board-ui-docker:$version_name-alpine
docker push valmirphp/bull-board-ui-docker:$version_name-alpine
docker push valmirphp/bull-board-ui-docker:latest-alpine
