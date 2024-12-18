import { APIHeader } from "@/components/blocks/APIHeader";
import {
  AccountAddressBasic,
  AccountAddressFormat,
  AccountAvatarBasic,
  AccountBalanceBasic,
  AccountBalanceCustomToken,
  AccountBalanceFormat,
  AccountBalanceUSD,
  AccountBlobbieBasic,
  AccountNameBasic,
  AccountNameCustom,
  ConnectDetailsButtonClone,
} from "@/components/headless-ui/account-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase,
  title: "Account Components",
  description:
    "Streamline your Web3 development with our React headless UI components for wallet integration. These unstyled, customizable components handle complex wallet operations while giving you complete control over your dApp's design.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Account Components"
          description={
            <>
              Streamline your Web3 development with our React headless UI
              components for wallet integration. These unstyled, customizable
              components handle complex wallet operations while giving you
              complete control over your dApp&apos;s design.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/components/account"
          heroLink="/headless-ui-header.png"
        />

        <section className="space-y-8">
          <AccountAddressBasic />
        </section>
        <section className="space-y-8">
          <AccountAddressFormat />
        </section>
        <section className="space-y-8">
          <AccountNameBasic />
        </section>
        <section className="space-y-8">
          <AccountNameCustom />
        </section>
        <section className="space-y-8">
          <AccountBalanceBasic />
        </section>
        <section className="space-y-8">
          <AccountBalanceCustomToken />
        </section>
        <section className="space-y-8">
          <AccountBalanceFormat />
        </section>
        <section className="space-y-8">
          <AccountBalanceUSD />
        </section>
        <section className="space-y-8">
          <AccountAvatarBasic />
        </section>
        <section className="space-y-8">
          <AccountBlobbieBasic />
        </section>
        <section className="space-y-8">
          <ConnectDetailsButtonClone />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
