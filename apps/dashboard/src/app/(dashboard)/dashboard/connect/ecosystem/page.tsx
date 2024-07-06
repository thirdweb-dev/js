"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { BookMarkedIcon, ExternalLinkIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import headerImage from "./assets/header.png";
import { useEcosystemList } from "./hooks/use-ecosystem-list";

export default function Page() {
  const { isLoggedIn, isLoading: userLoading } = useLoggedInUser();
  const { isLoading, ecosystems } = useEcosystemList();
  const router = useRouter();

  // if we have at least one ecosystem, redirect to the first one
  if (ecosystems.length > 0) {
    router.replace(`/dashboard/connect/ecosystem/${ecosystems[0].slug}`);
  }

  // if is loading, show loading UI
  // Keep showing the loading UI while we redirect if we have ecosystems
  if (userLoading || isLoading || ecosystems.length > 0) {
    return (
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-6">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <main className="container flex flex-col max-w-2xl gap-8 px-4 pb-6 mx-auto">
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
        {!isLoggedIn ? (
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
