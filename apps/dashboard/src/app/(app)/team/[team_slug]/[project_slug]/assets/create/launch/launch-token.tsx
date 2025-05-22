"use client";
import { Img } from "@/components/blocks/Img";
import {
  type MultiStepState,
  MultiStepStatus,
} from "@/components/blocks/multi-step-status/multi-step-status";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionButton } from "components/buttons/TransactionButton";
import { ChainIconClient } from "components/icons/ChainIcon";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { ArrowRightIcon, ImageOffIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import { StepCard } from "../create-token-card";
import type { CreateTokenFunctions } from "../create-token-page.client";
import { TokenDistributionBarChart } from "../distribution/token-distribution";
import type { CreateAssetFormValues } from "../form";
import { getLaunchTrackingData } from "../tracking";

export function LaunchTokenStatus(props: {
  createTokenFunctions: CreateTokenFunctions;
  values: CreateAssetFormValues;
  onPrevious: () => void;
  client: ThirdwebClient;
  onLaunchSuccess: () => void;
}) {
  const formValues = props.values;
  const { createTokenFunctions } = props;
  const [steps, setSteps] = useState<MultiStepState[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractLink, setContractLink] = useState<string | null>(null);
  const activeWallet = useActiveWallet();
  const walletRequiresApproval = activeWallet?.id !== "inApp";
  const trackEvent = useTrack();

  async function handleSubmitClick() {
    function launchTracking(type: "attempt" | "success" | "error") {
      trackEvent(
        getLaunchTrackingData({
          chainId: Number(formValues.chain),
          airdropEnabled: formValues.airdropEnabled,
          saleEnabled: formValues.saleEnabled,
          type,
        }),
      );
    }

    launchTracking("attempt");

    function updateStatus(index: number, newStatus: MultiStepState["status"]) {
      setSteps((prev) => {
        return [
          ...prev.slice(0, index),
          { ...prev[index], status: newStatus },
          ...prev.slice(index + 1),
        ] as MultiStepState[];
      });
    }

    function createSequenceExecutorFn(
      index: number,
      executeFn: (values: CreateAssetFormValues) => Promise<void>,
    ) {
      return async () => {
        updateStatus(index, "pending");
        try {
          await executeFn(formValues);
          updateStatus(index, "completed");
          // start next one
          const nextStep = initialSteps[index + 1];
          if (nextStep) {
            // do not use await next step
            nextStep.execute();
          } else {
            launchTracking("success");
            props.onLaunchSuccess();
          }
        } catch (error) {
          updateStatus(index, "error");
          launchTracking("error");
          console.error(error);
        }
      };
    }

    const initialSteps: MultiStepState[] = [
      {
        label: "Deploy contract",
        status: "idle",
        retryLabel: "Failed to deploy contract",
        execute: createSequenceExecutorFn(0, async (values) => {
          const result = await createTokenFunctions.deployContract(values);
          setContractLink(`/${values.chain}/${result.contractAddress}`);
        }),
      },
      {
        label: "Set claim conditions",
        status: "idle",
        retryLabel: "Failed to set claim conditions",
        execute: createSequenceExecutorFn(
          1,
          createTokenFunctions.setClaimConditions,
        ),
      },
      {
        label: "Mint tokens",
        status: "idle",
        retryLabel: "Failed to mint tokens",
        execute: createSequenceExecutorFn(2, createTokenFunctions.mintTokens),
      },
    ];

    if (formValues.airdropEnabled && formValues.airdropAddresses.length > 0) {
      initialSteps.push({
        label: "Airdrop tokens",
        status: "idle",
        retryLabel: "Failed to airdrop tokens",
        execute: createSequenceExecutorFn(
          3,
          createTokenFunctions.airdropTokens,
        ),
      });
    }

    setSteps(initialSteps);
    setIsModalOpen(true);

    // start sequence
    initialSteps[0]?.execute();
  }

  const isComplete = steps.every((step) => step.status === "completed");
  const isPending = steps.some((step) => step.status === "pending");

  return (
    <StepCard
      page="launch"
      title="Launch Token"
      prevButton={{
        onClick: props.onPrevious,
      }}
      nextButton={{
        type: "custom",
        custom: (
          <TransactionButton
            type="submit"
            variant="default"
            txChainID={Number(formValues.chain)}
            isLoggedIn={true}
            isPending={false}
            transactionCount={undefined}
            onClick={handleSubmitClick}
          >
            <RocketIcon className="size-4" />
            Launch Token
          </TransactionButton>
        ),
      }}
    >
      {/* Token info */}
      <div className="flex flex-col gap-6 border-b border-dashed px-4 py-6 pb-6 md:px-6 lg:flex-row">
        <OverviewField name="Image" className="shrink-0">
          <RenderFileImage file={formValues.image} />
        </OverviewField>

        <div className="flex grow flex-col gap-4 ">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:border-b lg:border-dashed lg:pb-4 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-dashed lg:[&>*:not(:first-child)]:pl-5">
            <OverviewField name="Name">
              <OverviewFieldValue value={formValues.name} />
            </OverviewField>

            <OverviewField name="Symbol">
              <OverviewFieldValue value={formValues.symbol} />
            </OverviewField>

            <OverviewField name="Chain">
              <ChainOverview client={props.client} chainId={formValues.chain} />
            </OverviewField>
          </div>

          <OverviewField name="Description">
            <OverviewFieldValue
              value={formValues.description || "No Description"}
            />
          </OverviewField>
        </div>
      </div>

      {/* Token distribution */}
      <div className="flex flex-col gap-4 px-4 py-6 md:px-6">
        <OverviewField name="Total Supply">
          <p className="font-medium text-foreground text-sm">
            {compactNumberFormatter.format(Number(formValues.supply))}
          </p>
        </OverviewField>

        <TokenDistributionBarChart distributionFormValues={formValues} />
      </div>

      <Dialog
        open={isModalOpen}
        // do not set onOpenChange
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 md:max-w-[480px]"
          dialogCloseClassName="hidden"
        >
          <div className="flex flex-col gap-6 p-6">
            <DialogHeader>
              <DialogTitle className="font-semibold text-xl tracking-tight">
                Status
              </DialogTitle>
              {walletRequiresApproval && (
                <DialogDescription>
                  Each step will prompt a signature request in your wallet
                </DialogDescription>
              )}
            </DialogHeader>

            <MultiStepStatus steps={steps} />
          </div>

          <div className="mt-2 flex justify-between gap-4 border-border border-t bg-card p-6">
            {isComplete && contractLink ? (
              <div>
                <Button asChild className="gap-2">
                  <Link href={contractLink}>
                    View Launched Token <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div />
            )}

            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => {
                setIsModalOpen(false);
                // reset steps
                setSteps([]);
              }}
            >
              {isComplete ? "Close" : "Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StepCard>
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 10,
});

function RenderFileImage(props: {
  file: File | undefined;
}) {
  const [objectUrl, setObjectUrl] = useState<string>("");

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (props.file) {
      const url = URL.createObjectURL(props.file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl("");
    }
  }, [props.file]);

  return (
    <Img
      src={objectUrl}
      className="size-24 rounded-lg border object-cover"
      fallback={
        <div className="flex items-center justify-center bg-muted/50">
          <ImageOffIcon className="size-5 text-muted-foreground" />
        </div>
      }
    />
  );
}

function OverviewField(props: {
  name: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={props.className}>
      <p className="mb-1 text-muted-foreground text-sm">{props.name}</p>
      {props.children}
    </div>
  );
}

function OverviewFieldValue(props: {
  value: string;
}) {
  return <p className="text-foreground text-sm">{props.value}</p>;
}

function ChainOverview(props: {
  chainId: string;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chainMetadata = idToChain.get(Number(props.chainId));

  return (
    <div className="flex items-center gap-2">
      <ChainIconClient
        className="size-3.5"
        client={props.client}
        src={chainMetadata?.icon?.url || ""}
      />
      <p className="text-foreground text-sm">
        {chainMetadata?.name || `Chain ${props.chainId}`}
      </p>
    </div>
  );
}
