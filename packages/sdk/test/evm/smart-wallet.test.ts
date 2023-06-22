import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { SmartWalletFactory, SmartWallet } from "../../src/evm";
import { ContractFactory, ethers } from "ethers";
import EntrypointArtifact from "./mock/EntryPoint.json";
import { ContractWrapper } from "../../src/evm/core/classes/contract-wrapper";

// Target ABIs
import IAccountFactoryAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountFactory.json";
import IAccountCoreAbi from "@thirdweb-dev/contracts-js/dist/abis/IAccountCore.json";
import type {
    IAccountCore,
    IAccountFactory,
  } from "@thirdweb-dev/contracts-js";

global.fetch = /* @__PURE__ */ require("cross-fetch");

/* @__PURE__ */ describe("Smart wallets with wallet factory", function () {

    const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

    let smartWalletFactory: SmartWalletFactory<IAccountFactory>;
    let smartWallet: SmartWallet<IAccountCore>;

    let adminWallet: SignerWithAddress;
    let signer1Wallet: SignerWithAddress;
    let signer2Wallet: SignerWithAddress;

    before(async () => {
        [adminWallet, signer1Wallet, signer2Wallet] = signers;

        const entrypoint = await new ContractFactory(EntrypointArtifact.abi, EntrypointArtifact.bytecode, adminWallet).deploy();
        const factoryAddress = await sdk.deployer.deployReleasedContract(THIRDWEB_DEPLOYER, "AccountFactory", [entrypoint.address]);

        const wrapper = new ContractWrapper<IAccountFactory>(
            await adminWallet.getChainId(),
            factoryAddress,
            IAccountFactoryAbi,
            sdk.options
        );
        smartWalletFactory = new SmartWalletFactory(wrapper);
    })

    describe("Test: SmartWalletFactory actions", () => {

        it("Should create a new wallet for the admin", async() => {
            
            // Checke before creating a smart wallet for `adminWallet`
            assert.isFalse(await smartWalletFactory.isWalletDeployed(adminWallet.address), "Smart wallet is should not be deployed for admin.");
            
            const predictedAccountAddress: string = await smartWalletFactory.predictWalletAddress(adminWallet.address);

            const allWalletsBefore = (await smartWalletFactory.getAllWallets()).map((wallet) => wallet.account);
            assert.isFalse(allWalletsBefore.includes(predictedAccountAddress), "Account should not be deployed for admin already.");

            assert.isTrue((await smartWalletFactory.getAssociatedSigners(predictedAccountAddress)).length === 0, "Wallet should have no associated signers.");
            assert.isTrue((await smartWalletFactory.getAssociatedWallets(adminWallet.address)).length === 0, "Signer should have no associated wallets.");

            // Create smart wallet for `adminWallet`
            const tx = await smartWalletFactory.createWallet(adminWallet.address);

            // Checks after creating a smart wallet for `adminWallet`
            assert.strictEqual(ethers.utils.getAddress(tx.address), ethers.utils.getAddress(predictedAccountAddress), "Smart wallet address should match predicted address.");
            assert.isTrue(await smartWalletFactory.isWalletDeployed(adminWallet.address), "Smart wallet is should be deployed for admin.");
            
            const allWalletsAfter = await smartWalletFactory.getAllWallets();
            assert.isTrue(allWalletsAfter.length === 1, "Only one wallet should be created on the factory.");

            const { account, admin } = allWalletsAfter.filter((wallet) => ethers.utils.getAddress(wallet.account) === ethers.utils.getAddress(predictedAccountAddress))[0];
            assert.strictEqual(ethers.utils.getAddress(account), ethers.utils.getAddress(predictedAccountAddress), "Stored account address should match predicted address.");
            assert.strictEqual(ethers.utils.getAddress(admin), ethers.utils.getAddress(adminWallet.address), "Correct admin for smart wallet.");

            const associatedWallets = await smartWalletFactory.getAssociatedWallets(admin);
            const associatedSigner = await smartWalletFactory.getAssociatedSigners(account);

            assert.isTrue(associatedWallets.length === 1, "Wallet should have only the admin as an associated signer.");
            assert.strictEqual(ethers.utils.getAddress(account), ethers.utils.getAddress(associatedWallets[0]), "Wallet should have only the admin as an associated signer.");
            assert.isTrue(associatedSigner.length === 1, "Signer should have only the created wallet as an associated wallet.");
            assert.strictEqual(ethers.utils.getAddress(admin), ethers.utils.getAddress(associatedSigner[0]), "Signer should have only the created wallet as an associated wallet.");
        })

        it("Should throw if creating wallet for an admin who already has one", async() => {
            // Create a wallet for admin
            await smartWalletFactory.createWallet(adminWallet.address);

            // Try creating another wallet for the same admin
            assert.throws(async() => {await smartWalletFactory.createWallet(adminWallet.address)} , `Wallet already deployed for admin: ${adminWallet.address}`);
        })
    })

    describe("Test: SmartWallet actions", () => {

        before(async() => {
            // Create a wallet for admin
            const tx = await smartWalletFactory.createWallet(adminWallet.address);
            const smartWalletAddress = tx.address;

            const wrapper = new ContractWrapper<IAccountCore>(
                await adminWallet.getChainId(),
                smartWalletAddress,
                IAccountCoreAbi,
                sdk.options
            );
            smartWallet = new SmartWallet(wrapper);

            sdk.updateSignerOrProvider(adminWallet);
        })

        it("Should be able to add another admin to the wallet.", async () => {

        })

        it("Should be able to remove an admin from the wallet.", async () => {
            
        })

        it("Should be able to grant restricted access to a new signer.", async () => {

        })

        it("Should not be able to grant restricted access to a signer who already has access.", async () => {

        })

        it("Should be able to revoke restricted access from an authorized signer.", async () => {
            
        })

        it("Should not be able to revoke restricted access from a signer who doesn't have access.", async () => {
            
        })

        it("Should be able to update access of an authorized signer.", async () => {
            
        })

        it("Should not be able to update access of a signer who doesn't have access.", async () => {
            
        })

        it("Should be able to append an approved target for an authorized signer.", async () => {
            
        })

        it("Should be able to remove an approved target for an authorized signer.", async () => {
            
        })
    })
})