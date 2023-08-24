import { Contract } from "ethers";
import ContractPublisherAbi from "@thirdweb-dev/contracts-js/dist/abis/ContractPublisher.json";
import type { ContractPublisher } from "@thirdweb-dev/contracts-js";
import { getContractPublisherAddress } from "../../constants/addresses/getContractPublisherAddress";
import { getChainProvider } from "../../constants/urls";
import { AddressOrEns, PublishedContractSchema } from "../../schema";
import { resolveAddress } from "../ens/resolveAddress";
import invariant from "tiny-invariant";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchAndCacheDeployMetadata } from "./fetchAndCacheDeployMetadata";
import { getSupportedChains } from "../../constants";
import { Polygon } from "@thirdweb-dev/chains";

export const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

export async function fetchPublishedContractFromPolygon(
  publisherAddress: AddressOrEns,
  contractName: string,
  version: string = "latest",
  storage: ThirdwebStorage,
  clientId?: string,
  secretKey?: string,
) {
  const polygonChain = getSupportedChains().find((c) => c.chainId === 137);
  const chain = polygonChain || Polygon;
  const publisher = await resolveAddress(publisherAddress);
  const contract = new Contract(
    getContractPublisherAddress(),
    ContractPublisherAbi,
    getChainProvider(chain, { clientId, secretKey }),
  ) as ContractPublisher;

  let publishedContract;
  if (!version || version === "latest") {
    const model = await contract.getPublishedContract(publisher, contractName);
    publishedContract = PublishedContractSchema.parse({
      id: model.contractId,
      timestamp: model.publishTimestamp,
      metadataUri: model.publishMetadataUri,
    });
  } else {
    const allVersions = (
      await contract.getPublishedContractVersions(publisher, contractName)
    ).map((c) => {
      return PublishedContractSchema.parse({
        id: c.contractId,
        timestamp: c.publishTimestamp,
        metadataUri: c.publishMetadataUri,
      });
    });

    // get the metadata for each version
    const versionMetadata = await Promise.all(
      allVersions.map(async (c) => {
        return {
          name: c.id,
          publishedTimestamp: c.timestamp,
          publishedMetadata: await fetchAndCacheDeployMetadata(
            c.metadataUri,
            storage,
          ),
        };
      }),
    );
    // find the version that matches the version string
    const versionMatch = versionMetadata.find(
      (metadata) =>
        metadata.publishedMetadata.extendedMetadata?.version === version,
    );
    invariant(versionMatch, "Contract version not found");
    // match the version back to the contract based on the published timestamp
    publishedContract = allVersions.find(
      (c) => c.timestamp === versionMatch.publishedTimestamp,
    );
  }

  if (!publishedContract) {
    throw new Error(
      `No published contract found for ${contractName} at version by '${THIRDWEB_DEPLOYER}'`,
    );
  }

  return publishedContract;
}
