import { getTeams } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, ChevronRightIcon } from "lucide-react";
import { HomeIcon, WalletIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NebulaIcon } from "../(chain)/components/server/icons/NebulaIcon";
import { EngineIcon } from "../../(dashboard)/(chain)/components/server/icons/EngineIcon";
import { InsightIcon } from "../../(dashboard)/(chain)/components/server/icons/InsightIcon";
import { PayIcon } from "../../(dashboard)/(chain)/components/server/icons/PayIcon";
import { CustomChatButton } from "../../../../components/CustomChat/CustomChatButton";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../api/lib/getAuthToken";
import { siwaExamplePrompts } from "./definitions";

export const metadata: Metadata = {
  title: "thirdweb Support",
  openGraph: {
    title: "thirdweb Support",
  },
};

const HELP_PRODUCTS = [
  {
    title: "Playground",
    icon: HomeIcon,
    viewAllUrl:
      "https://playground.thirdweb.com/connect/sign-in/button?tab=code",
    description: "Try out our interactive playground to get started",
  },
  {
    title: "Connect",
    icon: WalletIcon,
    viewAllUrl: "https://portal.thirdweb.com/connect",
    description: "Wallets, auth, and onchain interactions",
  },
  {
    title: "Universal Bridge",
    icon: PayIcon,
    viewAllUrl: "https://portal.thirdweb.com/pay",
    description: "Bridge and onramp tokens on any chain",
  },
  {
    title: "Engine",
    icon: EngineIcon,
    viewAllUrl: "https://portal.thirdweb.com/engine/v3",
    description: "Reliable transactions and monitoring",
  },
  {
    title: "Insight",
    icon: InsightIcon,
    viewAllUrl: "https://portal.thirdweb.com/insight",
    description: "Blockchain data queries and transformations",
  },
  {
    title: "Nebula",
    icon: NebulaIcon,
    viewAllUrl: "https://portal.thirdweb.com/nebula",
    description: "API interface for LLMs",
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
                isLoggedIn={!!accountAddress}
                networks="all"
                isFloating={false}
                pageType="support"
                label="Ask AI for support"
                examplePrompts={siwaExamplePrompts}
                authToken={authToken || undefined}
                teamId={teamId}
                clientId={undefined}
              />

              <Link
                href="/support/create-ticket"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:underline"
              >
                Open a support case
              </Link>
            </div>
          </div>
        </header>
      </div>
      <section className="container flex flex-col gap-6">
        <h2 className="font-bold text-3xl">Learning Resources</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {HELP_PRODUCTS.map((product) => (
            <Card className="relative col-span-1 bg-card" key={product.title}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  {product.icon && <product.icon className="size-5" />}
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="absolute top-4 right-2 flex flex-row gap-1 px-2 text-muted-foreground text-sm hover:text-foreground"
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
