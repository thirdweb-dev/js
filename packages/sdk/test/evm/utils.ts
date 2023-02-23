import { resolveContractUriFromAddress } from "../../src/evm";
import { defaultProvider } from "./before-setup";
import { mockUploadWithCID } from "./mock/MockStorage";
import { ContractInterface, ethers } from "ethers";

export const deployContractAndUploadMetadata = async (
  abi: ContractInterface,
  bytecode: string,
  signer: ethers.Signer,
  args: any[] = [],
) => {
  const deployer = await new ethers.ContractFactory(abi, bytecode)
    .connect(signer)
    .deploy(...args);
  const deployed = await deployer.deployed();
  await mockUploadContractMetadata(deployed.address, abi);
  return deployed.address;
};

export const mockUploadContractMetadata = async (address: string, abi: any) => {
  const ipfsHash = (await resolveContractUriFromAddress(
    address,
    defaultProvider,
  )) as string;

  const metadata = {
    compiler: {},
    output: {
      abi,
      devdoc: {},
      userdoc: {},
    },
    settings: {
      compilationTarget: {},
      evmVersion: {},
      metadata: {},
      optimizer: {},
      remappings: [],
    },
    sources: {},
    version: 1,
  };
  const cid = ipfsHash.replace("ipfs://", "");

  await mockUploadWithCID(cid, JSON.stringify(metadata));
};
