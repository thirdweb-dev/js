import { getThirdwebClient } from "@/constants/thirdweb.server";
import { ContractCard } from "components/explore/contract-card";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import type { ThirdwebContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getBytecode, getContract } from "thirdweb/contract";
import { getPublishedUriFromCompilerUri } from "thirdweb/extensions/thirdweb";
import { getInstalledModules } from "thirdweb/modules";
import { download } from "thirdweb/storage";
import { extractIPFSUri } from "thirdweb/utils";
import { getAuthTokenWalletAddress } from "../../../app/api/lib/getAuthToken";
import { isEnsName, resolveEns } from "../../../lib/ens";
import { fetchPublishedContractsFromDeploy } from "../fetchPublishedContractsFromDeploy";

interface PublishedByProps {
  contract: ThirdwebContract;
}

type ModuleMetadataPickedKeys = {
  publisher: string;
  moduleId: string;
  name: string;
  version: string;
};

export const PublishedBy: React.FC<PublishedByProps> = async ({ contract }) => {
  const client = getThirdwebClient();
  const publishedContractsFromDeploy = await fetchPublishedContractsFromDeploy({
    contract,
    client,
  });

  const address = getAuthTokenWalletAddress();

  const reversedPublishedContractsFromDeploy = [
    ...(publishedContractsFromDeploy || []),
  ].reverse();

  const publishedContractToShow =
    reversedPublishedContractsFromDeploy.find(
      (publishedContract) => publishedContract.publisher === address,
    ) ||
    reversedPublishedContractsFromDeploy.find(
      (publishedContract) =>
        publishedContract.publisher === THIRDWEB_DEPLOYER_ADDRESS,
    ) ||
    reversedPublishedContractsFromDeploy[
      reversedPublishedContractsFromDeploy.length - 1
    ] ||
    undefined;

  if (!publishedContractToShow || !publishedContractToShow.publisher) {
    return null;
  }

  // get publisher address/ens
  let publisherAddressOrEns = publishedContractToShow.publisher;
  if (!isEnsName(publishedContractToShow.publisher)) {
    try {
      const res = await resolveEns(publishedContractToShow.publisher);
      if (res.ensName) {
        publisherAddressOrEns = res.ensName;
      }
    } catch {
      // no op
    }
  }

  // Get Modules metadata for modular contract
  let modules: ModuleMetadataPickedKeys[] = [];
  if (publishedContractToShow?.routerType === "modular") {
    try {
      const installedModules = await getInstalledModules({
        contract,
      });

      if (installedModules.length !== 0) {
        const moduleContracts = installedModules.map((module) => {
          return getContract({ ...contract, address: module.implementation });
        });

        const metadataUris = await Promise.allSettled(
          moduleContracts.map(async (c) => {
            const byteCode = await getBytecode(c);
            const ipfsUri = extractIPFSUri(byteCode);

            if (!ipfsUri) {
              throw new Error("No IPFS URI found in bytecode");
            }
            let uris = await getPublishedUriFromCompilerUri({
              contract: {
                chain: polygon,
                client: contract.client,
                address: "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808",
              },
              compilerMetadataUri: ipfsUri,
            }).catch((e) => {
              console.error("Error fetching published URI", e);
              return [];
            });

            uris = uris.filter((uri) => uri.length > 0);
            if (uris.length === 0) {
              throw new Error("No published URI found");
            }

            const results = await Promise.allSettled(
              uris.map(async (uri) => {
                const content = await download({
                  uri,
                  client: contract.client,
                });
                return JSON.parse(
                  await content.text(),
                ) as ModuleMetadataPickedKeys;
              }),
            );

            return results
              .filter((r) => r.status === "fulfilled")
              .map((r) => r.value);
          }),
        );

        const filtered = metadataUris
          .filter((m) => m.status === "fulfilled")
          .map((m) => m.value);

        modules = filtered.map((m) => m[0]).filter((m) => m !== undefined);
      }
    } catch {
      // no op
    }
  }

  return (
    <ContractCard
      contractId={publishedContractToShow.name}
      publisher={publisherAddressOrEns}
      version={publishedContractToShow.version}
      isBeta={(publishedContractToShow.displayName || "")
        .toLowerCase()
        .includes("beta")}
      modules={modules.map((m) => ({
        publisher: m.publisher,
        moduleId: m.name,
        version: m.version,
      }))}
    />
  );
};
