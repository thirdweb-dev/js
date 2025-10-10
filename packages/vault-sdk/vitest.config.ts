import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60000, // 60 seconds default timeout
    hookTimeout: 60000, // 60 seconds for beforeAll/afterAll
    teardownTimeout: 10000,
    sequence: {
      shuffle: false, // Run tests in order
    },
  },
});
