import type { Metadata } from "next";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  AccountAvatarExample,
  AccountBalanceExample,
  AccountBlobbieExample,
  AccountNameExample,
} from "@/components/headless-ui/account-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description:
    "Headless components for rendering account information like ENS name, ENS avatar, account balance and more",
  metadataBase,
  title: "Account Components",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Headless components for rendering account information like ENS name,
            ENS avatar, account balance and more
          </>
        }
        docsLink="https://portal.thirdweb.com/react/v5/components/account?utm_source=playground"
        title="Account Components"
      >
        <div className="space-y-16">
          <AccountNameExample />
          <AccountBalanceExample />
          <AccountAvatarExample />
          <AccountBlobbieExample />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
