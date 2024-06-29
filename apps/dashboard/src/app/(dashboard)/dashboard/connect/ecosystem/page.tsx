"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import headerImage from "./assets/header.png";

export default function Page() {
  return (
    <div className="flex flex-col container px-4 pb-6 gap-8">
      <Image
        src={headerImage}
        alt="Ecosystem Wallets"
        sizes="100vw"
        className="w-full"
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-foreground text-balance">
          One wallet with shared assets across an ecosystem
        </h2>
        <p className="text-secondary-foreground">
          Enabling your users to easily access ecosystem wallets across the apps
          and games they use.
        </p>
      </div>

      <div className="flex flex-row gap-4">
        <Button variant="primary" disabled>
          Create Ecosystem Wallet
        </Button>
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
      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Coming soon</AlertTitle>
        <AlertDescription>
          Ecosystem wallets are launching soon. In the meantime you can read the
          docs to learn more.
        </AlertDescription>
      </Alert>
    </div>
  );
}
