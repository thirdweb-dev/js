"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, ArrowUpFromLineIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { defineChain, type ThirdwebClient } from "thirdweb";
import { deployMarketplaceContract } from "thirdweb/deploys";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import * as z from "zod";
import {
  reportMarketCreationFailed,
  reportMarketCreationSuccessful,
} from "@/analytics/report";
import type { Team } from "@/api/team";
import { ClientOnly } from "@/components/blocks/client-only";
import { FileInput } from "@/components/blocks/FileInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { GatedSwitch } from "@/components/blocks/GatedSwitch";
import {
  type MultiStepState,
  MultiStepStatus,
} from "@/components/blocks/multi-step-status/multi-step-status";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_FEE_BPS_NEW,
  DEFAULT_FEE_RECIPIENT,
} from "@/constants/addresses";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useAddContractToProject } from "@/hooks/project-contracts";
import { parseError } from "@/utils/errorParser";
import { StorageErrorPlanUpsell } from "../../create/_common/storage-error-upsell";

type StepId = "deploy-contract";

const marketplaceInfoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  chain: z.string().min(1, "Chain is required"),
  image: z.instanceof(File).optional(),
});

type MarketplaceInfoFormValues = z.infer<typeof marketplaceInfoFormSchema>;

function CreateMarketplacePageUI(props: {
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  teamPlan: Team["billingPlan"];
  deployContract: (params: {
    values: MarketplaceInfoFormValues;
    gasless: boolean;
  }) => Promise<string>;
}) {
  const activeWalletChain = useActiveWalletChain();
  const [steps, setSteps] = useState<MultiStepState<StepId>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractLink, setContractLink] = useState<string | null>(null);

  // TODO: enable later when bundler changes are done
  const canEnableGasless = false; //props.teamPlan !== "free" && activeWallet?.id === "inApp";
  const [isGasless, setIsGasless] = useState(canEnableGasless);
  const showGaslessSection = false; // activeWallet?.id === "inApp";

  const form = useForm<MarketplaceInfoFormValues>({
    resolver: zodResolver(marketplaceInfoFormSchema),
    defaultValues: {
      chain: activeWalletChain?.id.toString() || "1",
      description: "",
      image: undefined,
      name: "",
    },
  });

  async function handleSubmit() {
    const initialSteps: MultiStepState<StepId>[] = [
      {
        id: "deploy-contract",
        label: "Deploy contract",
        status: { type: "idle" },
      },
    ];

    setSteps(initialSteps);
    setIsModalOpen(true);
    executeStep(isGasless);
  }

  const isComplete = steps.every((step) => step.status.type === "completed");
  const isPending = steps.some((step) => step.status.type === "pending");

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

  async function executeStep(gasless: boolean) {
    const index = 0;
    try {
      updateStatus(0, {
        type: "pending",
      });

      const contractAddress = await props.deployContract({
        gasless,
        values: form.getValues(),
      });
      setContractLink(
        `/team/${props.teamSlug}/${props.projectSlug}/contract/${form.getValues().chain}/${contractAddress}`,
      );

      reportMarketCreationSuccessful();

      updateStatus(index, {
        type: "completed",
      });
    } catch (error) {
      const errorMessage = parseError(error);

      reportMarketCreationFailed({
        error: errorMessage,
      });

      updateStatus(index, {
        message: errorMessage,
        type: "error",
      });

      throw error;
    }
  }

  const nameId = useId();
  const descriptionId = useId();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="rounded-lg border bg-card">
            {/* info */}
            <div className="flex flex-col gap-6 px-4 py-6 md:grid md:grid-cols-[280px_1fr] md:px-6">
              {/* left - image */}
              <FormFieldSetup
                errorMessage={form.formState.errors.image?.message as string}
                isRequired={false}
                label="Image"
              >
                <FileInput
                  accept={{ "image/*": [] }}
                  className="rounded-lg border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
                  client={props.client}
                  setValue={(file) =>
                    form.setValue("image", file, {
                      shouldTouch: true,
                    })
                  }
                  value={form.watch("image")}
                />
              </FormFieldSetup>

              {/* right */}
              <div className="flex flex-col gap-6">
                {/* name  */}
                <FormFieldSetup
                  errorMessage={form.formState.errors.name?.message}
                  htmlFor={nameId}
                  isRequired
                  label="Name"
                >
                  <Input
                    id={nameId}
                    placeholder="My Marketplace"
                    {...form.register("name")}
                  />
                </FormFieldSetup>

                {/* chain */}
                <FormFieldSetup
                  errorMessage={form.formState.errors.chain?.message}
                  htmlFor="chain"
                  isRequired
                  label="Chain"
                >
                  <ClientOnly ssr={null}>
                    <SingleNetworkSelector
                      chainId={Number(form.watch("chain"))}
                      disableDeprecated
                      className="bg-background"
                      client={props.client}
                      disableChainId
                      onChange={(chain) => {
                        form.setValue("chain", chain.toString());
                      }}
                    />
                  </ClientOnly>
                </FormFieldSetup>

                <FormFieldSetup
                  className="flex grow flex-col"
                  errorMessage={form.formState.errors.description?.message}
                  htmlFor={descriptionId}
                  isRequired={false}
                  label="Description"
                >
                  <Textarea
                    className="grow"
                    id={descriptionId}
                    placeholder="Describe your marketplace"
                    {...form.register("description")}
                  />
                </FormFieldSetup>
              </div>
            </div>

            {/* gasless */}
            {showGaslessSection && (
              <div className="px-4 py-6 pb-6 md:px-6 border-t border-dashed">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-base">Sponsor Gas</h2>
                    <p className="text-muted-foreground text-sm">
                      Sponsor gas fees for launching your marketplace. <br />{" "}
                      This allows you to launch the marketplace without
                      requiring any balance in your wallet
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

            {/* footer */}
            <div className="flex justify-end gap-3 border-t border-dashed p-6">
              <TransactionButton
                client={props.client}
                disableNoFundsPopup={isGasless}
                isLoggedIn={true}
                isPending={false}
                type="submit"
                transactionCount={undefined}
                txChainID={Number(form.watch("chain"))}
                variant="default"
              >
                <ArrowUpFromLineIcon className="size-4" />
                Create Marketplace
              </TransactionButton>
            </div>
          </div>
        </form>
      </Form>

      <StatusDialog
        open={isModalOpen}
        handleRetry={(gasless) => {
          executeStep(gasless);
        }}
        teamPlan={props.teamPlan}
        teamSlug={props.teamSlug}
        chain={form.watch("chain")}
        setIsGasless={setIsGasless}
        isComplete={isComplete}
        contractLink={contractLink}
        steps={steps}
        isPending={isPending}
        setIsModalOpen={setIsModalOpen}
        setSteps={setSteps}
        isGasless={isGasless}
      />
    </>
  );
}

