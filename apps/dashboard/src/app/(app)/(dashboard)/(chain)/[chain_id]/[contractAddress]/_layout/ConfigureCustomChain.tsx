"use client";

import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { CheckIcon, CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { addChainOverrides } from "stores/chainStores";
import type { ThirdwebClient } from "thirdweb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ConfigureCustomChain(props: {
  chainSlug: string;
  client: ThirdwebClient;
}) {
  const { chainSlug } = props;
  const isSlugNumber = Number.isInteger(Number(chainSlug));
  const [isConfigured, setIsConfigured] = useState(false);

  if (isConfigured) {
    return (
      <div className="mx-auto max-w-[600px] py-10">
        <Alert variant="info">
          <CheckIcon className="size-5" />
          <AlertTitle>Network Configured Successfully</AlertTitle>
        </Alert>
        <div className="h-6" />
        <Button
          className="w-full gap-2"
          onClick={() => window.location.reload()}
        >
          <RotateCcwIcon className="size-4" />
          Reload Page to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] py-10">
      <Alert variant="warning">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>
          No Chain found with {isSlugNumber ? "chain ID" : "slug"}{" "}
          {`"${chainSlug}"`}
        </AlertTitle>
        <AlertDescription>
          Configure a chain with {isSlugNumber ? "chain ID" : "slug"}{" "}
          {`"${chainSlug}"`} to continue
        </AlertDescription>
      </Alert>
      <div className="h-6" />
      <div className="rounded-lg border border-border">
        <ConfigureNetworks
          client={props.client}
          editChain={undefined}
          onNetworkAdded={(network) => {
            if (
              chainSlug === network.slug ||
              chainSlug === `${network.chainId}`
            ) {
              addChainOverrides(network);
              setIsConfigured(true);
            }
          }}
          prefillChainId={isSlugNumber ? chainSlug : undefined}
          prefillSlug={isSlugNumber ? undefined : chainSlug}
        />
      </div>
    </div>
  );
}
