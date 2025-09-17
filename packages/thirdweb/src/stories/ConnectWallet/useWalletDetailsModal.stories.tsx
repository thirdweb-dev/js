import type { Meta } from "@storybook/react-vite";
import { base } from "../../chains/chain-definitions/base.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { polygon } from "../../chains/chain-definitions/polygon.js";
import { lightTheme } from "../../react/core/design-system/index.js";
import { useActiveAccount } from "../../react/core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../../react/web/ui/ConnectWallet/ConnectButton.js";
import {
  type UseWalletDetailsModalOptions,
  useWalletDetailsModal,
} from "../../react/web/ui/ConnectWallet/Details.js";
import { storyClient } from "../utils.js";

const meta: Meta = {
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Hooks/useWalletDetailsModal",
  decorators: [
    (Story) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <ConnectButton client={storyClient} autoConnect={true} />
          <Story />
        </div>
      );
    },
  ],
};
export default meta;

export function BasicUsage() {
  return <Variant client={storyClient} />;
}

export function DisableLinkingProfiles() {
  return (
    <Variant
      client={storyClient}
      manageWallet={{ allowLinkingProfiles: false }}
    />
  );
}

export function HideSwitchWallet() {
  return <Variant client={storyClient} hideSwitchWallet={true} />;
}

export function HideDisconnect() {
  return <Variant client={storyClient} hideDisconnect={true} />;
}

export function HideSendFunds() {
  return <Variant client={storyClient} hideSendFunds={true} />;
}

export function HideReceiveFunds() {
  return <Variant client={storyClient} hideReceiveFunds={true} />;
}

export function HideBuyFunds() {
  return <Variant client={storyClient} hideBuyFunds={true} />;
}

export function HideAllTopButtons() {
  return (
    <Variant
      client={storyClient}
      hideSendFunds={true}
      hideReceiveFunds={true}
      hideBuyFunds={true}
    />
  );
}

export function Chains() {
  return <Variant client={storyClient} chains={[ethereum, polygon, base]} />;
}

export function Locale() {
  return <Variant client={storyClient} locale="ja_JP" />;
}

export function ConnectedAccountAvatarUrl() {
  return (
    <Variant
      client={storyClient}
      connectedAccountAvatarUrl="https://thirdweb.com/favicon.ico"
    />
  );
}

export function ConnectedAccountName() {
  return <Variant client={storyClient} connectedAccountName="test" />;
}

export function ShowBalanceInFiat() {
  return <Variant client={storyClient} showBalanceInFiat="USD" />;
}

export function AssetTabs() {
  return <Variant client={storyClient} assetTabs={["nft", "token"]} />;
}

export function OnClose() {
  return (
    <Variant
      client={storyClient}
      onClose={() => {
        alert("onClose");
      }}
    />
  );
}

export function Footer() {
  return (
    <Variant
      client={storyClient}
      footer={(props) => (
        <div
          style={{
            outline: "1px solid red",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          custom footer
          <button onClick={props.close} type="button">
            close
          </button>
        </div>
      )}
    />
  );
}

export function ConnectOptions() {
  return (
    <Variant
      client={storyClient}
      connectOptions={{
        showAllWallets: false,
      }}
    />
  );
}

export function LightTheme() {
  return <Variant client={storyClient} theme="light" />;
}

export function CustomLightTheme() {
  return (
    <Variant
      client={storyClient}
      theme={lightTheme({
        colors: {
          modalBg: "#FFFFF0",
          tertiaryBg: "#DBE4C9",
          borderColor: "#8AA624",
          secondaryText: "#3E3F29",
          accentText: "#E43636",
        },
      })}
    />
  );
}

function Variant(params: UseWalletDetailsModalOptions) {
  const account = useActiveAccount();
  const detailsModal = useWalletDetailsModal();

  if (!account) {
    return <p> no account </p>;
  }

  return (
    <button
      type="button"
      onClick={() => {
        detailsModal.open(params);
      }}
    >
      test
    </button>
  );
}