function StatusDialog(props: {
  open: boolean;
  handleRetry: (isGasless: boolean) => void;
  teamPlan: Team["billingPlan"];
  teamSlug: string;
  chain: string;
  setIsGasless: (isGasless: boolean) => void;
  isComplete: boolean;
  contractLink: string | null;
  steps: MultiStepState<StepId>[];
  isPending: boolean;
  setIsModalOpen: (open: boolean) => void;
  setSteps: (steps: MultiStepState<StepId>[]) => void;
  isGasless: boolean;
}) {
  const activeWallet = useActiveWallet();
  const walletRequiresApproval = activeWallet?.id !== "inApp";

  const { idToChain } = useAllChainsData();
  const chainMetadata = idToChain.get(Number(props.chain));

  return (
    <Dialog open={props.open}>
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
                You will be prompted to sign a transaction in your wallet
              </DialogDescription>
            )}
          </DialogHeader>

          <MultiStepStatus
            onRetry={() => {
              props.handleRetry(props.isGasless);
            }}
            renderError={(_step, errorMessage) => {
              if (
                props.teamPlan === "free" &&
                errorMessage.toLowerCase().includes("storage limit")
              ) {
                return (
                  <StorageErrorPlanUpsell
                    onRetry={() => {
                      props.handleRetry(props.isGasless);
                    }}
                    teamSlug={props.teamSlug}
                    trackingCampaign="create-marketplace"
                  />
                );
              }

              if (
                errorMessage.toLowerCase().includes("does not support eip-7702")
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
                        props.setIsGasless(false);
                        props.handleRetry(false);
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
            steps={props.steps}
          />
        </div>

        <div className="mt-2 flex justify-between gap-4 border-border border-t bg-card p-6">
          {props.isComplete && props.contractLink ? (
            <div>
              <Button asChild className="gap-2">
                <Link href={props.contractLink}>
                  View Marketplace <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div />
          )}

          <Button
            disabled={props.isPending}
            onClick={() => {
              props.setIsModalOpen(false);
              // reset steps
              props.setSteps([]);
            }}
            variant="outline"
          >
            {props.isComplete ? "Close" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateMarketplacePage(props: {
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
  projectId: string;
  teamId: string;
}) {
  const account = useActiveAccount();
  const addContractToProject = useAddContractToProject();

  async function handleDeployContract(params: {
    values: MarketplaceInfoFormValues;
    gasless: boolean;
  }) {
    if (!account) {
      throw new Error("Wallet is not connected");
    }

    const contractAddress = await deployMarketplaceContract({
      account,
      // eslint-disable-next-line no-restricted-syntax
      chain: defineChain(Number(params.values.chain)),
      client: props.client,
      params: {
        name: params.values.name,
        description: params.values.description,
        image: params.values.image,
        // thirdweb platform fee
        platformFeeBps: DEFAULT_FEE_BPS_NEW,
        platformFeeRecipient: DEFAULT_FEE_RECIPIENT,
      },
    });

    // add contract to project in background
    addContractToProject.mutateAsync({
      chainId: params.values.chain,
      contractAddress: contractAddress,
      contractType: "MarketplaceV3",
      deploymentType: "marketplace",
      projectId: props.projectId,
      teamId: props.teamId,
    });

    return contractAddress;
  }

  return (
    <CreateMarketplacePageUI
      teamSlug={props.teamSlug}
      projectSlug={props.projectSlug}
      client={props.client}
      deployContract={handleDeployContract}
      teamPlan={props.teamPlan}
    />
  );
}
