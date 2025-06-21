import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import type { ThirdwebContract } from "thirdweb";
import { fetchPublishedContract } from "thirdweb/contract";
import {
  getContractPublisher,
  getPublishedUriFromCompilerUri,
} from "thirdweb/extensions/thirdweb";
import { download } from "thirdweb/storage";
import {
  extractIPFSUri,
  isZkSyncChain,
  resolveImplementation,
} from "thirdweb/utils";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

type ZkSolcMetadata = {
  source_metadata: { settings: { compilationTarget: Record<string, string> } };
};

export async function fetchPublishedContractsFromDeploy(options: {
  contract: ThirdwebContract;
}) {
  const { contract } = options;
  const { bytecode } = await resolveImplementation(contract);
  const contractUri = extractIPFSUri(bytecode);
  if (!contractUri) {
    throw new Error("No IPFS URI found in bytecode");
  }

  let publishURIs = await getPublishedUriFromCompilerUri({
    compilerMetadataUri: contractUri,
    contract: getContractPublisher(contract.client),
  });

  // Try fetching using contract name from compiler metadata for zksolc variants
  // TODO: ContractPublisher should handle multiple metadata uri for a published version
  if (publishURIs.length === 0 && (await isZkSyncChain(contract.chain))) {
    try {
      const res = await download({
        client: contract.client,
        uri: contractUri,
      });

      const deployMetadata = (await res.json()) as ZkSolcMetadata;

      const contractId = Object.values(
        deployMetadata.source_metadata.settings.compilationTarget,
      );

      if (contractId[0]) {
        const published = await fetchPublishedContract({
          client: contract.client,
          contractId: contractId[0],
          publisherAddress: THIRDWEB_DEPLOYER_ADDRESS,
        });
        publishURIs = [published.publishMetadataUri];
      }
    } catch {}
  }

  return await Promise.all(
    publishURIs.map((uri) => fetchDeployMetadata(uri, contract.client)),
  );
}
