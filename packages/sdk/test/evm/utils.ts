import { resolveContractUriFromAddress } from "../../src/evm";
import { defaultProvider } from "./before-setup";
import { mockUploadWithCID } from "./mock/MockStorage";
import { ContractInterface, ethers } from "ethers";

export const deployContractAndUploadMetadata = async (
  abi: ContractInterface,
  bytecode: string,
  signer: ethers.Signer,
  args: any[] = [],
  contractName: string = "default-name",
) => {
  const deployer = await new ethers.ContractFactory(abi, bytecode)
    .connect(signer)
    .deploy(...args);
  const deployed = await deployer.deployed();
  await mockUploadContractMetadata(contractName, deployed.address, abi);
  return deployed.address;
};

export const mockUploadContractMetadata = async (
  contractName: string,
  address: string,
  abi: any,
) => {
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
      compilationTarget: {
        contract: contractName,
      },
      evmVersion: {},
      metadata: {},
      optimizer: {},
      remappings: [],
    },
    sources: {},
    version: 1,
  };
  const metadataCID = ipfsHash.replace("ipfs://", "");
  await mockUploadWithCID(metadataCID, JSON.stringify(metadata));

  // mock bytecode
  const bytecodeUri = ipfsHash.concat("bytecode");
  const bytecodeCID = bytecodeUri.replace("ipfs://", "");
  await mockUploadWithCID(bytecodeCID, "0x6060");

  // mock raw-metadata
  const rawMeta = {
    name: contractName,
    metadataUri: ipfsHash,
    bytecodeUri: bytecodeUri,
  };
  const rawMetaUri = ipfsHash.concat("rawMeta");
  const rawMetaCID = rawMetaUri.replace("ipfs://", "");
  await mockUploadWithCID(rawMetaCID, JSON.stringify(rawMeta));
};
