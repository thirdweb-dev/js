import { useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { type Theme, iconSize } from "../../../../core/design-system/index.js";
import type {
  SupportedNFTs,
  SupportedTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Spacer } from "../../components/Spacer.js";
import Tabs from "../../components/Tabs.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { CoinsIcon } from "../icons/CoinsIcon.js";
import { ImageIcon } from "../icons/ImageIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import { ViewNFTsContent } from "./ViewNFTs.js";
import { ViewTokensContent } from "./ViewTokens.js";
import type { WalletDetailsModalScreen } from "./types.js";

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
}) {
  const [activeTab, setActiveTab] = useState("Tokens");
  const { connectLocale } = props;

  return (
    <Container
      animate="fadein"
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          title={connectLocale.viewFunds.title}
          onBack={props.onBack}
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
        <Tabs
          options={[
            {
              label: (
                <span className="flex gap-2">
                  <CoinsIcon size={iconSize.sm} /> Tokens
                </span>
              ),
              value: "Tokens",
            },
            {
              label: (
                <span className="flex gap-2">
                  <ImageIcon size={iconSize.sm} /> NFTs
                </span>
              ),
              value: "NFTs",
            },
          ]}
          selected={activeTab}
          onSelect={setActiveTab}
        >
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
                supportedNFTs={props.supportedNFTs}
                client={props.client}
                theme={props.theme}
                connectLocale={connectLocale}
              />
            )}
          </Container>
        </Tabs>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
