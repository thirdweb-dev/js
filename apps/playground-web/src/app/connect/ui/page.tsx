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
  title: "lorem ipsum",
  description: "lorem ipsum",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Lorem ipsum"
          description={
            <>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Accusantium reprehenderit corrupti sapiente nobis impedit, beatae
              sit unde nihil, facilis vitae sunt. Aperiam sed vero repudiandae
              nisi maiores repellat molestiae illum.
            </>
          }
          docsLink="https://portal.thirdweb.com/react/v5/connecting-wallets/ui-components"
          heroLink="/pay.png"
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
