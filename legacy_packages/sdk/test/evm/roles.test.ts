import { Edition, EditionInitializer } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";

describe("Roles Contract", async () => {
  let bundleContract: Edition;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    bundleContract = await sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(
        EditionInitializer.contractType,
        {
          name: "NFT Contract",
          primary_sale_recipient: adminWallet.address,
          seller_fee_basis_points: 1000,
        },
      ),
    );
  });

  it("should return all assigned roles", async () => {
    /**
     * This wallet owns only one token in the collection (that contains 6 tokens)
     */
    const roles = await bundleContract.roles.get("admin");
    assert.include(
      roles,
      adminWallet.address,
      "The app contract should have a default admin",
    );
  });

  /**
   * Add multiple roles - 0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E gets pauser and transfer
   *
   * Remove multiple roles - 0x553C5E856801b5876e80D32a192086b2035286C1 is revoked from pauser and transfer
   *
   * Replace all roles - for minter, 0x553C5E856801b5876e80D32a192086b2035286C1 is removed and 0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803 is added
   *
   */

  it("should override current roles in the contract", async () => {
    await bundleContract.roles.setAll({
      admin: [adminWallet.address],
      minter: [
        "0x553C5E856801b5876e80D32a192086b2035286C1",
        "0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E",
      ],
      transfer: ["0x553C5E856801b5876e80D32a192086b2035286C1"],
    });

    const newRoles = await bundleContract.roles.getAll();
    assert.isTrue(
      newRoles.admin.length === 1 &&
        newRoles.admin.includes(adminWallet.address),
    );
    assert.isTrue(
      newRoles.minter.length === 2 &&
        newRoles.minter.includes(
          "0x553C5E856801b5876e80D32a192086b2035286C1",
        ) &&
        newRoles.minter.includes("0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E"),
    );
    assert.isTrue(
      newRoles.transfer.length === 1 &&
        newRoles.transfer.includes(
          "0x553C5E856801b5876e80D32a192086b2035286C1",
        ),
    );
  });

  it("Replace all roles - confirm that all roles were replaced (not just added)", async () => {
    await bundleContract.roles.setAll({
      admin: [
        adminWallet.address,
        "0x553C5E856801b5876e80D32a192086b2035286C1",
      ],
      minter: [
        "0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E",
        "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
      ],
      transfer: ["0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E"],
    });
    const newRoles = await bundleContract.roles.getAll();
    assert.isTrue(
      newRoles.admin.length === 2 &&
        newRoles.admin.includes(adminWallet.address) &&
        newRoles.admin.includes("0x553C5E856801b5876e80D32a192086b2035286C1"),
    );
    assert.isTrue(
      newRoles.minter.length === 2 &&
        newRoles.minter.includes(
          "0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E",
        ) &&
        newRoles.minter.includes("0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803"),
    );
    assert.isTrue(
      newRoles.transfer.length === 1 &&
        newRoles.transfer.includes(
          "0xf16851cb58F3b3881e6bdAD21f57144E9aCf602E",
        ),
    );
  });

  it("Make collection non-transferable", async () => {
    const oldRoles = await bundleContract.roles.getAll();
    await bundleContract.roles.setAll({
      admin: [...oldRoles.admin],
      minter: [...oldRoles.minter],
      transfer: [],
    });
    const newRoles = await bundleContract.roles.getAll();
    assert.isTrue(newRoles.admin.length === oldRoles.admin.length);
    assert.isTrue(newRoles.minter.length === oldRoles.minter.length);
    assert.isTrue(newRoles.transfer.length === 0);
  });

  it("Make collection transferable", async () => {
    const oldRoles = await bundleContract.roles.getAll();
    await bundleContract.roles.setAll({
      admin: [...oldRoles.admin],
      minter: [...oldRoles.minter],
      transfer: [AddressZero],
    });
    const newRoles = await bundleContract.roles.getAll();
    assert.isTrue(newRoles.admin.length === oldRoles.admin.length);
    assert.isTrue(newRoles.minter.length === oldRoles.minter.length);
    assert.isTrue(newRoles.transfer.includes(AddressZero));
  });

  it("Make collection non-transferable with some wallets being able to transfer", async () => {
    const oldRoles = await bundleContract.roles.getAll();
    await bundleContract.roles.setAll({
      admin: [...oldRoles.admin],
      minter: [...oldRoles.minter],
      transfer: [bobWallet.address, samWallet.address],
    });
    const newRoles = await bundleContract.roles.getAll();
    assert.isTrue(newRoles.admin.length === oldRoles.admin.length);
    assert.isTrue(newRoles.minter.length === oldRoles.minter.length);
    assert.isTrue(
      newRoles.transfer.includes(bobWallet.address) &&
        newRoles.transfer.includes(samWallet.address) &&
        newRoles.transfer.length === 2 &&
        !newRoles.transfer.includes(AddressZero),
    );
  });
});
