import type { Meta } from "@storybook/react";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../react/core/design-system/CustomThemeProvider.js";
import { InAppWalletIcon } from "../react/web/ui/ConnectWallet/in-app-wallet-icon.js";
import { defaultAuthOptions } from "../react/web/wallets/shared/ConnectWalletSocialOptions.js";
import { inAppWallet } from "../wallets/in-app/web/in-app.js";
import type { AuthOption } from "../wallets/types.js";
import { storyClient } from "./utils.js";

const meta: Meta<typeof Variant> = {
  title: "Components/in-app-wallet-icon",
  decorators: [
    (Story) => {
      return (
        <CustomThemeProvider theme="dark">
          <Story />
        </CustomThemeProvider>
      );
    },
  ],
};
export default meta;

function Variants() {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        backgroundColor: theme.colors.modalBg,
        padding: "14px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div>
        <SectionTitle title="Default" />
        <Variant authOptions={defaultAuthOptions} />
      </div>

      <div>
        <SectionTitle title="Single method enabled" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Variant authOptions={["email"]} />
          <Variant authOptions={["phone"]} />
          <Variant authOptions={["passkey"]} />
          <Variant authOptions={["guest"]} />
          <Variant authOptions={["google"]} />
          <Variant authOptions={["apple"]} />
          <Variant authOptions={["facebook"]} />
          <Variant authOptions={["discord"]} />
          <Variant authOptions={["github"]} />
          <Variant authOptions={["twitch"]} />
          <Variant authOptions={["x"]} />
          <Variant authOptions={["telegram"]} />
          <Variant authOptions={["line"]} />
          <Variant authOptions={["coinbase"]} />
          <Variant authOptions={["epic"]} />
          <Variant authOptions={["farcaster"]} />
          <Variant authOptions={["tiktok"]} />
          <Variant authOptions={["steam"]} />
        </div>
      </div>

      <div>
        <SectionTitle title="Two methods enabled" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Variant authOptions={["email", "phone"]} />
          <Variant authOptions={["email", "passkey"]} />
          <Variant authOptions={["email", "guest"]} />
          <Variant authOptions={["email", "google"]} />
          <Variant authOptions={["email", "apple"]} />
          <Variant authOptions={["email", "facebook"]} />
          <Variant authOptions={["google", "discord"]} />
          <Variant authOptions={["google", "github"]} />
          <Variant authOptions={["google", "twitch"]} />
          <Variant authOptions={["google", "x"]} />
          <Variant authOptions={["google", "telegram"]} />
          <Variant authOptions={["google", "line"]} />
          <Variant authOptions={["google", "coinbase"]} />
          <Variant authOptions={["google", "epic"]} />
        </div>
      </div>

      <div>
        <SectionTitle title="Three methods enabled" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Variant authOptions={["google", "apple", "github"]} />
          <Variant authOptions={["email", "phone", "guest"]} />
          <Variant authOptions={["email", "phone", "google"]} />
          <Variant authOptions={["email", "phone", "apple"]} />
          <Variant authOptions={["email", "phone", "facebook"]} />
        </div>
      </div>

      <div>
        <SectionTitle title="Four or more methods enabled" />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Variant
            authOptions={["email", "phone", "google", "apple", "facebook"]}
          />
          <Variant authOptions={["epic", "tiktok", "github", "email"]} />
          <Variant
            authOptions={["twitch", "tiktok", "epic", "email", "phone"]}
          />
          <Variant authOptions={["email", "phone", "passkey", "guest"]} />
          <Variant
            authOptions={[
              "google",
              "apple",
              "facebook",
              "github",
              "discord",
              "twitch",
              "x",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function LightTheme() {
  return <ThemeSetup theme="light" />;
}

export function DarkTheme() {
  return <ThemeSetup theme="dark" />;
}

function ThemeSetup(props: { theme: "light" | "dark" }) {
  return (
    <CustomThemeProvider theme={props.theme}>
      <Variants />
    </CustomThemeProvider>
  );
}

function Variant(props: { authOptions: AuthOption[] }) {
  return (
    <InAppWalletIcon
      client={storyClient}
      wallet={inAppWallet({
        auth: {
          options: props.authOptions,
        },
      })}
    />
  );
}

function SectionTitle(props: { title: string }) {
  const theme = useCustomTheme();
  return (
    <p style={{ color: theme.colors.secondaryText, fontSize: "14px" }}>
      {props.title}
    </p>
  );
}
