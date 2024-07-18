import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { BookMarkedIcon, ExternalLinkIcon, MoveRightIcon } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import headerImage from "./assets/header.png";
import type { Ecosystem } from "./types";

async function fetchEcosystemList(authToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_THIRDWEB_API_HOST || "https://api.thirdweb.com"}/v1/ecosystem-wallet/list`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!res.ok) {
    const data = await res.json();
    console.error(data);
    throw new Error(data?.error?.message ?? "Failed to fetch ecosystems");
  }

  const data = (await res.json()) as { result: Ecosystem[] };
  return data.result;
}

export default async function Page() {
  const cookiesManager = cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authToken = activeAccount
    ? cookiesManager.get(`${COOKIE_PREFIX_TOKEN}${activeAccount}`)?.value
    : null;

  // if user is logged in and has an ecosystem, redirect to the first ecosystem
  if (authToken) {
    const ecosystems = await fetchEcosystemList(authToken).catch((err) => {
      console.error("failed to fetch ecosystems", err);
      return [];
    });
    if (ecosystems.length > 0) {
      redirect(`/dashboard/connect/ecosystem/${ecosystems[0].slug}`);
    }
  }

  // otherwise we fall through to the page

  return (
    <main className="container flex flex-col max-w-2xl gap-8 pb-6 mx-auto">
      <Image
        src={headerImage}
        alt="Ecosystems"
        sizes="100vw"
        className="w-full"
      />
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold sm:text-3xl text-foreground text-balance">
          One wallet, a whole ecosystem of apps and games
        </h2>
        <p className="text-secondary-foreground">
          With Ecosystem Wallets, your users can access their assets across
          hundreds of apps and games within your ecosystem. You can control
          which apps join your ecosystem and how their users interact with your
          wallet.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        {!authToken ? (
          <ToolTipLabel label="Connect your wallet to create an ecosystem">
            <Button variant="primary" className="opacity-50">
              Create Ecosystem
            </Button>
          </ToolTipLabel>
        ) : (
          <Link href="/dashboard/connect/ecosystem/create">
            <Button variant="primary">Create Ecosystem</Button>
          </Link>
        )}
        <Button variant="outline" asChild>
          <Link
            href="https://portal.thirdweb.com/connect/ecosystems/overview"
            target="_blank"
            className="flex flex-row gap-2"
          >
            Read The Docs
            <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="w-full h-0 my-2 border-t" />
      <Link
        href="https://portal.thirdweb.com/connect/ecosystems/overview"
        className="mb-6 group"
      >
        <Card className="flex flex-col gap-3 p-6 md:p-8 md:px-10">
          <div className="flex items-center gap-2">
            <BookMarkedIcon className="size-5 text-secondary-foreground" />
            <h4 className="text-lg font-bold">Learn more</h4>
          </div>
          <p className="text-secondary-foreground text-md">
            Learn how to create and manage Ecosystem Wallets in our docs.
          </p>
          <div className="flex flex-row items-center gap-2 mt-4 transition-all group-hover:gap-3 group-hover:text-primary/80 text-primary text-md">
            View Docs <MoveRightIcon className="size-4" />
          </div>
        </Card>
      </Link>
    </main>
  );
}
