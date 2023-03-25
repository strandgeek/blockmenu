#!/bin/bash

# This scripts go over all test files and run the test command.
# It was created to make sure we have a fresh and migrated contract for each test file and ensure isolated scope

shopt -s nullglob
for f in ./test/*
do
 
	echo "Running test for - $f"
	npm run test "$f"
done
