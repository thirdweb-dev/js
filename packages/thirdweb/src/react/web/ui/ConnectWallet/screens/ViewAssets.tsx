import { useMemo, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { iconSize, type Theme } from "../../../../core/design-system/index.js";
import type {
  SupportedNFTs,
  SupportedTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import Tabs from "../../components/Tabs.js";
import { CoinsIcon } from "../icons/CoinsIcon.js";
import { ImageIcon } from "../icons/ImageIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WalletDetailsModalScreen } from "./types.js";
import { ViewNFTsContent } from "./ViewNFTs.js";
import { ViewTokensContent } from "./ViewTokens.js";

/**
 * @internal
 */
export type AssetTabs = "token" | "nft";

const TokenTab = {
  label: (
    <span className="flex gap-2">
      <CoinsIcon size={iconSize.sm} /> Tokens
    </span>
  ),
  value: "Tokens",
};

const NftTab = {
  label: (
    <span className="flex gap-2">
      <ImageIcon size={iconSize.sm} /> NFTs
    </span>
  ),
  value: "NFTs",
};

/**
 * @internal
 */
export function ViewAssets(props: {
  supportedTokens?: SupportedTokens;
  supportedNFTs?: SupportedNFTs;
  theme: Theme | "light" | "dark";
  onBack: () => void;
  setScreen: (screen: WalletDetailsModalScreen) => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  assetTabs?: AssetTabs[];
}) {
  const { connectLocale } = props;
  const options = useMemo(() => {
    if (!props.assetTabs) {
      return [TokenTab, NftTab];
    }
    if (!props.assetTabs.length) {
      return [];
    }
    const tabs = [];
    for (const item of props.assetTabs) {
      if (item === "token") {
        tabs.push(TokenTab);
      } else if (item === "nft") {
        tabs.push(NftTab);
      }
    }
    return tabs;
  }, [props.assetTabs]);

  // Since `options` is now a dynamic value, the default active tab is set to the value of the first tab in `options`
  const [activeTab, setActiveTab] = useState(options[0]?.value || "Tokens");

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={connectLocale.viewFunds.viewAssets}
        />
      </Container>
      <Line />
      <Container
        px="lg"
        scrollY
        style={{
          minHeight: "330px",
        }}
      >
        <Spacer y="md" />
        <Tabs onSelect={setActiveTab} options={options} selected={activeTab}>
          <Container
            scrollY
            style={{
              maxHeight: "300px",
            }}
          >
            {activeTab === "Tokens" && (
              <ViewTokensContent
                client={props.client}
                connectLocale={connectLocale}
                supportedTokens={props.supportedTokens}
              />
            )}
            {activeTab === "NFTs" && (
              <ViewNFTsContent
                client={props.client}
                connectLocale={connectLocale}
                supportedNFTs={props.supportedNFTs}
                theme={props.theme}
              />
            )}
          </Container>
        </Tabs>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
