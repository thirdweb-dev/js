import type { Chain } from "../../../../../chains/types.js";
import { getCachedChain } from "../../../../../chains/utils.js";
import type { NFTs } from "../../../../../chainsaw/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { Theme } from "../../../../core/design-system/index.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import type { SupportedNFTs } from "../../../../core/utils/defaultTokens.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { useGetOwnedNFTs } from "../hooks/useGetOwnedNFTs.js";
import type { ConnectLocale } from "../locale/types.js";

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

  if (!activeChain?.id || !activeAccount?.address) {
    return null;
  }

  const { data, isLoading } = useGetOwnedNFTs({
    client: props.client,
    ownerAddresses: [activeAccount.address as Hex],
    chainIds: [activeChain.id],
  });
  const nfts = data || [];

  return (
    <>
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {isLoading && <Skeleton height="150px" width="150px" />}
        {nfts.map((nft) => (
          <NftCard
            key={`${nft.chainId}:${nft.contractAddress}:${nft.id}`}
            {...nft}
            client={props.client}
            chain={getCachedChain(nft.chainId)}
            theme={props.theme}
          />
        ))}
      </Container>
      <Spacer y="lg" />
    </>
  );
}

function NftCard(
  props: Awaited<NFTs>[number] & {
    client: ThirdwebClient;
    chain: Chain;
    theme: Theme | "light" | "dark";
  },
) {
  const quantityOwned = BigInt(props.balance);
  const theme =
    typeof props.theme === "string" ? props.theme : props.theme.type;
  const themeObject = typeof props.theme === "string" ? undefined : props.theme;
  const content = (
    <div
      style={{
        display: "flex",
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
        {!props.metadata.image && props.imageData && (
          <div
            // TODO: make this safe
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Some NFTs have raw HTML or SVG as image
            dangerouslySetInnerHTML={{
              __html: props.imageData.replace(`\"`, '"'),
            }}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {quantityOwned > 1 && (
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
            {quantityOwned.toString()}
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
      <span style={{ fontWeight: 600 }}>{props.metadata.name}</span>
    </div>
  );

  if (props.chain.name) {
    return (
      <a
        href={`https://thirdweb.com/${props.chain.id}/${props.contractAddress}/nfts/${props.id}`}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return content;
}
