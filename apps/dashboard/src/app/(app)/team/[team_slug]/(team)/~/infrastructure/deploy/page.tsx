"use client";

/**
 * This page lets customers select a chain to deploy infrastructure on as step one of a 2 step process
 * in order to do this customers select a chain from the dropdown and then they can continue to `/team/<team_slug>/~/infrastructure/deploy/[chain_id]`
 */

import { ArrowRightIcon, BadgeQuestionMarkIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useAllChainsData } from "@/hooks/chains/allChains";

export default function DeployInfrastructurePage() {
  const client = getClientThirdwebClient();

  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { idToChain } = useAllChainsData();

  const { team_slug } = useParams<{ team_slug: string }>();

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* header */}
      <div className="flex flex-col items-center gap-4 md:flex-row border-b py-12">
        <div className="container max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Deploy Infrastructure
          </h2>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col container max-w-7xl">
        {/* card */}
        <div className="bg-card rounded-xl border">
          <div className="p-4 lg:px-6 lg:py-8">
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-2xl tracking-tight font-semibold mb-1">
                Choose your chain
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                Select the chain you'd like to deploy infrastructure on. <br />{" "}
                In the next step you'll pick which services you want to enable
                for all developers on this chain
              </p>
            </div>

            {/* Chain selector */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <SingleNetworkSelector
                align="start"
                className="bg-background rounded-lg max-w-sm"
                chainId={chainId}
                client={client}
                disableDeprecated
                disableChainId
                onChange={setChainId}
                placeholder="Select a chain"
                side="bottom"
              />
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center p-4 lg:px-6">
            {/* Alternative paths hidden inside popover */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer text-sm flex items-center gap-2">
                  <BadgeQuestionMarkIcon className="w-4 h-4" />
                  Can't find your chain?
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="!max-w-xl text-sm">
                <ol className="space-y-4 text-muted-foreground">
                  <li>
                    <span className="block font-medium text-foreground">
                      Option 1
                    </span>
                    Submit a PR to{" "}
                    <a
                      className="underline underline-offset-4"
                      href="https://github.com/ethereum-lists/chains"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      ethereum-lists/chains
                    </a>{" "}
                    to add your chain. The chain will be automatically added
                    when the PR is merged
                  </li>

                  <li>
                    <span className="block font-medium text-foreground">
                      Option 2
                    </span>
                    Share your chain details via{" "}
                    <a
                      className="underline underline-offset-4"
                      href="https://share.hsforms.com/1XDi-ieM9Rl6oIkn7ynK6Lgea58c"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      this short form.
                    </a>{" "}
                    This may take multiple days for your chain to be included.
                  </li>
                </ol>
              </PopoverContent>
            </Popover>

            {chainId === undefined ? (
              <Button className="w-fit rounded-full" disabled size="sm">
                Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button asChild className="w-fit rounded-full" size="sm">
                <Link
                  href={`/team/${team_slug}/~/infrastructure/deploy/${idToChain.get(chainId)?.slug || chainId}`}
                >
                  Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
