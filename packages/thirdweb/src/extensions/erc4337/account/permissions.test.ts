import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { ADDRESS_ZERO } from "../../../constants/addresses.js";
import {
  type ThirdwebContract,
  getContract,
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
import { addSessionKey } from "./addSessionKey.js";
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
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS_v0_6],
    });
    const transaction = createAccount({
      contract: accountFactoryContract,
      admin: TEST_ACCOUNT_A.address,
      data: "0x",
    });
    const accountAddress = await simulateTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
    });
    await sendAndConfirmTransaction({
      transaction,
      account: TEST_ACCOUNT_A,
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
      transaction: addAdmin({
        account: TEST_ACCOUNT_A,
        contract: accountContract,
        adminAddress: TEST_ACCOUNT_B.address,
      }),
      account: TEST_ACCOUNT_A,
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
      transaction: removeAdmin({
        account: TEST_ACCOUNT_B,
        contract: accountContract,
        adminAddress: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_B,
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
      transaction: addSessionKey({
        account: TEST_ACCOUNT_B,
        contract: accountContract,
        sessionKeyAddress: TEST_ACCOUNT_A.address,
        permissions: {
          approvedTargets: "*",
        },
      }),
      account: TEST_ACCOUNT_B,
    });
    const logs = parseEventLogs({
      events: [signerPermissionsUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.authorizingSigner).toBe(TEST_ACCOUNT_B.address);
    expect(logs[0]?.args.targetSigner).toBe(TEST_ACCOUNT_A.address);
    expect(logs[0]?.args.permissions.approvedTargets).toStrictEqual([
      ADDRESS_ZERO,
    ]);
  });
});
