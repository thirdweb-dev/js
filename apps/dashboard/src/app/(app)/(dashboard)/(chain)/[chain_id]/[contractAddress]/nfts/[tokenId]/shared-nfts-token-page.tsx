import { notFound, redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "@/api/auth-token";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { buildContractPagePath } from "../../_utils/contract-page-path";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../../_utils/newPublicPage";
import { NFTPublicPage } from "../../public-pages/nft/nft-page";
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
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
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
        chainIdOrSlug: props.chainIdOrSlug,
        contractAddress: props.contractAddress,
        projectMeta: props.projectMeta,
        subpath: "/nfts",
      }),
    );
  }

  // public /nfts/[tokenId] page
  if (!props.projectMeta) {
    const meta = await shouldRenderNewPublicPage(info.serverContract);
    if (meta && (meta.type === "erc721" || meta.type === "erc1155")) {
      return (
        <NFTPublicPage
          chainMetadata={info.chainMetadata}
          clientContract={info.clientContract}
          serverContract={info.serverContract}
          tokenId={props.tokenId}
          type={meta.type}
        />
      );
    }
  }

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <TokenIdPageClient
        accountAddress={accountAddress || undefined}
        contract={clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
        tokenId={props.tokenId}
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
      accountAddress={accountAddress || undefined}
      contract={clientContract}
      isErc721={supportedERCs.isERC721}
      isLoggedIn={props.isLoggedIn}
      projectMeta={props.projectMeta}
      tokenId={props.tokenId}
    />
  );
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}
