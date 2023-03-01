import { SmartContract, Token } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TokenERC20__factory } from "@thirdweb-dev/contracts-js";
import { getContract, getContractFromAbi } from "@thirdweb-dev/sdk";
import { expect } from "chai";

describe("Functions", async () => {
  let adminWallet: SignerWithAddress;

  before(() => {
    [adminWallet] = signers;
  });

  it("getContractFromAbi should resolve contract with ABI", async () => {
    const address = await sdk.deployer.deployToken({
      name: "Token",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = await getContractFromAbi({
      address,
      abi: TokenERC20__factory.abi,
      network: adminWallet,
    });
    const balance = await contract.call("balanceOf", adminWallet.address);
    expect(balance.toString()).to.equal("0");
  });

  it("getContract should resolve contract with contract type", async () => {
    const address = await sdk.deployer.deployToken({
      name: "Token",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = (await getContract({
      address,
      network: adminWallet,
      contractTypeOrAbi: "token",
    })) as any as Token;
    const balance = await contract.balance();
    expect(balance.displayValue).to.equal("0.0");
  });

  it("getContract should resolve contract without type", async () => {
    const address = await sdk.deployer.deployToken({
      name: "Token",
      primary_sale_recipient: adminWallet.address,
    });
    const contract = (await getContract({
      address,
      network: adminWallet,
    })) as any as SmartContract;
    const balance = await contract.erc20.balance();
    expect(balance.displayValue).to.equal("0.0");
  });
});
