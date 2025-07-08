"use client";

/**
 * This page lets customers select a chain to deploy infrastructure on as step one of a 2 step process
 * in order to do this customers select a chain from the dropdown and then they can continue to `/team/<team_slug>/~/infrastructure/deploy/[chain_id]`
 */

import { ArrowRightIcon } from "lucide-react";
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

export default function DeployInfrastructurePage() {
  const client = getClientThirdwebClient();

  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const { team_slug } = useParams<{ team_slug: string }>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Deploy Infrastructure
        </h2>
      </div>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Choose your Chain</h3>
          <p className="text-muted-foreground max-w-prose">
            Select the chain you'd like to deploy infrastructure on. In the next
            step you'll pick which services you want to enable for all
            developers on this chain.
          </p>
        </div>

        {/* Chain selector */}
        <div className="max-w-md">
          <SingleNetworkSelector
            align="start"
            chainId={chainId}
            client={client}
            disableDeprecated
            onChange={setChainId}
            placeholder="Select a chain"
            side="bottom"
          />
          {/* Alternative paths hidden inside popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="text-muted-foreground px-0 underline hover:text-foreground"
                variant="link"
              >
                Can&apos;t find your chain?
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-w-md text-sm">
              <ol className="space-y-4">
                <li>
                  <b>Option 1:</b> Submit a PR to&nbsp;
                  <a
                    className="underline underline-offset-4"
                    href="https://github.com/ethereum-lists/chains"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    ethereum-lists/chains
                  </a>{" "}
                  to add your chain.{" "}
                  <span className="text-muted-foreground text-xs">
                    (automatically added on PR merge)
                  </span>
                </li>
                <li>
                  <b>Option 2:</b> Share your chain details via&nbsp;
                  <a
                    className="underline underline-offset-4"
                    href="https://share.hsforms.com/1XDi-ieM9Rl6oIkn7ynK6Lgea58c"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    this short form
                  </a>
                  .<br />
                  <span className="text-muted-foreground text-xs">
                    (multiple days for your chain to be included)
                  </span>
                </li>
              </ol>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-auto">
          {chainId === undefined ? (
            <Button className="w-fit" disabled>
              Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button asChild className="w-fit">
              <Link
                href={`/team/${team_slug}/~/infrastructure/deploy/${chainId}`}
              >
                Continue <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
