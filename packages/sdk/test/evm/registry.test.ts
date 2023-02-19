import { joinABIs } from "../../src/evm/common/plugin";
import { MultichainRegistry } from "../../src/evm/core/classes/multichain-registry";
import { ContractRegistry } from "../../src/evm/core/classes/registry";
import { sdk, signers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import RouterABI from "@thirdweb-dev/contracts-js/dist/abis/Router.json";
import { expect } from "chai";

describe("Contract Registry", () => {
  let registry: ContractRegistry;

  let multichainRegistry: MultichainRegistry;

  let adminWallet: SignerWithAddress;

  let address: string;

  before(async () => {
    [adminWallet] = signers;
  });

  it("multichain registry", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    multichainRegistry = sdk.multiChainRegistry;

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });

    const chainId: number = await adminWallet.getChainId();
    const metadataURI: string = "ipfs://metadata";
    await multichainRegistry.addContract({
      address,
      chainId,
      metadataURI,
    });

    let uri = await multichainRegistry.getContractMetadataURI(chainId, address);
    expect(uri).to.equal(metadataURI);

    let contracts = await multichainRegistry.getContractAddresses(
      adminWallet.address,
    );

    expect(contracts[0].address).to.equal(address);
  });

  it("check abi merge", async () => {
    const abi = joinABIs([RouterABI, RouterABI]);

    expect(abi.length).to.equal(RouterABI.length);
  });

  it("should allow adding and removing contracts", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    registry = (await sdk.deployer.getRegistry())!;

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });

    let contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);

    await registry.removeContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.not.contain(address);

    await registry.addContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);
  });

  it("should allow deploying after removing", async () => {
    sdk.updateSignerOrProvider(adminWallet);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    registry = (await sdk.deployer.getRegistry())!;

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });

    let contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.contain(address);

    await registry.removeContract(address);
    contracts = await registry.getContractAddresses(adminWallet.address);
    expect(contracts).to.not.contain(address);

    address = await sdk.deployer.deployNFTCollection({
      name: "Test1",
      primary_sale_recipient: adminWallet.address,
    });
    const contracts2 = await registry.getContractAddresses(adminWallet.address);
    expect(contracts2).to.contain(address);
  });
});
