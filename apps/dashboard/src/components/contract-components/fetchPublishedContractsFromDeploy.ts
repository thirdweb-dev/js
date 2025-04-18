import type { ThirdwebClient, ThirdwebContract } from "thirdweb";
import {
  getContractPublisher,
  getPublishedUriFromCompilerUri,
} from "thirdweb/extensions/thirdweb";
import { extractIPFSUri, resolveImplementation } from "thirdweb/utils";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

export async function fetchPublishedContractsFromDeploy(options: {
  contract: ThirdwebContract;
  client: ThirdwebClient;
}) {
  const { contract, client } = options;
  const { bytecode } = await resolveImplementation(contract);
  const contractUri = extractIPFSUri(bytecode);
  if (!contractUri) {
    throw new Error("No IPFS URI found in bytecode");
  }

  const publishURIs = await getPublishedUriFromCompilerUri({
    contract: getContractPublisher(client),
    compilerMetadataUri: contractUri,
  });

  return await Promise.all(
    publishURIs.map((uri) => fetchDeployMetadata(uri, client)),
  );
}
