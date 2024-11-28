import { APIHeader } from "@/components/blocks/APIHeader";
import {
  NftCardDemo,
  NftDescriptionBasic,
  NftMediaBasic,
  NftNameBasic,
} from "@/components/headless-ui/nft-examples";
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
          <NftMediaBasic />
        </section>
        <section className="space-y-8">
          <NftNameBasic />
        </section>
        <section className="space-y-8">
          <NftDescriptionBasic />
        </section>
        <section className="space-y-8">
          <NftCardDemo />
        </section>
      </main>
    </ThirdwebProvider>
  );
}
