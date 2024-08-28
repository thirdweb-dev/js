import { assert } from "vitest";

const TEST_AWS_KMS_ACCESS_KEY_ID = process.env.TEST_AWS_KMS_ACCESS_KEY_ID;
const TEST_AWS_KMS_SECRET_ACCESS_KEY =
  process.env.TEST_AWS_KMS_SECRET_ACCESS_KEY;
const TEST_AWS_KMS_KEY_ID = process.env.TEST_AWS_KMS_KEY_ID;
const TEST_AWS_KMS_REGION = process.env.TEST_AWS_KMS_REGION;

assert(TEST_AWS_KMS_ACCESS_KEY_ID, "TEST_AWS_KMS_ACCESS_KEY_ID is required");
assert(
  TEST_AWS_KMS_SECRET_ACCESS_KEY,
  "TEST_AWS_KMS_SECRET_ACCESS_KEY is required",
);
assert(TEST_AWS_KMS_KEY_ID, "TEST_AWS_KMS_KEY_ID is required");
assert(TEST_AWS_KMS_REGION, "TEST_AWS_KMS_REGION is required");

export const TEST_AWS_KMS_CONFIG = {
  accessKeyId: TEST_AWS_KMS_ACCESS_KEY_ID,
  secretAccessKey: TEST_AWS_KMS_SECRET_ACCESS_KEY,
  region: TEST_AWS_KMS_REGION,
  keyId: TEST_AWS_KMS_KEY_ID,
};
