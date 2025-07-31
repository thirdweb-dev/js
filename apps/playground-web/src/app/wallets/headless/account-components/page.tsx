import { CircleUserIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import {
  AccountAvatarExample,
  AccountBalanceExample,
  AccountBlobbieExample,
  AccountNameExample,
} from "@/components/headless-ui/account-examples";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Account Components";
const description =
  "Headless components for rendering account information like ENS name, ENS avatar, account balance and more";

export const metadata = createMetadata({
  title,
  description,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={CircleUserIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/react/v5/components/account?utm_source=playground"
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
