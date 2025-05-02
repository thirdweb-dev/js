import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { BookOpenIcon, ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import accountIcon from "../../../../../public/assets/support/account.svg";
import contractsIcon from "../../../../../public/assets/support/contracts.png";
import engineIcon from "../../../../../public/assets/support/engine.png";
import miscIcon from "../../../../../public/assets/support/misc.svg";
import connectIcon from "../../../../../public/assets/support/wallets.png";
import { NebulaChatButton } from "../../../nebula-app/(app)/components/FloatingChat/FloatingChat";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../api/lib/getAuthToken";

export const metadata: Metadata = {
  title: "thirdweb Support",
  openGraph: {
    title: "thirdweb Support",
  },
};
const HELP_PRODUCTS = [
  {
    title: "Connect",
    icon: connectIcon,
    viewAllUrl: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui",
    helpArticles: [
      {
        title: "Account Abstraction FAQ",
        url: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui/smart-wallet-faqs/64y68nzTQkUZw6r6FryFgK",
      },
      {
        title: "In-App Wallet FAQ",
        url: "https://support.thirdweb.com/wallets/dwWCB7ZD5sNcHEAj4rFFui/embedded-wallet-faqs/rhkKeknMUEdyDbRPnLFz1s",
      },
    ],
  },
  {
    title: "Contracts",
    icon: contractsIcon,
    viewAllUrl:
      "https://support.thirdweb.com/smart-contracts/rtHYyzspnPaHmmANmJQz1k/",
    helpArticles: [
      {
        title: "Contract Verification",
        url: "https://support.thirdweb.com/how-to/vGcHXQ7tHXuSJf7jaL2y5Q/how-to-verify-a-contract-using-thirdweb-sdk/cTwpMSQveggnMSwXGRKzXv",
      },
      {
        title: "Batch Upload Troubleshooting",
        url: "https://support.thirdweb.com/smart-contracts/rtHYyzspnPaHmmANmJQz1k/batch-upload-troubleshooting/5WMQFqfaUTU1C8NM8FtJ2X",
      },
      {
        title: "Contract Verification with Blockscout API",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/blockscout-api-contract-verification/qpa9r79QkgH31HFsvGissC",
      },
    ],
  },
  {
    title: "Engine",
    icon: engineIcon,
    viewAllUrl:
      "https://support.thirdweb.com/infrastructure/eRgkLPBdL1WJJLzAbuWrPZ",
    helpArticles: [
      {
        title: "Storage FAQ",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/storage-faqs/8nhnidc5B9K5js9pU2RBwa",
      },
      {
        title: "RPC Edge FAQ",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/rpc-edge-faqs/r3kJ3PK2UHUDJ1LWfM8a2D",
      },
      {
        title: "Add Custom RPC to your app",
        url: "https://support.thirdweb.com/how-to/vGcHXQ7tHXuSJf7jaL2y5Q/how-to-add-a-custom-rpc-url-into-your-front-end-backend-or-dashboard/gWYPf4QhPd9M2qzuMnMf7o",
      },
    ],
  },
  {
    title: "Account",
    icon: accountIcon,
    viewAllUrl: "https://portal.thirdweb.com/account",
    helpArticles: [
      {
        title: "Manage billing",
        url: "https://portal.thirdweb.com/account/billing/manage-billing",
      },
      {
        title: "Upgrade plans",
        url: "https://portal.thirdweb.com/account/billing/upgrade-plan",
      },
      {
        title: "Account Info",
        url: "https://portal.thirdweb.com/account/billing/account-info",
      },
    ],
  },
  {
    title: "Misc",
    icon: miscIcon,
    viewAllUrl: "https://support.thirdweb.com/",
    helpArticles: [
      {
        title: "Troubleshooting error messages",
        url: "https://support.thirdweb.com/troubleshooting-errors/7Y1BqKNvtLdBv5fZkRZZB3",
      },
      {
        title: "Add EVM to thirdweb chainlist",
        url: "https://support.thirdweb.com/other-faqs/tFbbEYCSbJ1GTeXoPs4QFw/how-to-add-your-evm-chain-to-thirdweb%E2%80%99s-chainlist-/3HMqrwyxXUFxQYaudDJffT",
      },
      {
        title: "API Keys",
        url: "https://portal.thirdweb.com/account/api-keys",
      },
    ],
  },
] as const;

export default async function SupportPage() {
  const [authToken, accountAddress] = await Promise.all([
    getAuthToken(),
    getAuthTokenWalletAddress(),
  ]);

  const client = getThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

  const supportPromptPrefix =
    "You are a Customer Success Agent at thirdweb, assisting customers with blockchain and Web3-related issues. Use the following details to craft a professional, empathetic response: ";
  const examplePrompts = [
    "ERC20 - Transfer Amount Exceeds Allowance",
    "Replacement transaction underpriced / Replacement fee too low",
    "Nonce too low: next nonce #, tx nonce #",
    "Nonce too high",
  ];

  return (
    <main className="flex flex-col gap-12 pb-12">
      <div className="bg-gradient-to-b from-card/0 to-card py-20">
        <header className="container flex flex-col items-center gap-8">
          <div className="rounded-full bg-gradient-to-r from-[#F213A4] to-[#5204BF] p-2">
            <div className="rounded-full bg-background p-6 shadow-md">
              <BookOpenIcon className="size-8" />
            </div>
          </div>
          <div className="flex max-w-2xl flex-col items-center gap-2">
            <h1 className="text-center font-bold text-4xl md:text-balance md:text-5xl">
              How can we help?
            </h1>
            <p className="text-center text-lg text-muted-foreground">
              Get instant answers with Nebula AI, our onchain support assistant.
              Still need help? You can also create a support case to reach our
              team.
            </p>
            <div className="mt-6 flex w-full flex-col items-center gap-3">
              <NebulaChatButton
                networks="all"
                isFloating={false}
                pageType="support"
                label="Ask Nebula AI for support"
                client={client}
                nebulaParams={{
                  messagePrefix: supportPromptPrefix,
                  chainIds: [],
                  wallet: accountAddress ?? undefined,
                }}
                examplePrompts={examplePrompts.map((prompt) => ({
                  title: prompt,
                  message: prompt,
                }))}
              />

              <Link
                href="/support/create-ticket"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground text-sm hover:underline"
              >
                Open a support case
              </Link>
            </div>
          </div>
        </header>
      </div>
      <section className="container flex flex-col gap-6">
        <h2 className="font-bold text-3xl">Knowledge base</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {HELP_PRODUCTS.map((product) => (
            <Card className="relative col-span-1 bg-card" key={product.title}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  {product.icon && (
                    <Image
                      src={product.icon}
                      alt={product.title}
                      className="size-5"
                    />
                  )}
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="absolute top-4 right-2 flex flex-row gap-1 px-2 text-muted-foreground text-sm hover:text-foreground"
                >
                  <Link href={product.viewAllUrl} target="_blank">
                    <span>View All</span>
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent>
                <ul className="flex flex-col gap-1">
                  {product.helpArticles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground text-sm hover:text-foreground"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
