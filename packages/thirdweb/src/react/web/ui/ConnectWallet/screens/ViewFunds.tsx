import type { ThirdwebClient } from "../../../../../client/client.js";
import { fontSize, iconSize } from "../../../../core/design-system/index.js";
import type {
  SupportedNFTs,
  SupportedTokens,
} from "../../../../core/utils/defaultTokens.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import { MenuButton } from "../MenuButton.js";
import { CoinsIcon } from "../icons/CoinsIcon.js";
import { ImageIcon } from "../icons/ImageIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WalletDetailsModalScreen } from "./types.js";

/**
 * @internal
 */
export function ViewFunds(props: {
  supportedTokens?: SupportedTokens;
  supportedNFTs?: SupportedNFTs;
  onBack: () => void;
  setScreen: (screen: WalletDetailsModalScreen) => void;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const { connectLocale } = props;
  return (
    <Container
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
        px="sm"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Spacer y="md" />

        <MenuButton
          onClick={() => {
            props.setScreen("view-tokens");
          }}
          style={{
            fontSize: fontSize.sm,
          }}
        >
          <CoinsIcon size={iconSize.md} />
          <Text color="primaryText">{connectLocale.viewFunds.viewTokens}</Text>
        </MenuButton>
        <MenuButton
          onClick={() => {
            props.setScreen("view-nfts");
          }}
          style={{
            fontSize: fontSize.sm,
          }}
        >
          <ImageIcon size={iconSize.md} />
          <Text color="primaryText">{connectLocale.viewFunds.viewNFTs}</Text>
        </MenuButton>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
