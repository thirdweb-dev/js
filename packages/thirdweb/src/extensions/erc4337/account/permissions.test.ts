import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import { ENTRYPOINT_ADDRESS } from "../../../wallets/smart/lib/constants.js";
import { getOrDeployInfraContract } from "../../../contract/deployment/utils/bootstrap.js";
import { createAccount } from "../__generated__/IAccountFactory/write/createAccount.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { simulateTransaction } from "../../../transaction/actions/simulate.js";
import { addAdmin } from "./addAdmin.js";
import { getAllAdmins } from "../__generated__/IAccountPermissions/read/getAllAdmins.js";
import { removeAdmin } from "./removeAdmin.js";
import { getAllSigners } from "../__generated__/IAccountPermissions/read/getAllSigners.js";
import { addSessionKey } from "./addSessionKey.js";
import { parseEventLogs } from "../../../event/actions/parse-logs.js";
import { adminUpdatedEvent } from "../__generated__/IAccountPermissions/events/AdminUpdated.js";
import { signerPermissionsUpdatedEvent } from "../__generated__/IAccountPermissions/events/SignerPermissionsUpdated.js";
import { ADDRESS_ZERO } from "../../../constants/addresses.js";

describe.todo("Account Permissions", () => {
  let accountFactoryContract: ThirdwebContract;
  let accountContract: ThirdwebContract;

  beforeAll(async () => {
    // TODO stub response to not fetch from registry
    accountFactoryContract = await getOrDeployInfraContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      contractId: "AccountFactory",
      constructorParams: [TEST_ACCOUNT_A.address, ENTRYPOINT_ADDRESS],
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

  it("should fetch the correct inital state", async () => {
    const admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins).toEqual([TEST_ACCOUNT_A.address]);
  });

  it("should allow adding admins", async () => {
    const receipt = await sendAndConfirmTransaction({
      transaction: addAdmin({
        account: TEST_ACCOUNT_A,
        contract: accountContract,
        adminAddress: TEST_ACCOUNT_B.address,
      }),
      account: TEST_ACCOUNT_A,
    });
    const logs = parseEventLogs({
      events: [adminUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs.length).toBe(1);
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_B.address);
    expect(logs[0]?.args.isAdmin).toBe(true);
  });

  it("should fetch the correct state after adding", async () => {
    const admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins.length).toBe(2);
    expect(admins).toStrictEqual([
      TEST_ACCOUNT_A.address,
      TEST_ACCOUNT_B.address,
    ]);
  });

  it("should allow removing admins", async () => {
    const receipt = await sendAndConfirmTransaction({
      transaction: removeAdmin({
        account: TEST_ACCOUNT_B,
        contract: accountContract,
        adminAddress: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_B,
    });
    const logs = parseEventLogs({
      events: [adminUpdatedEvent()],
      logs: receipt.logs,
    });
    expect(logs[0]?.args.signer).toBe(TEST_ACCOUNT_A.address);
    expect(logs[0]?.args.isAdmin).toBe(false);
  });

  it("should fetch the correct state after removing", async () => {
    const admins = await getAllAdmins({
      contract: accountContract,
    });
    expect(admins.length).toBe(1);
    expect(admins).toStrictEqual([TEST_ACCOUNT_B.address]);
  });

  it("should fetch the correct before adding a session key", async () => {
    const signers = await getAllSigners({
      contract: accountContract,
    });
    expect(signers).toEqual([]);
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
    expect(logs[0]?.args.permissions.approvedTargets).toBe([ADDRESS_ZERO]);
  });
});
