"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { CheckIcon, CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { addChainOverrides } from "stores/chainStores";

export function ConfigureCustomChain(props: {
  chainSlug: string;
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
          onClick={() => window.location.reload()}
          className="w-full gap-2"
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
          prefillSlug={isSlugNumber ? undefined : chainSlug}
          prefillChainId={isSlugNumber ? chainSlug : undefined}
          onNetworkAdded={(network) => {
            if (
              chainSlug === network.slug ||
              chainSlug === `${network.chainId}`
            ) {
              addChainOverrides(network);
              setIsConfigured(true);
            }
          }}
          editChain={undefined}
        />
      </div>
    </div>
  );
}
