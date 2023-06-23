import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { SignerWithRestrictions, AccessRestrictions, SmartWallet, SmartWalletFactory, SignerWithRestrictionsInput, SignerWithRestrictionsBatchInput } from "../../src/evm";
import { ContractFactory, utils } from "ethers";
import EntrypointArtifact from "./mock/EntryPoint.json";
import AccountFactoryArtifact from "./mock/AccountFactory.json";

// Target ABIs
import IAccountCoreAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountCore.json";
import { deployContractAndUploadMetadata, mockUploadContractMetadata } from "./utils";
import { IAccountCore, IAccountFactory } from "@thirdweb-dev/contracts-js";

global.fetch = /* @__PURE__ */ require("cross-fetch");

/* @__PURE__ */ describe("Smart wallets with wallet factory", function () {

    let smartWalletFactory: SmartWalletFactory<IAccountFactory>;
    let smartWallet: SmartWallet<IAccountCore>;

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
    })

    beforeEach(async () => {
        const entrypoint = await new ContractFactory(EntrypointArtifact.abi, EntrypointArtifact.bytecode.object, adminWallet).deploy();
        const factoryAddress = await deployContractAndUploadMetadata(AccountFactoryArtifact.abi, AccountFactoryArtifact.bytecode.object, adminWallet, [entrypoint.address])
        smartWalletFactory = (await sdk.getContract(factoryAddress)).smartWalletFactory;
    })

    describe("Test: SmartWalletFactory actions", () => {

        it("Should create a new wallet for the admin", async() => {
            
            // Check before creating a smart wallet for `adminWallet`
            const isDeployed = await smartWalletFactory.isWalletDeployed(adminWallet.address);
            assert.isFalse(isDeployed, "Smart wallet is should not be deployed for admin.");
            
            const predictedAccountAddress: string = await smartWalletFactory.predictWalletAddress(adminWallet.address);

            const allWalletsBefore = (await smartWalletFactory.getAllWallets()).map((wallet) => wallet.account);
            assert.isFalse(allWalletsBefore.includes(predictedAccountAddress), "Account should not be deployed for admin already.");

            assert.isTrue((await smartWalletFactory.getAssociatedSigners(predictedAccountAddress)).length === 0, "Wallet should have no associated signers.");
            assert.isTrue((await smartWalletFactory.getAssociatedWallets(adminWallet.address)).length === 0, "Signer should have no associated wallets.");

            // Create smart wallet for `adminWallet`
            const tx = await smartWalletFactory.createWallet(adminWallet.address);

            // Checks after creating a smart wallet for `adminWallet`
            assert.strictEqual(utils.getAddress(tx.address), utils.getAddress(predictedAccountAddress), "Smart wallet address should match predicted address.");
            assert.isTrue(await smartWalletFactory.isWalletDeployed(adminWallet.address), "Smart wallet is should be deployed for admin.");
            
            const allWalletsAfter = await smartWalletFactory.getAllWallets();
            assert.isTrue(allWalletsAfter.length === 1, "Only one wallet should be created on the factory.");

            const { account, admin } = allWalletsAfter.filter((wallet) => utils.getAddress(wallet.account) === utils.getAddress(predictedAccountAddress))[0];
            assert.strictEqual(utils.getAddress(account), utils.getAddress(predictedAccountAddress), "Stored account address should match predicted address.");
            assert.strictEqual(utils.getAddress(admin), utils.getAddress(adminWallet.address), "Correct admin for smart wallet.");

            const associatedWallets = await smartWalletFactory.getAssociatedWallets(admin);
            const associatedSigner = await smartWalletFactory.getAssociatedSigners(account);

            assert.isTrue(associatedWallets.length === 1, "Wallet should have only the admin as an associated signer.");
            assert.strictEqual(utils.getAddress(account), utils.getAddress(associatedWallets[0]), "Wallet should have only the admin as an associated signer.");
            assert.isTrue(associatedSigner.length === 1, "Signer should have only the created wallet as an associated wallet.");
            assert.strictEqual(utils.getAddress(admin), utils.getAddress(associatedSigner[0]), "Signer should have only the created wallet as an associated wallet.");
        })

        it("Should throw if creating wallet for an admin who already has one", async() => {
            // Create a wallet for admin
            await smartWalletFactory.createWallet(adminWallet.address);

            // Try creating another wallet for the same admin
            try {
                await smartWalletFactory.createWallet(adminWallet.address);
                expect.fail();
            } catch (err: any) {
                expect(err.message).to.equal(
                    `Wallet already deployed for admin: ${adminWallet.address}`,
                );
            }
        })
    })

    describe("Test: SmartWallet actions", () => {

        beforeEach(async() => {
            // Create a wallet for admin
            const tx = await smartWalletFactory.createWallet(adminWallet.address);
            const smartWalletAddress = tx.address;

            sdk.updateSignerOrProvider(adminWallet);
            await mockUploadContractMetadata("smart-wallet", smartWalletAddress, IAccountCoreAbi)

            smartWallet = (await sdk.getContract(smartWalletAddress)).smartWallet;
        })

        it("Should be able to add another admin to the wallet.", async () => {
            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");

            await smartWallet.grantAdminAccess(signer1Wallet.address);

            assert.isTrue(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should be an admin on the smart wallet.");
            
            const isAdmin = ((await smartWallet.getSignersWithRestrictions()).find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address)) as SignerWithRestrictions).isAdmin;
            assert.isTrue(isAdmin, "New signer1 should be an admin on the wallet.");

            assert.isTrue((await smartWalletFactory.getAssociatedSigners(smartWallet.getAddress())).includes(signer1Wallet.address), "New signer1 is an associated signer of the wallet.");
            assert.isTrue((await smartWalletFactory.getAssociatedWallets(signer1Wallet.address)).includes(smartWallet.getAddress()), "Wallet is an associated wallet of the signer.");
        })

        it("Should be able to remove an admin from the wallet.", async () => {
            await smartWallet.grantAdminAccess(signer1Wallet.address);
            assert.isTrue(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should be an admin on the smart wallet.");

            await smartWallet.revokeAdminAccess(signer1Wallet.address);

            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");
            
            assert.isFalse((await smartWallet.getSignersWithRestrictions()).map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer1 should not be an admin on the wallet.");

            assert.isFalse((await smartWalletFactory.getAssociatedSigners(smartWallet.getAddress())).includes(signer1Wallet.address), "New signer1 is not an associated signer of the wallet.");
            assert.isFalse((await smartWalletFactory.getAssociatedWallets(signer1Wallet.address)).includes(smartWallet.getAddress()), "Wallet is not an associated wallet of the signer.");
        })

        it("Should be able to grant restricted access to a new signer.", async () => {
            const signersWithRestrictions = await smartWallet.getSignersWithRestrictions();
            assert.isFalse(signersWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer should not already have access to the wallet.");

            // Grant access
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address] 
                }
            );

            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");
            const newSignerWithRestrictions = await smartWallet.getSignersWithRestrictions();
            const restrictions = newSignerWithRestrictions.find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.isTrue(newSignerWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer1 should be a signer on the wallet.");
            assert.strictEqual(restrictions.nativeTokenLimitPerTransaction.toString(), utils.parseEther("1").toString(), "New signer1 should have the expected native token limit.");
            assert.strictEqual(restrictions.approvedCallTargets.length, 1, "New signer1 should have one approved call targets.");
            assert.strictEqual(restrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");

            assert.isTrue((await smartWalletFactory.getAssociatedSigners(smartWallet.getAddress())).includes(signer1Wallet.address), "New signer1 is an associated signer of the wallet.");
            assert.isTrue((await smartWalletFactory.getAssociatedWallets(signer1Wallet.address)).includes(smartWallet.getAddress()), "Wallet is an associated wallet of the signer.");
        })

        it("Should not be able to grant restricted access to a signer who already has access.", async () => {
            // Grant access to signer1
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address] 
                }
            );

            // Try granting access to signer1 again
            try {
                await smartWallet.grantAccess(signer1Wallet.address, { approvedCallTargets: [adminWallet.address] });
                expect.fail();
            } catch (err: any) {
                expect(err.message).to.equal(
                    `Signer already has access`,
                );
            }
        })

        it("Should be able to revoke restricted access from an authorized signer.", async () => {
            // Grant access to signer1
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address] 
                }
            );

            // Revoke access
            await smartWallet.revokeAccess(signer1Wallet.address);

            const signersWithRestrictions = await smartWallet.getSignersWithRestrictions();
            assert.isFalse(signersWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer should not have access to the wallet.");

            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");

            assert.isFalse((await smartWalletFactory.getAssociatedSigners(smartWallet.getAddress())).includes(signer1Wallet.address), "New signer1 is not an associated signer of the wallet.");
            assert.isFalse((await smartWalletFactory.getAssociatedWallets(signer1Wallet.address)).includes(smartWallet.getAddress()), "Wallet is not an associated wallet of the signer.");
        })

        it("Should not be able to revoke restricted access from a signer who doesn't have access.", async () => {
            const signersWithRestrictions = await smartWallet.getSignersWithRestrictions();
            assert.isFalse(signersWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer should not already have access to the wallet.");

            // Try revoking access from signer1
            try {
                await smartWallet.revokeAccess(signer1Wallet.address);
                expect.fail();
            } catch (err: any) {
                expect(err.message).to.equal(
                    `Signer does not have any access`,
                );
            }
        })

        it("Should be able to update access of an authorized signer.", async () => {
            // Grant access
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address] 
                }
            );

            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");
            
            const signerWithRestrictions = await smartWallet.getSignersWithRestrictions();
            const restrictions = signerWithRestrictions.find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.isTrue(signerWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer1 should be a signer on the wallet.");
            assert.strictEqual(restrictions.nativeTokenLimitPerTransaction.toString(), utils.parseEther("1").toString(), "New signer1 should have the expected native token limit.");
            assert.strictEqual(restrictions.approvedCallTargets.length, 1, "New signer1 should have one approved call targets.");
            assert.strictEqual(restrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");

            // Update access
            await smartWallet.updateAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "3",
                    approvedCallTargets: [signer2Wallet.address] 
                }
            )

            assert.isFalse(await smartWallet.isAdmin(signer1Wallet.address), "New signer1 should not be an admin on the smart wallet.");
            
            const newSignerWithRestrictions = await smartWallet.getSignersWithRestrictions();
            const newRestrictions = newSignerWithRestrictions.find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.isTrue(newSignerWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer1 should be a signer on the wallet.");
            assert.strictEqual(newRestrictions.nativeTokenLimitPerTransaction.toString(), utils.parseEther("3").toString(), "New signer1 should have the expected native token limit.");
            assert.strictEqual(newRestrictions.approvedCallTargets.length, 1, "New signer1 should have one approved call targets.");
            assert.strictEqual(newRestrictions.approvedCallTargets[0], signer2Wallet.address, "New signer1 should have the expected approved call targets.");
        })

        it("Should not be able to update access of a signer who doesn't have access.", async () => {
            const signersWithRestrictions = await smartWallet.getSignersWithRestrictions();
            assert.isFalse(signersWithRestrictions.map((result) => utils.getAddress(result.signer)).includes(signer1Wallet.address), "New signer should not already have access to the wallet.");

            // Try updating access of signer1
            try {
                await smartWallet.updateAccess(signer1Wallet.address, { approvedCallTargets: [signer2Wallet.address] });
                expect.fail();
            } catch (err: any) {
                expect(err.message).to.equal(
                    `Signer does not have any access`,
                );
            }
        })

        it("Should be able to append an approved target for an authorized signer.", async () => {
            // Grant access
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address] 
                }
            );

            const restrictions = (await smartWallet.getSignersWithRestrictions()).find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.strictEqual(restrictions.approvedCallTargets.length, 1, "New signer1 should have one approved call targets.");
            assert.strictEqual(restrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");

            // Append approved target
            await smartWallet.approveTargetForSigner(signer1Wallet.address, signer2Wallet.address);

            const newRestrictions = (await smartWallet.getSignersWithRestrictions()).find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.strictEqual(newRestrictions.approvedCallTargets.length, 2, "New signer1 should have two approved call targets.");
            assert.strictEqual(newRestrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");
            assert.strictEqual(newRestrictions.approvedCallTargets[1], signer2Wallet.address, "New signer1 should have the expected approved call targets.");
        })

        it("Should be able to remove an approved target for an authorized signer.", async () => {
            // Grant access
            await smartWallet.grantAccess(
                signer1Wallet.address, 
                {
                    nativeTokenLimitPerTransaction: "1",
                    approvedCallTargets: [adminWallet.address, signer2Wallet.address]
                }
            );

            const restrictions = (await smartWallet.getSignersWithRestrictions()).find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.strictEqual(restrictions.approvedCallTargets.length, 2, "New signer1 should have two approved call targets.");
            assert.strictEqual(restrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");
            assert.strictEqual(restrictions.approvedCallTargets[1], signer2Wallet.address, "New signer1 should have the expected approved call targets.");

            // Remove approved target
            await smartWallet.disapproveTargetForSigner(signer1Wallet.address, signer2Wallet.address);

            const newRestrictions = (await smartWallet.getSignersWithRestrictions()).find((result) => utils.getAddress(result.signer) === utils.getAddress(signer1Wallet.address))?.restrictions as AccessRestrictions;
            assert.strictEqual(newRestrictions.approvedCallTargets.length, 1, "New signer1 should have one approved call targets.");
            assert.strictEqual(newRestrictions.approvedCallTargets[0], adminWallet.address, "New signer1 should have the expected approved call targets.");
        })

        it("Should be able to set access for the smart wallet in a batch.", async () => {
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

            const signersWithRestrictions: SignerWithRestrictionsBatchInput = [];

            // Setup

            const restrictionsForAdmin: SignerWithRestrictionsInput = {
                signer: adminWallet.address,
                isAdmin: true,
                restrictions: { approvedCallTargets: [] }
            }
            signersWithRestrictions.push(restrictionsForAdmin);
            
            // Adding a new admin: Signer3
            const restrictionsSigner3: SignerWithRestrictionsInput = {
                signer: signer3Wallet.address,
                isAdmin: true,
                restrictions: { approvedCallTargets: [] }
            }
            signersWithRestrictions.push(restrictionsSigner3);

            // Removing existing admin
            await smartWallet.grantAdminAccess(signer4Wallet.address);

            const restrictionsSigner4: SignerWithRestrictionsInput = {
                signer: signer4Wallet.address,
                isAdmin: false,
                restrictions: { approvedCallTargets: [] }
            }
            signersWithRestrictions.push(restrictionsSigner4);

            // Adding a new scoped signer
            const restrictionsSigner5: SignerWithRestrictionsInput = {
                signer: signer5Wallet.address,
                isAdmin: false,
                restrictions: { approvedCallTargets: [adminWallet.address] }
            }
            signersWithRestrictions.push(restrictionsSigner5);

            // Removing an existing scoped signer
            await smartWallet.grantAccess(signer6Wallet.address, { approvedCallTargets: [adminWallet.address] });

            const restrictionsSigner6: SignerWithRestrictionsInput = {
                signer: signer6Wallet.address,
                isAdmin: false,
                restrictions: { approvedCallTargets: [] }
            }
            signersWithRestrictions.push(restrictionsSigner6);

            // Updating the restrictions of an existing scoped signer

            await smartWallet.grantAccess(signer7Wallet.address, { approvedCallTargets: [adminWallet.address] });

            const restrictionsSigner7: SignerWithRestrictionsInput = {
                signer: signer7Wallet.address,
                isAdmin: false,
                restrictions: { approvedCallTargets: [signer1Wallet.address] }
            }
            signersWithRestrictions.push(restrictionsSigner7);

            // Existing admin -> new scoped signer (demote)
            await smartWallet.grantAdminAccess(signer8Wallet.address);

            const restrictionsSigner8: SignerWithRestrictionsInput = {
                signer: signer8Wallet.address,
                isAdmin: false,
                restrictions: { approvedCallTargets: [adminWallet.address] }
            }
            signersWithRestrictions.push(restrictionsSigner8);

            // Existing scoped signer -> new admin (promote)
            await smartWallet.grantAccess(signer9Wallet.address, { approvedCallTargets: [adminWallet.address] });

            const restrictionsSigner9: SignerWithRestrictionsInput = {
                signer: signer9Wallet.address,
                isAdmin: true,
                restrictions: { approvedCallTargets: [] }
            }
            signersWithRestrictions.push(restrictionsSigner9);

            // Set access in batch
            await smartWallet.setAccess(signersWithRestrictions);

            // Now checking if permissions are set correctly
            const signersWithRestrictionsAfter = await smartWallet.getSignersWithRestrictions();
            
            for(const restrictions of signersWithRestrictionsAfter) {

                switch (restrictions.signer) {

                    // `adminWallet` should be an admin
                    case adminWallet.address:
                        assert.isTrue(restrictions.isAdmin, "Admin wallet should be an admin.");
                        break;
                    // `signer3Wallet` should be an admin
                    case signer3Wallet.address:
                        assert.isTrue(restrictions.isAdmin, "Signer3 wallet should be an admin.");
                        break;
                    // `signer4Wallet` should not be admin or scoped signer
                    case signer4Wallet.address:
                        assert.isFalse(restrictions.isAdmin, "Signer4 wallet should not be an admin.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets.length, 0, "Signer4 wallet should not have any approved call targets.");
                        break;
                    // `signer5Wallet` should be a scoped signer
                    case signer5Wallet.address:
                        assert.isFalse(restrictions.isAdmin, "Signer5 wallet should not be an admin.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets.length, 1, "Signer5 wallet should have one approved call target.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets[0], adminWallet.address, "Signer5 wallet should have the expected approved call targets.");
                        break;
                    // `signer6Wallet` should not be admin or scoped signer
                    case signer6Wallet.address:
                        assert.isFalse(restrictions.isAdmin, "Signer6 wallet should not be an admin.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets.length, 0, "Signer6 wallet should not have any approved call targets.");
                        break;
                    // `signer7Wallet` should be a scoped signer with its updated restrictions
                    case signer7Wallet.address:
                        assert.isFalse(restrictions.isAdmin, "Signer7 wallet should not be an admin.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets.length, 1, "Signer7 wallet should have one approved call target.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets[0], signer1Wallet.address, "Signer7 wallet should have the expected approved call targets.");
                        break;
                    // `signer8Wallet` should be a scoped signer
                    case signer8Wallet.address:
                        assert.isFalse(restrictions.isAdmin, "Signer8 wallet should not be an admin.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets.length, 1, "Signer8 wallet should have one approved call target.");
                        assert.strictEqual(restrictions.restrictions.approvedCallTargets[0], adminWallet.address, "Signer8 wallet should have the expected approved call targets.");
                        break;
                    // `signer9Wallet` should be an admin
                    case signer9Wallet.address:
                        assert.isTrue(restrictions.isAdmin, "Signer9 wallet should be an admin.");
                        break;
                    default:
                        assert.fail("Unexpected signer.");

                }
            }
        })
    })
})