# E2E testing setup

This directory contains the end-to-end (E2E) testing setup for the project.

## Adding a test

1. create a new file in this directory with the `.spec.ts` extension
2. copy the paterns from the existing tests

## Running the tests locally

To run the tests locally, you can use the following command:

```bash
pnpm playwright
```

## CI (vercel + checkly)

These tests are run automatically on every pull request as part of the vercel build (after the build completes we check if the tests pass and then we deploy the changes to the preview environment).

Your PR will be _blocked_ from deploying if these tests fail.

### Updating the tests in checkly

1. Create the tests
2. make sure they run locally
3. push the changes to the repository and run `pnpm update-checkly` to update the checkly tests. (Requires checkly cli being signed in, meaning you need to have checkly access.)
