import { beforeAll, expect, test } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { typedData } from "~test/typed-data.js";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { sendTransaction } from "../exports/thirdweb.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { getAwsKmsAccount } from "./aws-kms.js";
import { getWalletBalance } from "./utils/getWalletBalance.js";

import {
  http,
  createTestClient,
  parseUnits,
  verifyMessage,
  verifyTypedData,
} from "viem";
import { TEST_AWS_KMS_CONFIG } from "~test/test-aws-kms-config.js";
import { toWei } from "../utils/units.js";

let account: Awaited<ReturnType<typeof getAwsKmsAccount>>;

const anvilTestClient = createTestClient({
  mode: "anvil",
  transport: http(ANVIL_CHAIN.rpc),
});

beforeAll(async () => {
  account = await getAwsKmsAccount({
    keyId: TEST_AWS_KMS_CONFIG.keyId,
    client: TEST_CLIENT,
    config: {
      credentials: {
        accessKeyId: TEST_AWS_KMS_CONFIG.accessKeyId,
        secretAccessKey: TEST_AWS_KMS_CONFIG.secretAccessKey,
      },
      region: TEST_AWS_KMS_CONFIG.region,
    },
  });
});

test("account address is valid", () => {
  expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
});

test("sign message", async () => {
  const message = "hello world";
  const signature = await account.signMessage({ message });

  expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/);

  const isValid = await verifyMessage({
    address: account.address,
    message,
    signature,
  });
  expect(isValid).toBe(true);
});

test("sign transaction", async () => {
  const tx = {
    chainId: ANVIL_CHAIN.id,
    maxFeePerGas: parseUnits("20", 9),
    gas: 21000n,
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: parseUnits("1", 18),
  };

  expect(account.signTransaction).toBeDefined();

  const signedTx = await account.signTransaction?.(tx);
  expect(signedTx).toMatch(/^0x[a-fA-F0-9]+$/);

  // Optionally, you can use viem to parse the transaction and verify its contents
  // This step depends on the exact format of your signed transaction
});

test("sign typed data", async () => {
  const signature = await account.signTypedData({
    ...typedData.basic,
    primaryType: "Mail",
  });

  expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/);

  const isValid = await verifyTypedData({
    address: account.address,
    ...typedData.basic,
    primaryType: "Mail",
    signature,
  });
  expect(isValid).toBe(true);
});

test("send transaction", async () => {
  const recipient = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

  await anvilTestClient.setBalance({
    address: account.address,
    value: toWei("10"),
  });

  const startingBalance = await getWalletBalance({
    address: account.address,
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
  });

  const startingBalanceRecipient = await getWalletBalance({
    address: recipient,
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
  });

  const tx = prepareTransaction({
    client: TEST_CLIENT,
    chain: ANVIL_CHAIN,
    to: recipient,
    value: parseUnits("1", 18),
  });

  const result = await sendTransaction({
    account,
    transaction: tx,
  });

  expect(result.transactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

  const endingBalance = await getWalletBalance({
    address: account.address,
    client: TEST_CLIENT,
    chain: ANVIL_CHAIN,
  });
  const endingBalanceRecipient = await getWalletBalance({
    address: recipient,
    client: TEST_CLIENT,
    chain: ANVIL_CHAIN,
  });

  expect(endingBalance.value).toBeLessThan(startingBalance.value);
  expect(endingBalanceRecipient.value).toBeGreaterThan(
    startingBalanceRecipient.value,
  );
});
