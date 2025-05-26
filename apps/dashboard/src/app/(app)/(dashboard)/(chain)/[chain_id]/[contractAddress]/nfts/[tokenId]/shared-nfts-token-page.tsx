import { notFound, redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../../../api/lib/getAuthToken";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { buildContractPagePath } from "../../_utils/contract-page-path";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { TokenIdPageClient } from "./TokenIdPage.client";
import { TokenIdPage } from "./token-id";

export async function SharedNFTTokenPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  tokenId: string;
  projectMeta: ProjectMeta | undefined;
  isLoggedIn: boolean;
}) {
  const [info, accountAddress] = await Promise.all([
    getContractPageParamsInfo({
      contractAddress: props.contractAddress,
      chainIdOrSlug: props.chainIdOrSlug,
      teamId: props.projectMeta?.teamId,
    }),
    getAuthTokenWalletAddress(),
  ]);

  if (!info) {
    notFound();
  }

  // redirect to nfts index page
  if (!isOnlyNumbers(props.tokenId)) {
    redirect(
      buildContractPagePath({
        projectMeta: props.projectMeta,
        chainIdOrSlug: props.chainIdOrSlug,
        contractAddress: props.contractAddress,
        subpath: "/nfts",
      }),
    );
  }

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <TokenIdPageClient
        contract={clientContract}
        tokenId={props.tokenId}
        isLoggedIn={props.isLoggedIn}
        accountAddress={accountAddress || undefined}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { supportedERCs } = await getContractPageMetadata(serverContract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <TokenIdPage
      contract={clientContract}
      isErc721={supportedERCs.isERC721}
      tokenId={props.tokenId}
      isLoggedIn={props.isLoggedIn}
      accountAddress={accountAddress || undefined}
      projectMeta={props.projectMeta}
    />
  );
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}
