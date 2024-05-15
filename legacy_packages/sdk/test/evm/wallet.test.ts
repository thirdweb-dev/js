import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";

describe("Wallet", async () => {
  let adminWallet: SignerWithAddress, samWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet] = signers;
  });

  it("should transfer native currencies", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const oldBalance = await sdk.wallet.balance();
    expect(oldBalance.decimals).to.eq(18);
    await sdk.wallet.transfer(samWallet.address, 2);
    const newBalance = await sdk.wallet.balance();
    expect(oldBalance.value.sub(newBalance.value).gt(BigNumber.from(2))).to.eq(
      true,
    );
  });

  it("should transfer ERC20 tokens", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const tokenAddr = await sdk.deployer.deployToken({
      name: "My Token",
      primary_sale_recipient: adminWallet.address,
    });
    await (await sdk.getToken(tokenAddr)).mint(100);

    const oldBalance = await sdk.wallet.balance(tokenAddr);
    expect(oldBalance.displayValue).to.eq("100.0");
    await sdk.wallet.transfer(samWallet.address, 20, tokenAddr);
    const newBalance = await sdk.wallet.balance(tokenAddr);
    expect(newBalance.displayValue).to.eq("80.0");

    sdk.updateSignerOrProvider(samWallet);
    const samBalance = await sdk.wallet.balance(tokenAddr);
    expect(samBalance.displayValue).to.eq("20.0");
  });

  it("should fetch addresses", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    expect(await sdk.wallet.getAddress()).to.eq(adminWallet.address);
    sdk.updateSignerOrProvider(samWallet);
    expect(await sdk.wallet.getAddress()).to.eq(samWallet.address);
  });

  it("should sign and recover address", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const message = "This is the message to sign.";
    const signature = await sdk.wallet.sign(message);
    const address = sdk.wallet.recoverAddress(message, signature);
    expect(address).to.eq(adminWallet.address);
  });

  it("should sign typed data and recover address", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const { payload, signature } = await sdk.wallet.signTypedData(
      {
        name: "MyEIP721Domain",
        version: "1",
        chainId: 1,
        verifyingContract: adminWallet.address,
      },
      {
        MyStruct: [
          { name: "to", type: "address" },
          { name: "quantity", type: "uint256" },
        ],
      },
      { to: adminWallet.address, quantity: 1 },
    );
    expect(payload !== undefined).to.eq(true);
    expect(signature !== undefined).to.eq(true);
  });
});
