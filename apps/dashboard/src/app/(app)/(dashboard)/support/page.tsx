import {
  BookOpenIcon,
  ChevronRightIcon,
  HomeIcon,
  WalletIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getTeams } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngineIcon } from "@/icons/EngineIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { PayIcon } from "@/icons/PayIcon";
import { siwaExamplePrompts } from "./definitions";

export const metadata: Metadata = {
  openGraph: {
    title: "thirdweb Support",
  },
  title: "thirdweb Support",
};

const HELP_PRODUCTS = [
  {
    description: "Try out our interactive playground to get started",
    icon: HomeIcon,
    title: "Playground",
    viewAllUrl:
      "https://playground.thirdweb.com/connect/sign-in/button?tab=code",
  },
  {
    description: "Create and manage crypto wallets",
    icon: WalletIcon,
    title: "Wallets",
    viewAllUrl: "https://portal.thirdweb.com/connect",
  },
  {
    description: "Enable payments on any tokens on any chain",
    icon: PayIcon,
    title: "Payments",
    viewAllUrl: "https://portal.thirdweb.com/pay/troubleshoot",
  },
  {
    description: "Perform read and write transactions onchain",
    icon: EngineIcon,
    title: "Transactions",
    viewAllUrl: "https://portal.thirdweb.com/engine/v3/troubleshoot",
  },
  {
    description: "Query and analyze blockchain data",
    icon: InsightIcon,
    title: "Insight",
    viewAllUrl: "https://portal.thirdweb.com/insight",
  },
  {
    description: "API interface for LLMs",
    icon: NebulaIcon,
    title: "Nebula",
    viewAllUrl: "https://portal.thirdweb.com/nebula",
  },
] as const;

export default async function SupportPage() {
  const [authToken, accountAddress] = await Promise.all([
    getAuthToken(),
    getAuthTokenWalletAddress(),
  ]);

  const teams = await getTeams();
  const teamId = teams?.[0]?.id ?? undefined;

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
              <CustomChatButton
                authToken={authToken || undefined}
                clientId={undefined}
                examplePrompts={siwaExamplePrompts}
                isFloating={false}
                isLoggedIn={!!accountAddress}
                label="Ask AI for support"
                networks="all"
                pageType="support"
                teamId={teamId}
              />

              <Link
                className="text-muted-foreground text-sm hover:underline"
                href="/support/create-ticket"
                rel="noopener noreferrer"
                target="_blank"
              >
                Open a support case
              </Link>
            </div>
          </div>
        </header>
      </div>
      <section className="container flex flex-col gap-6">
        <h2 className="font-bold text-3xl">Support Articles</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {HELP_PRODUCTS.map((product) => (
            <Card className="relative col-span-1 bg-card" key={product.title}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  {product.icon && <product.icon className="size-5" />}
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                </div>
                <Button
                  asChild
                  className="absolute top-4 right-2 flex flex-row gap-1 px-2 text-muted-foreground text-sm hover:text-foreground"
                  size="sm"
                  variant="ghost"
                >
                  <Link href={product.viewAllUrl} target="_blank">
                    <span>View</span>
                    <ChevronRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent key={product.description}>
                {product.description && (
                  <p className="mb-2 text-muted-foreground text-sm">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
