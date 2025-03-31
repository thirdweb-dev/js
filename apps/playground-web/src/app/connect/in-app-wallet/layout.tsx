import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page(props: { children: React.ReactNode }) {
  return (
    <main className="container px-0 pb-20">
      <APIHeader
        title="Onboard users to web3"
        description={
          <>
            Onboard anyone with flexible auth options, secure account recovery,
            and smart account integration.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview?utm_source=playground"
        heroLink="/in-app-wallet.png"
      />

      {props.children}
    </main>
  );
}
