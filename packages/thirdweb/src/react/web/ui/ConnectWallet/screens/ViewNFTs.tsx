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
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
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
      quantityOwned: BigInt(1),
      address: contract.address,
      chain,
    }));
  }

  const erc1155 = await isERC1155({ contract }).catch(() => false);
  if (erc1155) {
    const result = await getErc1155OwnedNFTs({
      contract,
      address: owner,
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
          title={props.connectLocale.viewFunds.viewNFTs}
          onBack={props.onBack}
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
    queryKey: ["nfts", activeChain?.id, activeAccount?.address],
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
        client: props.client,
        chains: [activeChain],
        ownerAddress: activeAccount.address,
      });

      return result
        .filter((nft) => !!nft.name && !!nft.image_url)
        .map((nft) => {
          let parsedNft: NFT;
          const metadata = {
            name: nft.name,
            description: nft.description,
            image: nft.image_url,
            animation_url: nft.video_url,
            external_url: nft.external_url,
            background_color: nft.background_color,
            uri: nft.metadata_url ?? "",
            image_url: nft.image_url,
            attributes: Array.isArray(nft.extra_metadata?.attributes)
              ? nft.extra_metadata?.attributes?.reduce(
                  (acc, attr) => {
                    acc[attr.trait_type] = attr.value;
                    return acc;
                  },
                  {} as Record<string, unknown>,
                )
              : {},
          };

          if (nft.contract?.type === "erc1155") {
            parsedNft = {
              id: BigInt(nft.token_id),
              type: "ERC1155",
              owner: activeAccount.address,
              tokenURI: nft.metadata_url ?? "",
              supply: BigInt(nft.balance), // TODO: this is wrong
              metadata,
            };
          } else {
            parsedNft = {
              id: BigInt(nft.token_id),
              type: "ERC721",
              owner: activeAccount.address,
              tokenURI: nft.metadata_url ?? "",
              metadata,
            };
          }

          return {
            chain: getCachedChain(nft.chain_id),
            address: nft.token_address as Address,
            quantityOwned: BigInt(nft.balance),
            ...parsedNft,
          };
        });
    },
    enabled: !!activeChain && !!activeAccount,
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
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {nftQuery.error ? (
          <Text>Error loading NFTs</Text>
        ) : nftQuery.isLoading || !filteredNFTs ? (
          <Skeleton height="150px" width="150px" />
        ) : (
          filteredNFTs.map((nft) => (
            <NftCard
              key={`${nft.chain.id}:${nft.address}:${nft.id}`}
              {...nft}
              client={props.client}
              chain={nft.chain}
              theme={props.theme}
            />
          ))
        )}
      </Container>
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
        display: "flex",
        width: "150px",
        flexDirection: "column",
        gap: "4px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          width: "150px",
          height: "150px",
          borderRadius: "8px",
          overflow: "hidden",
          background:
            theme === "light" ? "rgba(0, 0, 0, 0.10)" : "rgba(0, 0, 0, 0.20)",
        }}
      >
        {props.metadata.image && (
          <MediaRenderer
            src={props.metadata.image}
            style={{
              width: "100%",
              height: "100%",
            }}
            client={props.client}
          />
        )}
        {props.quantityOwned > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              background:
                themeObject?.colors?.modalBg ??
                (theme === "light" ? "white" : "black"),
              fontSize: "10px",
              padding: "4px 4px",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "100%",
            }}
          >
            {props.quantityOwned.toString()}
          </div>
        )}
        {props.chain.icon && (
          <img
            alt={props.chain.name}
            style={{
              position: "absolute",
              bottom: "4px",
              left: "4px",
              width: "20px",
              height: "20px",
            }}
            src={props.chain.icon.url}
          />
        )}
      </div>
      <Text
        size="xs"
        color="primaryText"
        style={{
          fontWeight: 600,
          textAlign: "center",
          maxLines: 2,
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
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return content;
}
