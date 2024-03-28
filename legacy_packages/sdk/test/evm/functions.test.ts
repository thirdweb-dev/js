import { SmartContract, Token, joinABIs } from "../../src/evm";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TokenERC20__factory } from "@thirdweb-dev/contracts-js";
import { getContract, getContractFromAbi } from "../../src";
import { expect } from "chai";
import { unique } from "../../src/evm/common/utils";

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
    const balance = await contract.call("balanceOf", [adminWallet.address]);
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

  it("check abi merge", async () => {
    const abi = TokenERC20__factory.abi;
    const joined = joinABIs([abi, abi, abi], abi);

    expect(joined.length).to.equal(abi.length);

    abi.forEach((n) => {
      const index = joined.findIndex((m) => {
        if (n.name) {
          return (
            n.name === m.name &&
            n.type === m.type &&
            n.inputs.length === m.inputs.length
          );
        } else {
          return n.type === m.type && n.inputs.length === m.inputs.length;
        }
      });

      expect(index).to.be.greaterThanOrEqual(0);
    });
  });

  it("check unique filter", async () => {
    const arrayOne = [1, 2, 3, 4];
    const arrayTwo = [4, 3, 2, 1];
    const arrayThree = [1, 2, 3, 4];
    const arrayFour = [4, 2, 3, 1];

    let merged: number[] = [];
    merged.push(...arrayOne, ...arrayTwo, ...arrayThree, ...arrayFour);

    const filtered = unique(merged, (a, b): boolean => a === b);

    expect(filtered.length).to.equal(arrayOne.length);

    arrayOne.forEach((n) => {
      expect(filtered.includes(n)).to.be.true;
    });
  });
});
