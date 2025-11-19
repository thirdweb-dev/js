import { unstable_cache } from "next/cache";
import pLimit from "p-limit";
import { defineChain } from "thirdweb";
import { getContract } from "thirdweb/contract";
import {
  getProjectContracts,
  type ProjectContract,
} from "@/api/project/getProjectContracts";
import { supportedERCs } from "@/utils/supportedERCs";
import { serverThirdwebClient } from "../../constants/thirdweb-client.server";
import { resolveFunctionSelectors } from "../../lib/selectors";
import { projectContractsCacheTag } from "./cache-tag";

type GetFilteredProjectContractsParams = {
  teamId: string;
  projectId: string;
  authToken: string;
};

type ProjectContractWithIsToken = ProjectContract & { isToken: boolean };

async function getProjectContractsWithIsTokenInfo(
  params: GetFilteredProjectContractsParams,
): Promise<ProjectContractWithIsToken[]> {
  const contracts = await getProjectContracts({
    authToken: params.authToken,
    deploymentType: undefined, // don't pass it to api to fetch all contracts, we'll filter/merge manually here
    projectId: params.projectId,
    teamId: params.teamId,
  });

  const assetContracts = contracts.filter((c) => c.deploymentType === "asset");
  const otherContracts = contracts.filter((c) => c.deploymentType !== "asset");

  // "asset" deployment type contract is assumed to be a "token" type contract already
  // for others, check if its a "token" type contract (isERC20, isERC721 or isERC1155)

  const limit = pLimit(20);

  const othersContractWithIsTokenInfo: ProjectContractWithIsToken[] =
    await Promise.all(
      otherContracts.map(async (c) => {
        return limit(async () => {
          try {
            const contract = getContract({
              address: c.contractAddress,
              // eslint-disable-next-line no-restricted-syntax
              chain: defineChain(Number(c.chainId)),
              client: serverThirdwebClient,
            });

            const functionSelectors = await resolveFunctionSelectors(contract);
            const ercs = supportedERCs(functionSelectors);
            if (ercs.isERC20 || ercs.isERC721 || ercs.isERC1155) {
              return {
                ...c,
                isToken: true,
              };
            }
            return {
              ...c,
              isToken: false,
            };
          } catch {
            return {
              ...c,
              isToken: false,
            };
          }
        });
      }),
    );

  for (const c of othersContractWithIsTokenInfo) {
    if (c.deploymentType === "asset") {
      assetContracts.push(c);
    } else {
      otherContracts.push(c);
    }
  }

  return [
    ...assetContracts.map(
      (c) => ({ ...c, isToken: true }) as ProjectContractWithIsToken,
    ),
    ...othersContractWithIsTokenInfo,
  ];
}

export async function getFilteredProjectContracts(
  params: GetFilteredProjectContractsParams & {
    type: "token-contracts" | "non-token-contracts";
  },
) {
  const cached_getProjectContractsWithIsTokenInfo = unstable_cache(
    getProjectContractsWithIsTokenInfo,
    ["get-project-contracts-with-is-token-info"],
    {
      revalidate: 3600, // 1 hour
      tags: [projectContractsCacheTag(params)],
    },
  );

  const contracts = await cached_getProjectContractsWithIsTokenInfo(params);

  if (params.type === "token-contracts") {
    return contracts.filter((c) => c.isToken);
  } else {
    return contracts.filter((c) => !c.isToken);
  }
}
