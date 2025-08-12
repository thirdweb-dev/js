"use client";
import {
  ArrowRightIcon,
  ArrowUpFromLineIcon,
  ImageOffIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import {
  reportAssetCreationFailed,
  reportAssetCreationSuccessful,
} from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import { FilePreview } from "@/components/blocks/file-preview";
import { GatedSwitch } from "@/components/blocks/GatedSwitch";
import {
  type MultiStepState,
  MultiStepStatus,
} from "@/components/blocks/multi-step-status/multi-step-status";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { parseError } from "@/utils/errorParser";
import { ChainOverview } from "../../_common/chain-overview";
import { StepCard } from "../../_common/step-card";
import { StorageErrorPlanUpsell } from "../../_common/storage-error-upsell";
import type { CreateAssetFormValues } from "../_common/form";
import type { CreateTokenFunctions } from "../create-token-page.client";
import { TokenDistributionBarChart } from "../distribution/token-distribution";

const stepIds = {
  "airdrop-tokens": "airdrop-tokens",
  "deploy-contract": "deploy-contract",
  "mint-tokens": "mint-tokens",
  "set-claim-conditions": "set-claim-conditions",
} as const;

type StepId = keyof typeof stepIds;

export function LaunchTokenStatus(props: {
  createTokenFunctions: CreateTokenFunctions;
  values: CreateAssetFormValues;
  onPrevious: () => void;
  client: ThirdwebClient;
  onLaunchSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
}) {
  const formValues = props.values;
  const { createTokenFunctions } = props;
  const [steps, setSteps] = useState<MultiStepState<StepId>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractLink, setContractLink] = useState<string | null>(null);
  const activeWallet = useActiveWallet();
  const walletRequiresApproval = activeWallet?.id !== "inApp";

  // TODO: enable later when bundler changes are done
  const canEnableGasless = false; //props.teamPlan !== "free" && activeWallet?.id === "inApp";
  const [isGasless, setIsGasless] = useState(canEnableGasless);
  const showGaslessSection = false; // activeWallet?.id === "inApp";
  const { idToChain } = useAllChainsData();
  const chainMetadata = idToChain.get(Number(formValues.chain));

  function updateStatus(
    index: number,
    newStatus: MultiStepState<StepId>["status"],
  ) {
    setSteps((prev) => {
      return [
        ...prev.slice(0, index),
        { ...prev[index], status: newStatus },
        ...prev.slice(index + 1),
      ] as MultiStepState<StepId>[];
    });
  }

  async function handleSubmitClick() {
    const initialSteps: MultiStepState<StepId>[] = [
      {
        id: stepIds["deploy-contract"],
        label: "Deploy contract",
        status: { type: "idle" },
      },
      {
        id: stepIds["set-claim-conditions"],
        label: "Set claim conditions",
        status: { type: "idle" },
      },
      {
        id: stepIds["mint-tokens"],
        label: "Mint tokens",
        status: { type: "idle" },
      },
    ];

    if (formValues.airdropEnabled && formValues.airdropAddresses.length > 0) {
      initialSteps.push({
        id: stepIds["airdrop-tokens"],
        label: "Airdrop tokens",
        status: { type: "idle" },
      });
    }

    setSteps(initialSteps);
    setIsModalOpen(true);
    executeSteps(initialSteps, 0, isGasless);
  }

  const isComplete = steps.every((step) => step.status.type === "completed");
  const isPending = steps.some((step) => step.status.type === "pending");

  async function executeStep(stepId: StepId, gasless: boolean) {
    const params = {
      gasless,
      values: formValues,
    };

    if (stepId === "deploy-contract") {
      const result = await createTokenFunctions.deployContract(params);
      setContractLink(
        `/team/${props.teamSlug}/${props.projectSlug}/contract/${formValues.chain}/${result.contractAddress}`,
      );
    } else if (stepId === "set-claim-conditions") {
      await createTokenFunctions.setClaimConditions(params);
    } else if (stepId === "mint-tokens") {
      await createTokenFunctions.mintTokens(params);
    } else if (stepId === "airdrop-tokens") {
      await createTokenFunctions.airdropTokens(params);
    }
  }

  async function executeSteps(
    steps: MultiStepState<StepId>[],
    startIndex: number,
    gasless: boolean,
  ) {
    for (let i = startIndex; i < steps.length; i++) {
      const currentStep = steps[i];
      if (!currentStep) {
        return;
      }

      try {
        updateStatus(i, {
          type: "pending",
        });

        await executeStep(currentStep.id, gasless);

        updateStatus(i, {
          type: "completed",
        });
      } catch (error) {
        const errorMessage = parseError(error);

        reportAssetCreationFailed({
          assetType: "coin",
          contractType: "DropERC20",
          error: errorMessage,
          step: currentStep.id,
        });

        updateStatus(i, {
          message: errorMessage,
          type: "error",
        });

        throw error;
      }
    }

    reportAssetCreationSuccessful({
      assetType: "coin",
      contractType: "DropERC20",
    });

    props.onLaunchSuccess();
  }

  async function handleRetry(step: MultiStepState<StepId>, gasless: boolean) {
    const startIndex = steps.findIndex((s) => s.id === step.id);
    if (startIndex === -1) {
      return;
    }

    await executeSteps(steps, startIndex, gasless);
  }

  return (
    <StepCard
      nextButton={{
        custom: (
          <TransactionButton
            client={props.client}
            disableNoFundsPopup={isGasless}
            isLoggedIn={true}
            isPending={false}
            onClick={handleSubmitClick}
            transactionCount={undefined}
            txChainID={Number(formValues.chain)}
            variant="default"
          >
            <ArrowUpFromLineIcon className="size-4" />
            Launch Coin
          </TransactionButton>
        ),
        type: "custom",
      }}
      prevButton={{
        onClick: props.onPrevious,
      }}
      title="Launch Coin"
    >
      {/* Token info */}
      <div className="flex flex-col gap-6 border-b border-dashed px-4 py-6 pb-6 md:px-6 lg:flex-row">
        <OverviewField className="shrink-0" name="Image">
          <FilePreview
            className="size-24 rounded-lg border object-cover"
            client={props.client}
            fallback={
              <div className="flex items-center justify-center bg-muted/50">
                <ImageOffIcon className="size-5 text-muted-foreground" />
              </div>
            }
            srcOrFile={formValues.image}
          />
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
              <ChainOverview chainId={formValues.chain} client={props.client} />
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

      {/* gasless */}
      {showGaslessSection && (
        <div className="px-4 py-6 pb-6 md:px-6 border-t border-dashed">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base">Sponsor Gas</h2>
              <p className="text-muted-foreground text-sm">
                Sponsor gas fees for launching your coin. <br /> This allows you
                to launch the coin without requiring any balance in your wallet
              </p>
            </div>
            <GatedSwitch
              currentPlan={props.teamPlan}
              requiredPlan="starter"
              switchProps={{
                checked: isGasless,
                onCheckedChange: setIsGasless,
              }}
              teamSlug={props.teamSlug}
            />
          </div>
        </div>
      )}

      <Dialog
        open={isModalOpen}
        // do not set onOpenChange
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 md:max-w-[480px]"
          dialogCloseClassName="hidden"
        >
          <div className="flex flex-col gap-6 p-6">
            <DialogHeader className="space-y-0.5">
              <DialogTitle className="font-semibold text-xl tracking-tight">
                Status
              </DialogTitle>
              {walletRequiresApproval && (
                <DialogDescription>
                  Each step will prompt a signature request in your wallet
                </DialogDescription>
              )}
            </DialogHeader>

            <MultiStepStatus
              onRetry={(step) => handleRetry(step, isGasless)}
              renderError={(step, errorMessage) => {
                if (
                  props.teamPlan === "free" &&
                  errorMessage.toLowerCase().includes("storage limit")
                ) {
                  return (
                    <StorageErrorPlanUpsell
                      onRetry={() => handleRetry(step, isGasless)}
                      teamSlug={props.teamSlug}
                      trackingCampaign="create-coin"
                    />
                  );
                }

                if (
                  errorMessage
                    .toLowerCase()
                    .includes("does not support eip-7702")
                ) {
                  return (
                    <div>
                      <p className="text-red-500 text-sm mb-2">
                        Gas Sponsorship is not supported on{" "}
                        {chainMetadata?.name || "selected chain"}
                      </p>

                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setIsGasless(false);
                          handleRetry(step, false);
                        }}
                      >
                        Continue without gas sponsorship
                        <ArrowRightIcon className="size-4" />
                      </Button>
                    </div>
                  );
                }

                return null;
              }}
              steps={steps}
            />
          </div>

          <div className="mt-2 flex justify-between gap-4 border-border border-t bg-card p-6">
            {isComplete && contractLink ? (
              <div>
                <Button asChild className="gap-2">
                  <Link href={contractLink}>
                    View Coin <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div />
            )}

            <Button
              disabled={isPending}
              onClick={() => {
                setIsModalOpen(false);
                // reset steps
                setSteps([]);
              }}
              variant="outline"
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
  maximumFractionDigits: 10,
  notation: "compact",
});

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

function OverviewFieldValue(props: { value: string }) {
  return <p className="text-foreground text-sm">{props.value}</p>;
}
