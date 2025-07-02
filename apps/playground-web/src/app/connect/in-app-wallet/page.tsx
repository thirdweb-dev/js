import type { Metadata } from "next";
import { CodeExample } from "@/components/code/code-example";
import { CustomLoginForm } from "@/components/in-app-wallet/custom-login-form";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { InAppConnectEmbed } from "../../../components/in-app-wallet/connect-button";
import { Profiles } from "../../../components/in-app-wallet/profile-sections";
import ThirdwebProvider from "../../../components/thirdweb-provider";
import { metadataBase } from "../../../lib/constants";

export const metadata: Metadata = {
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet",
  metadataBase,
  title: "Any Auth | thirdweb in-app wallet",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Use any of the built-in auth methods or bring your own.
            <br />
            Supports custom auth endpoints to integrate with your existing user
            base.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview?utm_source=playground"
        title="Onboard users to web3 with any auth method"
      >
        <UIIntegration />
        <div className="h-14" />
        <Profiles />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function UIIntegration() {
  return (
    <div>
      <CodeExample
        code={`\
import { inAppWallet } from "thirdweb/wallets";
import { ConnectEmbed } from "thirdweb/react";

const wallets = [
  inAppWallet(
    // built-in auth methods
    // or bring your own auth endpoint
    {
      auth: {
        options: [
          "google",
          "x",
          "apple",
          "discord",
          "facebook",
          "farcaster",
          "telegram",
          "coinbase",
          "line",
          "email",
          "phone",
          "passkey",
          "guest",
        ],
      },
      // optional execution mode, defaults to "EOA"
      executionMode: {
        mode: "EIP7702", // or "EIP4337" or "EOA"
        sponsorGas: true, // sponsor gas for all transactions
      },
    },
  ),
];

function App() {
  return <ConnectEmbed client={client} wallets={wallets} />;
}`}
        header={{
          description:
            "Instant out of the box authentication with a prebuilt UI.",
          title: "Prebuilt UI",
        }}
        lang="tsx"
        preview={<InAppConnectEmbed />}
      />

      <div className="h-14" />

      <CodeExample
        code={`import { useState } from "react";
import { useConnect } from "thirdweb/react";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";

const wallet = inAppWallet();

export function CustomLoginUi() {
  const { connect, isConnecting, error } = useConnect();

  const preLogin = async (email: string) => {
    // send email verification code
    await preAuthenticate({
      client,
      strategy: "email",
      email,
    });
  };

  const loginWithEmail = async (email: string, verificationCode: string) => {
    // verify email with verificationCode and connect
    connect(async () => {
      await wallet.connect({
        client,
        strategy: "email",
        email,
        verificationCode,
      });
      return wallet;
    });
  };

  const loginWithGoogle = async () => {
    // connect with google
    connect(async () => {
      await wallet.connect({
        client,
        strategy: "google",
      });
      return wallet;
    });
  };

  return <div> .... </div>
}
`}
        header={{
          description:
            "Customize the login UI and integrate with your existing user base. No limits on customizations and auth methods.",
          title: "Custom UI",
        }}
        lang="tsx"
        preview={<CustomLoginForm />}
      />
    </div>
  );
}
