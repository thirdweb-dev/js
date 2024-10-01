import { useQuery } from "@tanstack/react-query";
import {
  useEns,
  usePublishedContractsFromDeploy,
} from "components/contract-components/hooks";
import { ContractCard } from "components/explore/contract-card";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getBytecode, getContract } from "thirdweb/contract";
import { getPublishedUriFromCompilerUri } from "thirdweb/extensions/thirdweb";
import { getInstalledModules } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { download } from "thirdweb/storage";
import { extractIPFSUri } from "thirdweb/utils";

interface PublishedByProps {
  contract: ThirdwebContract;
}

export const PublishedBy: React.FC<PublishedByProps> = ({ contract }) => {
  const publishedContractsFromDeploy =
    usePublishedContractsFromDeploy(contract);

  const address = useActiveAccount()?.address;

  const publishedContractToShow = useMemo(() => {
    const reversedPublishedContractsFromDeploy = [
      ...(publishedContractsFromDeploy.data || []),
    ].reverse();

    return (
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
      undefined
    );
  }, [publishedContractsFromDeploy.data, address]);

  const publisherEnsQuery = useEns(publishedContractToShow?.publisher);
  const publisherAddress =
    publisherEnsQuery.data?.ensName || publisherEnsQuery.data?.address;

  const installedModules = useReadContract(getInstalledModules, {
    contract,
    queryOptions: {
      enabled: publishedContractToShow?.routerType === "modular" && !!contract,
    },
  });

  // this handles all the logic for modules in the published contract card
  const installedModulesQuery = useQuery({
    queryKey: [
      "published-by-modules",
      contract,
      installedModules.data?.map((m) => m.implementation),
    ],
    queryFn: async () => {
      if (!installedModules.data?.length) {
        return [];
      }

      const moduleContracts = installedModules.data.map((module) => {
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
              return JSON.parse(await content.text());
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

      return filtered.map((m) => m[0]);
    },
    enabled: !!installedModules.data?.length,
  });

  if (!publishedContractToShow || !publisherAddress) {
    return null;
  }

  return (
    <ContractCard
      contractId={publishedContractToShow.name}
      publisher={publisherAddress}
      version={publishedContractToShow.version}
      isBeta={(publishedContractToShow.displayName || "")
        .toLowerCase()
        .includes("beta")}
      modules={installedModulesQuery.data?.map((m) => ({
        publisher: m.publisher,
        moduleId: m.name,
        version: m.version,
      }))}
    />
  );
};
