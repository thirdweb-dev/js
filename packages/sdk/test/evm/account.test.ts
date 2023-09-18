import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import {
  SignerPermissions,
  Account,
  AccountFactory,
  PermissionSnapshotInput,
} from "../../src/evm";
import { ContractFactory, utils } from "ethers";
import EntrypointArtifact from "./mock/EntryPoint.json";
import AccountFactoryArtifact from "./mock/AccountFactory.json";

// Target ABIs
import IAccountCoreAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountCore.json";
import {
  deployContractAndUploadMetadata,
  mockUploadContractMetadata,
} from "./utils";
import { IAccountCore, IAccountFactory } from "@thirdweb-dev/contracts-js";

global.fetch = /* @__PURE__ */ require("cross-fetch");

/* @__PURE__ */ describe("Accounts with account factory", function () {
  let accountFactory: AccountFactory<IAccountFactory>;
  let account: Account<IAccountCore>;

  let adminWallet: SignerWithAddress;

  let signer1Wallet: SignerWithAddress;
  let signer2Wallet: SignerWithAddress;
  let signer3Wallet: SignerWithAddress;
  let signer4Wallet: SignerWithAddress;
  let signer5Wallet: SignerWithAddress;
  let signer6Wallet: SignerWithAddress;
  let signer7Wallet: SignerWithAddress;
  let signer8Wallet: SignerWithAddress;
  let signer9Wallet: SignerWithAddress;

  before(async () => {
    [
      adminWallet,
      signer1Wallet,
      signer2Wallet,
      signer3Wallet,
      signer4Wallet,
      signer5Wallet,
      signer6Wallet,
      signer7Wallet,
      signer8Wallet,
      signer9Wallet,
    ] = signers;
  });

  beforeEach(async () => {
    const entrypoint = await new ContractFactory(
      EntrypointArtifact.abi,
      EntrypointArtifact.bytecode.object,
      adminWallet,
    ).deploy();
    const factoryAddress = await deployContractAndUploadMetadata(
      AccountFactoryArtifact.abi,
      AccountFactoryArtifact.bytecode.object,
      adminWallet,
      [entrypoint.address],
    );
    accountFactory = (await sdk.getContract(factoryAddress)).accountFactory;
  });

  describe("Test: AccountFactory actions", () => {
    it("Should create a new account for the admin", async () => {
      // Check before creating a account for `adminWallet`
      const isDeployed = await accountFactory.isAccountDeployed(
        adminWallet.address,
      );
      assert.isFalse(
        isDeployed,
        "Account is should not be deployed for admin.",
      );

      const predictedAccountAddress: string =
        await accountFactory.predictAccountAddress(adminWallet.address);

      const allAccountsBefore = await accountFactory.getAllAccounts();
      assert.isFalse(
        allAccountsBefore.includes(predictedAccountAddress),
        "Account should not be deployed for admin already.",
      );

      assert.isTrue(
        (await accountFactory.getAssociatedAccounts(adminWallet.address))
          .length === 0,
        "Signer should have no associated accounts.",
      );

      // Create account for `adminWallet`
      const tx = await accountFactory.createAccount(adminWallet.address);

      // Checks after creating a account for `adminWallet`
      assert.strictEqual(
        utils.getAddress(tx.address),
        utils.getAddress(predictedAccountAddress),
        "Account address should match predicted address.",
      );
      assert.isTrue(
        await accountFactory.isAccountDeployed(adminWallet.address),
        "Account is should be deployed for admin.",
      );

      const allAccountsAfter = await accountFactory.getAllAccounts();
      assert.isTrue(
        allAccountsAfter.length === 1,
        "Only one account should be created on the factory.",
      );

      const accountAddress = allAccountsAfter[0];
      assert.strictEqual(
        utils.getAddress(accountAddress),
        utils.getAddress(predictedAccountAddress),
        "Stored account address should match predicted address.",
      );

      sdk.updateSignerOrProvider(adminWallet);
      await mockUploadContractMetadata(
        "smart-wallet",
        accountAddress,
        IAccountCoreAbi,
      );
      const account = (await sdk.getContract(accountAddress)).account;
      const allAdmins = await account.getAllAdmins();
      assert.isTrue(
        allAdmins.length === 1,
        "Account should only have one admin.",
      );

      const admin = allAdmins[0];

      assert.strictEqual(
        utils.getAddress(admin),
        utils.getAddress(adminWallet.address),
        "Correct admin for account.",
      );

      const associatedAccounts = await accountFactory.getAssociatedAccounts(
        admin,
      );

      assert.isTrue(
        associatedAccounts.length === 1,
        "Wallet should have only the admin as an associated signer.",
      );
      assert.strictEqual(
        utils.getAddress(accountAddress),
        utils.getAddress(associatedAccounts[0]),
        "Wallet should have only the admin as an associated signer.",
      );
    });

    it("Should throw if creating account for an admin who already has one", async () => {
      // Create a account for admin
      await accountFactory.createAccount(adminWallet.address);

      // Try creating another account for the same admin
      try {
        await accountFactory.createAccount(adminWallet.address);
        expect.fail();
      } catch (err: any) {
        expect(err.message).to.equal(
          `Account already deployed for admin: ${adminWallet.address}`,
        );
      }
    });
  });

  describe("Test: Account actions", () => {
    beforeEach(async () => {
      // Create a account for admin
      const tx = await accountFactory.createAccount(adminWallet.address);
      const accountAddress = tx.address;

      sdk.updateSignerOrProvider(adminWallet);
      await mockUploadContractMetadata(
        "smart-wallet",
        accountAddress,
        IAccountCoreAbi,
      );

      account = (await sdk.getContract(accountAddress)).account;
    });

    // it("Should be able to add another admin to the account.", async () => {
    //   assert.isFalse(
    //     await account.isAdmin(signer1Wallet.address),
    //     "New signer1 should not be an admin on the account.",
    //   );

    //   await account.grantAdminPermissions(signer1Wallet.address);

    //   assert.isTrue(
    //     await account.isAdmin(signer1Wallet.address),
    //     "New signer1 should be an admin on the account.",
    //   );

    //   const isAdmin = (await account.getAllAdmins()).includes(
    //     utils.getAddress(signer1Wallet.address),
    //   );

    //   assert.isTrue(isAdmin, "New signer1 should be an admin on the account.");

    //   assert.isTrue(
    //     (
    //       await accountFactory.getAssociatedAccounts(signer1Wallet.address)
    //     ).includes(account.getAddress()),
    //     "Wallet is an associated account of the signer.",
    //   );
    // });

    // it("Should be able to remove an admin from the account.", async () => {
    //   await account.grantAdminPermissions(signer1Wallet.address);
    //   assert.isTrue(
    //     await account.isAdmin(signer1Wallet.address),
    //     "New signer1 should be an admin on the account.",
    //   );

    //   await account.revokeAdminPermissions(signer1Wallet.address);

    //   assert.isFalse(
    //     await account.isAdmin(signer1Wallet.address),
    //     "New signer1 should not be an admin on the account.",
    //   );

    //   assert.isFalse(
    //     (await account.getAllSigners())
    //       .map((result) => utils.getAddress(result.signer))
    //       .includes(signer1Wallet.address),
    //     "New signer1 should not be an admin on the account.",
    //   );

    //   assert.isFalse(
    //     (await account.getAllAdmins()).includes(signer1Wallet.address),
    //     "New signer1 is not an associated signer of the account.",
    //   );
    //   assert.isFalse(
    //     (
    //       await accountFactory.getAssociatedAccounts(signer1Wallet.address)
    //     ).includes(account.getAddress()),
    //     "Wallet is not an associated account of the signer.",
    //   );
    // });

    it("Should be able to grant restricted access to a new signer.", async () => {
      const signersWithRestrictions = await account.getAllSigners();
      assert.isFalse(
        signersWithRestrictions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer should not already have access to the account.",
      );

      // Grant access
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address],
      });

      assert.isFalse(
        await account.isAdmin(signer1Wallet.address),
        "New signer1 should not be an admin on the account.",
      );
      const newSignerWithPermissions = await account.getAllSigners();
      const restrictions = newSignerWithPermissions.find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.isTrue(
        newSignerWithPermissions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer1 should be a signer on the account.",
      );
      assert.strictEqual(
        restrictions.nativeTokenLimitPerTransaction.toString(),
        utils.parseEther("1").toString(),
        "New signer1 should have the expected native token limit.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets.length,
        1,
        "New signer1 should have one approved call targets.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );

      assert.isTrue(
        (await account.getAllSigners())
          .map((item) => item.signer)
          .includes(signer1Wallet.address),
        "New signer1 is an associated signer of the account.",
      );
      assert.isTrue(
        (
          await accountFactory.getAssociatedAccounts(signer1Wallet.address)
        ).includes(account.getAddress()),
        "Wallet is an associated account of the signer.",
      );
    });

    it("Should not be able to grant restricted access to a signer who already has access.", async () => {
      // Grant access to signer1
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address],
      });

      // Try granting access to signer1 again
      try {
        await account.grantPermissions(signer1Wallet.address, {
          approvedCallTargets: [adminWallet.address],
        });
        expect.fail();
      } catch (err: any) {
        expect(err.message).to.equal(
          "Signer already has permissions. Cannot grant permissions to an existing signer. You can update permissions using `updatePermissions`.",
        );
      }
    });

    it("Should be able to revoke restricted access from an authorized signer.", async () => {
      // Grant access to signer1
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address],
      });

      // Revoke access
      await account.revokeAccess(signer1Wallet.address);

      const signersWithRestrictions = await account.getAllSigners();
      assert.isFalse(
        signersWithRestrictions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer should not have access to the account.",
      );

      assert.isFalse(
        await account.isAdmin(signer1Wallet.address),
        "New signer1 should not be an admin on the account.",
      );

      assert.isFalse(
        (await account.getAllSigners())
          .map((item) => item.signer)
          .includes(signer1Wallet.address),
        "New signer1 is not an associated signer of the account.",
      );
      assert.isTrue(
        (
          await accountFactory.getAssociatedAccounts(signer1Wallet.address)
        ).includes(account.getAddress()),
        "Wallet is still an associated account of the signer.",
      );
    });

    it("Should not be able to revoke restricted access from a signer who doesn't have access.", async () => {
      const signersWithRestrictions = await account.getAllSigners();
      assert.isFalse(
        signersWithRestrictions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer should not already have access to the account.",
      );

      // Try revoking access from signer1
      try {
        await account.revokeAccess(signer1Wallet.address);
        expect.fail();
      } catch (err: any) {
        expect(err.message).to.equal(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }
    });

    it("Should be able to update access of an authorized signer.", async () => {
      // Grant access
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address],
      });

      assert.isFalse(
        await account.isAdmin(signer1Wallet.address),
        "New signer1 should not be an admin on the account.",
      );

      const signerWithPermissions = await account.getAllSigners();
      const restrictions = signerWithPermissions.find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.isTrue(
        signerWithPermissions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer1 should be a signer on the account.",
      );
      assert.strictEqual(
        restrictions.nativeTokenLimitPerTransaction.toString(),
        utils.parseEther("1").toString(),
        "New signer1 should have the expected native token limit.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets.length,
        1,
        "New signer1 should have one approved call targets.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );

      // Update access
      await account.updatePermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "3",
        approvedCallTargets: [signer2Wallet.address],
      });

      assert.isFalse(
        await account.isAdmin(signer1Wallet.address),
        "New signer1 should not be an admin on the account.",
      );

      const newSignerWithPermissions = await account.getAllSigners();
      const newRestrictions = newSignerWithPermissions.find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.isTrue(
        newSignerWithPermissions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer1 should be a signer on the account.",
      );
      assert.strictEqual(
        newRestrictions.nativeTokenLimitPerTransaction.toString(),
        utils.parseEther("3").toString(),
        "New signer1 should have the expected native token limit.",
      );
      assert.strictEqual(
        newRestrictions.approvedCallTargets.length,
        1,
        "New signer1 should have one approved call targets.",
      );
      assert.strictEqual(
        newRestrictions.approvedCallTargets[0],
        signer2Wallet.address,
        "New signer1 should have the expected approved call targets.",
      );
    });

    it("Should not be able to update access of a signer who doesn't have access.", async () => {
      const signersWithRestrictions = await account.getAllSigners();
      assert.isFalse(
        signersWithRestrictions
          .map((result) => utils.getAddress(result.signer))
          .includes(signer1Wallet.address),
        "New signer should not already have access to the account.",
      );

      // Try updating access of signer1
      try {
        await account.updatePermissions(signer1Wallet.address, {
          approvedCallTargets: [signer2Wallet.address],
        });
        expect.fail();
      } catch (err: any) {
        expect(err.message).to.equal(
          "Signer does not already have permissions. You can grant permissions using `grantPermissions`.",
        );
      }
    });

    it("Should be able to append an approved target for an authorized signer.", async () => {
      // Grant access
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address],
      });

      const restrictions = (await account.getAllSigners()).find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.strictEqual(
        restrictions.approvedCallTargets.length,
        1,
        "New signer1 should have one approved call targets.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );

      // Append approved target
      await account.approveTargetForSigner(
        signer1Wallet.address,
        signer2Wallet.address,
      );

      const newRestrictions = (await account.getAllSigners()).find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.strictEqual(
        newRestrictions.approvedCallTargets.length,
        2,
        "New signer1 should have two approved call targets.",
      );
      assert.strictEqual(
        newRestrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );
      assert.strictEqual(
        newRestrictions.approvedCallTargets[1],
        signer2Wallet.address,
        "New signer1 should have the expected approved call targets.",
      );
    });

    it("Should be able to remove an approved target for an authorized signer.", async () => {
      // Grant access
      await account.grantPermissions(signer1Wallet.address, {
        nativeTokenLimitPerTransaction: "1",
        approvedCallTargets: [adminWallet.address, signer2Wallet.address],
      });

      const restrictions = (await account.getAllSigners()).find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.strictEqual(
        restrictions.approvedCallTargets.length,
        2,
        "New signer1 should have two approved call targets.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );
      assert.strictEqual(
        restrictions.approvedCallTargets[1],
        signer2Wallet.address,
        "New signer1 should have the expected approved call targets.",
      );

      // Remove approved target
      await account.disapproveTargetForSigner(
        signer1Wallet.address,
        signer2Wallet.address,
      );

      const newRestrictions = (await account.getAllSigners()).find(
        (result) =>
          utils.getAddress(result.signer) ===
          utils.getAddress(signer1Wallet.address),
      )?.permissions as SignerPermissions;
      assert.strictEqual(
        newRestrictions.approvedCallTargets.length,
        1,
        "New signer1 should have one approved call targets.",
      );
      assert.strictEqual(
        newRestrictions.approvedCallTargets[0],
        adminWallet.address,
        "New signer1 should have the expected approved call targets.",
      );
    });

    it("Should be able to set access for the account in a batch.", async () => {
      /**
       * All cases to test
       *
       * - 1. Adding a new admin
       * - 2. Removing existing admin
       * - 3. Adding a new scoped signer
       * - 4. Removing an existing scoped signer
       * - 5. Updating the restrictions of an existing scoped signer
       * - 6. Existing admin -> new scoped signer (demote)
       * - 7. Existing scoped signer -> new admin :check: (promote)
       **/

      const signersWithRestrictions: PermissionSnapshotInput = [];

      // Setup

      const restrictionsForAdmin = {
        signer: adminWallet.address,
        isAdmin: true,
        permissions: { approvedCallTargets: [] },
      };
      signersWithRestrictions.push(restrictionsForAdmin);

      // Adding a new admin: Signer3
      const restrictionsSigner3 = {
        signer: signer3Wallet.address,
        isAdmin: true,
        permissions: { approvedCallTargets: [] },
      };
      signersWithRestrictions.push(restrictionsSigner3);

      // Removing existing admin
      await account.grantAdminPermissions(signer4Wallet.address);

      const restrictionsSigner4 = {
        signer: signer4Wallet.address,
        isAdmin: false,
        permissions: { approvedCallTargets: [] },
      };
      signersWithRestrictions.push(restrictionsSigner4);

      // Adding a new scoped signer
      const restrictionsSigner5 = {
        signer: signer5Wallet.address,
        isAdmin: false,
        permissions: { approvedCallTargets: [adminWallet.address] },
      };
      signersWithRestrictions.push(restrictionsSigner5);

      // Removing an existing scoped signer
      await account.grantPermissions(signer6Wallet.address, {
        approvedCallTargets: [adminWallet.address],
      });

      const restrictionsSigner6 = {
        signer: signer6Wallet.address,
        isAdmin: false,
        permissions: { approvedCallTargets: [] },
      };
      signersWithRestrictions.push(restrictionsSigner6);

      // Updating the restrictions of an existing scoped signer

      await account.grantPermissions(signer7Wallet.address, {
        approvedCallTargets: [adminWallet.address],
      });

      const restrictionsSigner7 = {
        signer: signer7Wallet.address,
        isAdmin: false,
        permissions: { approvedCallTargets: [signer1Wallet.address] },
      };
      signersWithRestrictions.push(restrictionsSigner7);

      // Existing admin -> new scoped signer (demote)
      await account.grantAdminPermissions(signer8Wallet.address);

      const restrictionsSigner8 = {
        signer: signer8Wallet.address,
        isAdmin: false,
        permissions: { approvedCallTargets: [adminWallet.address] },
      };
      signersWithRestrictions.push(restrictionsSigner8);

      // Existing scoped signer -> new admin (promote)
      await account.grantPermissions(signer9Wallet.address, {
        approvedCallTargets: [adminWallet.address],
      });

      const restrictionsSigner9 = {
        signer: signer9Wallet.address,
        isAdmin: true,
        permissions: { approvedCallTargets: [] },
      };
      signersWithRestrictions.push(restrictionsSigner9);

      // Set access in batch
      await account.resetAllPermissions(signersWithRestrictions);

      // Now checking if permissions are set correctly
      const signersWithPermissionsAfter = await account.getAllSigners();
      const signersAfter = signersWithPermissionsAfter.map(
        (item) => item.signer,
      );
      const allAdminsAfter = await account.getAllAdmins();

      for (const signer of [...signersAfter, ...allAdminsAfter]) {
        const permissions = signersWithPermissionsAfter.find(
          (item) => utils.getAddress(item.signer) === utils.getAddress(signer),
        )?.permissions as SignerPermissions;

        switch (signer) {
          // `adminWallet` should be an admin
          case adminWallet.address:
            assert.isTrue(
              allAdminsAfter.includes(signer),
              "Admin account should be an admin.",
            );
            break;
          // `signer3Wallet` should be an admin
          case signer3Wallet.address:
            assert.isTrue(
              allAdminsAfter.includes(signer),
              "Signer3 account should be an admin.",
            );
            break;
          // `signer4Wallet` should not be admin or scoped signer
          case signer4Wallet.address:
            assert.isFalse(
              allAdminsAfter.includes(signer),
              "Signer4 account should not be an admin.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets.length,
              0,
              "Signer4 account should not have any approved call targets.",
            );
            break;
          // `signer5Wallet` should be a scoped signer
          case signer5Wallet.address:
            assert.isFalse(
              allAdminsAfter.includes(signer),
              "Signer5 account should not be an admin.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets.length,
              1,
              "Signer5 account should have one approved call target.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets[0],
              adminWallet.address,
              "Signer5 account should have the expected approved call targets.",
            );
            break;
          // `signer6Wallet` should not be admin or scoped signer
          case signer6Wallet.address:
            assert.isFalse(
              allAdminsAfter.includes(signer),
              "Signer6 account should not be an admin.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets.length,
              0,
              "Signer6 account should not have any approved call targets.",
            );
            break;
          // `signer7Wallet` should be a scoped signer with its updated restrictions
          case signer7Wallet.address:
            assert.isFalse(
              allAdminsAfter.includes(signer),
              "Signer7 account should not be an admin.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets.length,
              1,
              "Signer7 account should have one approved call target.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets[0],
              signer1Wallet.address,
              "Signer7 account should have the expected approved call targets.",
            );
            break;
          // `signer8Wallet` should be a scoped signer
          case signer8Wallet.address:
            assert.isFalse(
              allAdminsAfter.includes(signer),
              "Signer8 account should not be an admin.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets.length,
              1,
              "Signer8 account should have one approved call target.",
            );
            assert.strictEqual(
              permissions.approvedCallTargets[0],
              adminWallet.address,
              "Signer8 account should have the expected approved call targets.",
            );
            break;
          // `signer9Wallet` should be an admin
          case signer9Wallet.address:
            assert.isTrue(
              allAdminsAfter.includes(signer),
              "Signer9 account should be an admin.",
            );
            break;
          default:
            assert.fail("Unexpected signer.");
        }
      }
    });
  });
});
