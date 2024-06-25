import {
  type SupportedChainAndTokens,
  useBuySupportedDestinations,
} from "../../react/web/ui/ConnectWallet/screens/Buy/swap/useSwapSupportedChains.js";
import { PayEmbedContainer } from "../../react/web/ui/PayEmbed.js";
import { LoadingScreen } from "../../react/web/wallets/shared/LoadingScreen.js";
import { storyClient } from "../utils.js";

export function PayScreenTester(props: {
  theme: "dark" | "light";
  render: (data: {
    supportedDestinations: SupportedChainAndTokens;
  }) => JSX.Element;
}) {
  const supportedDestinationsQuery = useBuySupportedDestinations(storyClient);

  return (
    <PayEmbedContainer theme={props.theme}>
      {!supportedDestinationsQuery.data ? (
        <LoadingScreen />
      ) : (
        <props.render supportedDestinations={supportedDestinationsQuery.data} />
      )}
    </PayEmbedContainer>
  );
}
