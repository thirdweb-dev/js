import type { Meta } from "@storybook/react";
import { ConnectButton } from "../react/web/ui/ConnectWallet/ConnectButton.js";
import { ConnectEmbed } from "../react/web/ui/ConnectWallet/Modal/ConnectEmbed.js";
import { ecosystemWallet } from "../wallets/in-app/web/ecosystem.js";
import { inAppWallet } from "../wallets/in-app/web/in-app.js";
import { storyClient } from "./utils.js";

const meta: Meta<typeof ConnectEmbed> = {
  title: "Connect/ConnectEmbed",
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
            }}
          >
            <ConnectButton client={storyClient} />
          </div>
        </div>
      );
    },
  ],
};
export default meta;

export function BasicUsage() {
  return <ConnectEmbed client={storyClient} />;
}

export function Header() {
  return (
    <ConnectEmbed
      client={storyClient}
      header={{
        title: "Foo bar",
        titleIcon: "https://placehold.co/400x400",
      }}
    />
  );
}

export function WideModal() {
  return <ConnectEmbed client={storyClient} modalSize="wide" />;
}

export function ClassNameAndStylesAdded() {
  return (
    <ConnectEmbed
      client={storyClient}
      className="foo-bar"
      style={{
        outline: "1px solid red",
      }}
    />
  );
}

export function WideModalAndClassNameAndStylesAdded() {
  return (
    <ConnectEmbed
      client={storyClient}
      modalSize="wide"
      className="foo-bar"
      style={{
        outline: "1px solid red",
      }}
    />
  );
}

export function AllInAppWalletAuthMethods() {
  return (
    <ConnectEmbed
      client={storyClient}
      className="foo-bar"
      wallets={[
        inAppWallet({
          auth: {
            options: [
              "line",
              "google",
              "apple",
              "facebook",
              "discord",
              "x",
              "tiktok",
              "coinbase",
              "farcaster",
              "telegram",
              "github",
              "twitch",
              "steam",
              "guest",
              "backend",
              "email",
              "phone",
              "passkey",
              "wallet",
            ],
          },
        }),
      ]}
    />
  );
}

export function EcosystemWallet() {
  return (
    <ConnectEmbed
      showThirdwebBranding={false}
      client={storyClient}
      wallets={[
        ecosystemWallet("ecosystem.b3-open-gaming", {
          partnerId: "dbcd5e9b-564e-4ba0-91a0-becf0edabb61",
        }),
      ]}
      theme="light"
    />
  );
}
