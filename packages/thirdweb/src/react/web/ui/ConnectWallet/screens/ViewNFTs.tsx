import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../chains/types.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getContract } from "../../../../../contract/contract.js";
import { getOwnedNFTs as getErc721OwnedNFTs } from "../../../../../extensions/erc721/read/getOwnedNFTs.js";
import { isERC721 } from "../../../../../extensions/erc721/read/isERC721.js";
import { getOwnedNFTs as getErc1155OwnedNFTs } from "../../../../../extensions/erc1155/read/getOwnedNFTs.js";
import { isERC1155 } from "../../../../../extensions/erc1155/read/isERC1155.js";
import { getOwnedNFTs } from "../../../../../insight/get-nfts.js";
import type { Address } from "../../../../../utils/address.js";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import type { Theme } from "../../../../core/design-system/index.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { SupportedNFTs } from "../../../../core/utils/defaultTokens.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { ConnectLocale } from "../locale/types.js";

const fetchNFTs = async (
  client: ThirdwebClient,
  chain: Chain,
  nftAddress: string,
  owner: string,
) => {
  const contract = getContract({
    address: nftAddress,
    chain,
    client,
  });

  const erc721 = await isERC721({ contract }).catch(() => {
    throw new Error(
      `Failed to read contract bytecode for NFT ${nftAddress} on ${chain.name || chain.id}, is this NFT on the correct chain?`,
    );
  });
  if (erc721) {
    const result = await getErc721OwnedNFTs({
      contract,
      owner: owner,
    });
    return result.map((nft) => ({
      ...nft,
      address: contract.address,
      chain,
      quantityOwned: BigInt(1),
    }));
  }

  const erc1155 = await isERC1155({ contract }).catch(() => false);
  if (erc1155) {
    const result = await getErc1155OwnedNFTs({
      address: owner,
      contract,
    });
    return result.map((nft) => ({ ...nft, address: contract.address, chain }));
  }

  throw new Error(
    `NFT at ${nftAddress} on chain ${chain.id} is not ERC721 or ERC1155, or does not properly identify itself as supporting either interface`,
  );
};

/**
 * @internal
 */
export function ViewNFTs(props: {
  supportedNFTs?: SupportedNFTs;
  theme: Theme | "light" | "dark";
  onBack: () => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.connectLocale.viewFunds.viewNFTs}
        />
      </Container>
      <Line />
      <Container
        px="sm"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Spacer y="md" />
        <ViewNFTsContent {...props} />
      </Container>
    </Container>
  );
}

export function ViewNFTsContent(props: {
  supportedNFTs?: SupportedNFTs;
  client: ThirdwebClient;
  theme: Theme | "light" | "dark";
  connectLocale: ConnectLocale;
}) {
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const nftQuery = useQuery({
    enabled: !!activeChain && !!activeAccount,
    queryFn: async (): Promise<
      (NFT & { chain: Chain; address: Address; quantityOwned: bigint })[]
    > => {
      if (!activeAccount) {
        throw new Error("No active account");
      }
      if (!activeChain) {
        throw new Error("No active chain");
      }

      const result = await getOwnedNFTs({
        chains: [activeChain],
        client: props.client,
        ownerAddress: activeAccount.address,
      });

      return result
        .filter((nft) => !!nft.metadata.name && !!nft.metadata.image)
        .map((nft) => {
          return {
            address: nft.tokenAddress as Address,
            chain: getCachedChain(nft.chainId),
            ...nft,
          };
        });
    },
    queryKey: ["nfts", activeChain?.id, activeAccount?.address],
  });

  if (!activeChain?.id || !activeAccount?.address) {
    return null;
  }

  const filteredNFTs = props.supportedNFTs?.[activeChain.id]
    ? nftQuery.data?.filter((nft) =>
        props.supportedNFTs?.[activeChain.id]
          ?.map((supportedNFTAddress) => supportedNFTAddress.toLowerCase())
          .includes(nft.address.toLowerCase()),
      )
    : nftQuery.data;

  return (
    <>
      {nftQuery.error ? (
        <Container center="both" py="lg">
          <Text center color="secondaryText" size="sm">
            Error loading NFTs
          </Text>
        </Container>
      ) : nftQuery.data?.length === 0 && !nftQuery.isLoading ? (
        <Container center="both" py="lg">
          <Text center color="secondaryText" size="sm">
            No NFTs found on this chain
          </Text>
        </Container>
      ) : (
        <Container
          style={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {nftQuery.isLoading || !filteredNFTs ? (
            <>
              <Skeleton height="150px" width="150px" />
              <Skeleton height="150px" width="150px" />
              <Skeleton height="150px" width="150px" />
            </>
          ) : (
            filteredNFTs.map((nft) => (
              <NftCard
                key={`${nft.chain.id}:${nft.address}:${nft.id}`}
                {...nft}
                chain={nft.chain}
                client={props.client}
                theme={props.theme}
              />
            ))
          )}
        </Container>
      )}
      <Spacer y="lg" />
    </>
  );
}

function NftCard(
  props: Awaited<ReturnType<typeof fetchNFTs>>[number] & {
    client: ThirdwebClient;
    chain: Chain;
    theme: Theme | "light" | "dark";
  },
) {
  const theme =
    typeof props.theme === "string" ? props.theme : props.theme.type;
  const themeObject = typeof props.theme === "string" ? undefined : props.theme;
  const content = (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "150px",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background:
            theme === "light" ? "rgba(0, 0, 0, 0.10)" : "rgba(0, 0, 0, 0.20)",
          borderRadius: "8px",
          display: "flex",
          flexShrink: 0,
          height: "150px",
          overflow: "hidden",
          position: "relative",
          width: "150px",
        }}
      >
        {props.metadata.image && (
          <MediaRenderer
            client={props.client}
            src={props.metadata.image}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        )}
        {props.quantityOwned > 1 && (
          <div
            style={{
              alignItems: "center",
              background:
                themeObject?.colors?.modalBg ??
                (theme === "light" ? "white" : "black"),
              borderRadius: "100%",
              bottom: "4px",
              display: "flex",
              fontSize: "10px",
              height: "20px",
              justifyContent: "center",
              padding: "4px 4px",
              position: "absolute",
              right: "4px",
              width: "20px",
            }}
          >
            {props.quantityOwned.toString()}
          </div>
        )}
        {props.chain.icon && (
          <img
            alt={props.chain.name}
            src={props.chain.icon.url}
            style={{
              bottom: "4px",
              height: "20px",
              left: "4px",
              position: "absolute",
              width: "20px",
            }}
          />
        )}
      </div>
      <Text
        color="primaryText"
        size="xs"
        style={{
          fontWeight: 600,
          maxLines: 2,
          textAlign: "center",
        }}
      >
        {props.metadata.name}
      </Text>
    </div>
  );

  if (props.chain.name) {
    return (
      <a
        href={`https://thirdweb.com/${props.chain.id}/${props.address}/nfts/${props.id}`}
        rel="noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return content;
}
