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
  const router = useRouter();
  const { isLoading, ecosystems } = useEcosystemList();

  // if we have at least one ecosystem, redirect to the first one
  if (ecosystems.length > 0) {
    router.replace(`/dashboard/connect/ecosystem/${ecosystems[0].id}`);
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
    <main className="container flex flex-col gap-8 px-4 pb-6">
      <Image
        src={headerImage}
        alt="Ecosystems"
        sizes="100vw"
        className="w-full"
      />
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-3xl font-bold sm:text-4xl text-foreground text-balance">
          One wallet with shared assets across an ecosystem
        </h2>
        <p className="text-secondary-foreground">
          Enable your users to access their wallet assets across apps and games.
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
          <Link href="/dashboard/connect/ecosystems/create">
            <Button variant="primary">Create Ecosystem</Button>
          </Link>
        )}
        <Button variant="outline" asChild>
          <Link
            href="https://poral.thirdweb.com"
            target="_blank"
            className="flex flex-row gap-2"
          >
            Read The Docs
            <ExternalLinkIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="w-full h-0 my-2 border-t" />
      <Link href="#" className="mb-6 group">
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
