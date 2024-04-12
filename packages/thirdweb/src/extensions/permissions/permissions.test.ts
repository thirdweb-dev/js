import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { deployERC20Contract } from "../prebuilts/deploy-erc20.js";
import { getAllRoleMembers } from "./read/getAllMembers.js";
import { hasRole } from "./read/hasRole.js";
import { grantRole } from "./write/grant.js";
import { revokeRole } from "./write/revokeRole.js";

describe.runIf(process.env.TW_SECRET_KEY)("Permissions", () => {
  let tokenErc20Contract: ThirdwebContract;
  beforeAll(async () => {
    const tokenERC20Address = await deployERC20Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "PermissionsErc20",
      },
      type: "TokenERC20",
    });

    tokenErc20Contract = getContract({
      address: tokenERC20Address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
    // this deploys a contract, it may take some time
  }, 60_000);

  it("should check if the target account has the role", async () => {
    // after deployment the deployer should have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_A.address,
      }),
    ).resolves.toBe(true);
    // but another account should not have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(false);
  });

  it("should let the deployer grant the admin role to another account", async () => {
    // initially the target account should not have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(false);

    // grant the admin role to the target account
    const grantTx = grantRole({
      contract: tokenErc20Contract,
      role: "admin",
      targetAccountAddress: TEST_ACCOUNT_B.address,
    });
    await sendAndConfirmTransaction({
      transaction: grantTx,
      account: TEST_ACCOUNT_A,
    });

    // now the target account should have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(true);
  });

  it("should let one admin revoke the admin role from another admin", async () => {
    // initially the target account should have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(true);

    // revoke the admin role from the target account
    const revokeTx = revokeRole({
      contract: tokenErc20Contract,
      role: "admin",
      targetAccountAddress: TEST_ACCOUNT_B.address,
    });

    await sendAndConfirmTransaction({
      transaction: revokeTx,
      account: TEST_ACCOUNT_A,
    });

    // now the target account should not have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(false);
  });

  it("should let an account renounce their own role", async () => {
    // initially the target account should have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_A.address,
      }),
    ).resolves.toBe(true);

    // revoke the admin role from the target account
    const revokeTx = revokeRole({
      contract: tokenErc20Contract,
      role: "admin",
      targetAccountAddress: TEST_ACCOUNT_A.address,
    });

    await sendAndConfirmTransaction({
      transaction: revokeTx,
      account: TEST_ACCOUNT_A,
    });

    // now the target account should not have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_A.address,
      }),
    ).resolves.toBe(false);
  });

  it("should not allow grating a role if the sender does not have the admin role", async () => {
    // initially the target account should not have the admin role
    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(false);

    // grant the admin role to the target account
    const grantTx = grantRole({
      contract: tokenErc20Contract,
      role: "admin",
      targetAccountAddress: TEST_ACCOUNT_B.address,
    });

    await expect(
      sendAndConfirmTransaction({
        transaction: grantTx,
        account: TEST_ACCOUNT_B,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [TransactionError: Error - AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000

      contract: ${tokenErc20Contract.address}
      chainId: 31337]
    `);

    await expect(
      hasRole({
        contract: tokenErc20Contract,
        role: "admin",
        targetAccountAddress: TEST_ACCOUNT_B.address,
      }),
    ).resolves.toBe(false);
  });
});

describe.runIf(process.env.TW_SECRET_KEY)("PermissionsEnumerable", () => {
  let tokenErc20Contract: ThirdwebContract;
  beforeAll(async () => {
    const tokenERC20Address = await deployERC20Contract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      params: {
        name: "PermissionsErc20",
      },
      type: "TokenERC20",
    });

    tokenErc20Contract = getContract({
      address: tokenERC20Address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  });

  it("should be able to list the members of a role", async () => {
    // grant the admin role to the target account
    const grantTx = grantRole({
      contract: tokenErc20Contract,
      role: "admin",
      targetAccountAddress: TEST_ACCOUNT_B.address,
    });
    await sendAndConfirmTransaction({
      transaction: grantTx,
      account: TEST_ACCOUNT_A,
    });

    await expect(
      getAllRoleMembers({ contract: tokenErc20Contract, role: "admin" }),
    ).resolves.toMatchInlineSnapshot(`
      [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      ]
    `);
  });
});
