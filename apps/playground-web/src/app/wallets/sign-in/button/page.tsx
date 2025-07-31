import { createMetadata } from "@/lib/metadata";
import { ConnectButtonPage } from "./connect-button-page";

const title = "Connect Button";
const description =
  "Wallet connection component to enable sign-in to any 500+ EOA (external wallets) or in-app wallets via email, phone number, passkeys, or social logins";
const ogDescription =
  "Plug-and-play wallet connect UI with support for 500+ wallets, passkey and social login, ERC-4337 upgrades, gasless flows, and Sign In with Ethereum.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "wallets",
    title,
  },
});

export default async function Page(props: {
  searchParams: Promise<{ tab: string | undefined | string[] }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <ConnectButtonPage
      title={title}
      description={description}
      tab={typeof searchParams.tab === "string" ? searchParams.tab : "modal"}
    />
  );
}
