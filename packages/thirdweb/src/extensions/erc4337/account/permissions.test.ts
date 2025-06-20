import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { USDT_CONTRACT_ADDRESS } from "../../../../test/src/test-contracts.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { getOrDeployInfraContract } from "../../../contract/deployment/utils/bootstrap.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { simulateTransaction } from "../../../transaction/actions/simulate.js";
import { ENTRYPOINT_ADDRESS_v0_6 } from "../../../wallets/smart/lib/constants.js";
import { createAccount } from "../__generated__/IAccountFactory/write/createAccount.js";
import { adminUpdatedEvent } from "../__generated__/IAccountPermissions/events/AdminUpdated.js";
import { signerPermissionsUpdatedEvent } from "../__generated__/IAccountPermissions/events/SignerPermissionsUpdated.js";
import { getAllAdmins } from "../__generated__/IAccountPermissions/read/getAllAdmins.js";
import { addAdmin } from "./addAdmin.js";
import { addSessionKey, shouldUpdateSessionKey } from "./addSessionKey.js";
import { removeAdmin } from "./removeAdmin.js";

describe.runIf(process.env.TW_SECRET_KEY)("Account Permissions", () => {
  let accountFactoryContract: ThirdwebContract;
  let accountContract: ThirdwebContract;

  beforeAll(async () => {
    // TODO stub response to not fetch from registry
    accountFactoryContract = await getOrDeployInfraContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      constructorParams: {
        defaultAdmin: TEST_ACCOUNT_A.address,
        entrypoint: ENTRYPOINT_ADDRESS_v0_6,
      },
      contractId: "AccountFactory",
    });
    const transaction = createAccount({
      admin: TEST_ACCOUNT_A.address,
      contract: accountFactoryContract,
      data: "0x",
    });
    const accountAddress = await simulateTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
    accountContract = getContract({
      address: accountAddress,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  });

  it("should allow adding admins", async () => {
    let admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins).toEqual([TEST_ACCOUNT_A.address]);
    let receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: addAdmin({
        account: TEST_ACCOUNT_A,
        adminAddress: TEST_ACCOUNT_B.address,
        contract: accountContract,
      }),
    });
    let logs = parseEventLogs({
      events: [adminUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs.length).toBe(1);
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_B.address);
    expect(logs[0]?.args.isAdmin).toBe(true);
    admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins.length).toBe(2);
    expect(admins).toStrictEqual([
      TEST_ACCOUNT_A.address,
      TEST_ACCOUNT_B.address,
    ]);
    receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_B,
      transaction: removeAdmin({
        account: TEST_ACCOUNT_B,
        adminAddress: TEST_ACCOUNT_A.address,
        contract: accountContract,
      }),
    });
    logs = parseEventLogs({
      events: [adminUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_A.address);
    expect(logs[0]?.args.isAdmin).toBe(false);
    admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins.length).toBe(1);
    expect(admins).toStrictEqual([TEST_ACCOUNT_B.address]);
  });

  it("should allow adding session keys", async () => {
    const receipt = await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_B,
      transaction: addSessionKey({
        account: TEST_ACCOUNT_B,
        contract: accountContract,
        permissions: {
          approvedTargets: "*",
        },
        sessionKeyAddress: TEST_ACCOUNT_A.address,
      }),
    });
    const logs = parseEventLogs({
      events: [signerPermissionsUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.authorizingSigner).toBe(TEST_ACCOUNT_B.address);
    expect(logs[0]?.args.targetSigner).toBe(TEST_ACCOUNT_A.address);
    expect(logs[0]?.args.permissions.approvedTargets).toStrictEqual([
      ZERO_ADDRESS,
    ]);

    expect(
      await shouldUpdateSessionKey({
        accountContract,
        newPermissions: {
          approvedTargets: "*",
        },
        sessionKeyAddress: TEST_ACCOUNT_A.address,
      }),
    ).toBe(false);

    expect(
      await shouldUpdateSessionKey({
        accountContract,
        newPermissions: {
          approvedTargets: "*",
          nativeTokenLimitPerTransaction: 0,
        },
        sessionKeyAddress: TEST_ACCOUNT_A.address,
      }),
    ).toBe(false);

    expect(
      await shouldUpdateSessionKey({
        accountContract,
        newPermissions: {
          approvedTargets: [USDT_CONTRACT_ADDRESS],
        },
        sessionKeyAddress: TEST_ACCOUNT_A.address,
      }),
    ).toBe(true);

    expect(
      await shouldUpdateSessionKey({
        accountContract,
        newPermissions: {
          approvedTargets: "*",
          nativeTokenLimitPerTransaction: 0.1,
        },
        sessionKeyAddress: TEST_ACCOUNT_A.address,
      }),
    ).toBe(true);
  });

  it("should update session key if account is not deployed", async () => {
    const shouldUpdate = await shouldUpdateSessionKey({
      accountContract: getContract({
        address: TEST_ACCOUNT_C.address,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      }),
      newPermissions: {
        approvedTargets: "*",
      },
      sessionKeyAddress: TEST_ACCOUNT_A.address,
    });
    expect(shouldUpdate).toBe(true);
  });
});
