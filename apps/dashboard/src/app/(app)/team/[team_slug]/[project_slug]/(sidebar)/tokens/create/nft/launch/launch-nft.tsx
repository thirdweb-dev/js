"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpFromLineIcon,
  ImageOffIcon,
  RefreshCcwIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  BuyWidget,
  TokenProvider,
  TokenSymbol,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import {
  reportAssetCreationFailed,
  reportAssetCreationSuccessful,
} from "@/analytics/report";
import type { Team } from "@/api/team/get-team";
import { FilePreview } from "@/components/blocks/file-preview";
import { GatedSwitch } from "@/components/blocks/GatedSwitch";
import type { MultiStepState } from "@/components/blocks/multi-step-status/multi-step-status";
import { MultiStepStatus } from "@/components/blocks/multi-step-status/multi-step-status";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { TransactionButton } from "@/components/tx-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { ChainOverview } from "../../_common/chain-overview";
import { StepCard } from "../../_common/step-card";
import { StorageErrorPlanUpsell } from "../../_common/storage-error-upsell";
import type {
  CreateNFTCollectionAllValues,
  CreateNFTCollectionFunctions,
} from "../_common/form";

const stepIds = {
  "deploy-contract": "deploy-contract",
  "mint-nfts": "mint-nfts",
  "set-admins": "set-admins",
  "set-claim-conditions": "set-claim-conditions",
} as const;

type StepId = keyof typeof stepIds;

export function LaunchNFT(props: {
  createNFTFunctions: CreateNFTCollectionFunctions;
  values: CreateNFTCollectionAllValues;
  onPrevious: () => void;
  client: ThirdwebClient;
  onLaunchSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  teamPlan: Team["billingPlan"];
  isLegacyPlan: boolean;
}) {
  const formValues = props.values;
  const [steps, setSteps] = useState<MultiStepState<StepId>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeWallet = useActiveWallet();
  const walletRequiresApproval = activeWallet?.id !== "inApp";
  const account = useActiveAccount();
  const contractAddressRef = useRef<string | null>(null);
  const { theme } = useTheme();
  const chainMeta = useV5DashboardChain(
    Number(formValues.collectionInfo.chain),
  );

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

  function updateDescription(index: number, description: string) {
    setSteps((prev) => {
      return [
        ...prev.slice(0, index),
        { ...prev[index], description },
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
        id: stepIds["mint-nfts"],
        label: formValues.nfts.length > 1 ? "Mint NFTs" : "Mint NFT",
        status: { type: "idle" },
      },
      {
        id: stepIds["set-claim-conditions"],
        label:
          formValues.nfts.length > 1
            ? "Set claim conditions"
            : "Set claim condition",
        status: { type: "idle" },
      },
    ];

    if (
      account &&
      formValues.collectionInfo.admins.some(
        (admin) => admin.address !== account.address,
      )
    ) {
      initialSteps.push({
        id: stepIds["set-admins"],
        label: "Set admins",
        status: { type: "idle" },
      });
    }

    setSteps(initialSteps);
    setIsModalOpen(true);
    executeSteps(initialSteps, 0);
  }

  const batchesProcessedRef = useRef(0);
  const batchSize = 50;
  const batchCount =
    formValues.nfts.length > batchSize
      ? Math.ceil(formValues.nfts.length / batchSize)
      : 1;

  const ercType: "erc721" | "erc1155" = useMemo(() => {
    // if all prices (amount + currency) are same and all supply is to 1
    const shouldDeployERC721 = formValues.nfts.every((nft) => {
      return (
        nft.supply === "1" &&
        formValues.nfts[0] &&
        nft.price_amount === formValues.nfts[0].price_amount &&
        nft.price_currency === formValues.nfts[0].price_currency
      );
    });

    return shouldDeployERC721 ? "erc721" : "erc1155";
  }, [formValues.nfts]);

  // TODO: enable later when bundler changes are done
  const canEnableGasless = false; // props.teamPlan !== "free" && activeWallet?.id === "inApp";
  const [isGasless, setIsGasless] = useState(canEnableGasless);
  const showGaslessSection = false; // activeWallet?.id === "inApp";

  const [notEnoughFunds, setNotEnoughFunds] = useState<
    | false
    | {
        values: {
          requiredAmount: string;
          balance: string;
        };
        isBuySuccess: boolean;
        showBuyWidget: boolean;
      }
  >(false);

  const contractLink = contractAddressRef.current
    ? `/team/${props.teamSlug}/${props.projectSlug}/contract/${formValues.collectionInfo.chain}/${contractAddressRef.current}`
    : null;

  async function executeStep(steps: MultiStepState<StepId>[], stepId: StepId) {
    if (stepId === "deploy-contract") {
      const result = await props.createNFTFunctions[ercType].deployContract({
        gasless: isGasless,
        values: formValues,
      });
      contractAddressRef.current = result.contractAddress;
    } else if (stepId === "set-claim-conditions") {
      if (ercType === "erc721") {
        await props.createNFTFunctions.erc721.setClaimConditions({
          gasless: isGasless,
          values: formValues,
        });
      } else {
        if (batchCount > 1) {
          const batchStartIndex = batchesProcessedRef.current;
          for (
            let batchIndex = batchStartIndex;
            batchIndex < batchCount;
            batchIndex++
          ) {
            const index = steps.findIndex(
              (s) => s.id === stepIds["set-claim-conditions"],
            );

            if (index !== -1) {
              updateDescription(
                index,
                `Processing batch ${batchIndex + 1} of ${batchCount}`,
              );
            }

            await props.createNFTFunctions.erc1155.setClaimConditions({
              batch: {
                count: batchSize,
                startIndex: batchIndex * batchSize,
              },
              gasless: isGasless,
              values: formValues,
              onNotEnoughFunds: (data) => {
                setNotEnoughFunds({
                  values: {
                    balance: data.balance,
                    requiredAmount: data.requiredAmount,
                  },
                  isBuySuccess: false,
                  showBuyWidget: false,
                });
              },
            });

            batchesProcessedRef.current += 1;
          }
        } else {
          await props.createNFTFunctions.erc1155.setClaimConditions({
            batch: {
              count: formValues.nfts.length,
              startIndex: 0,
            },
            gasless: isGasless,
            values: formValues,
            onNotEnoughFunds: (data) => {
              setNotEnoughFunds({
                values: {
                  balance: data.balance,
                  requiredAmount: data.requiredAmount,
                },
                isBuySuccess: false,
                showBuyWidget: false,
              });
            },
          });
        }
      }
    } else if (stepId === "mint-nfts") {
      await props.createNFTFunctions[ercType].lazyMintNFTs({
        gasless: isGasless,
        values: formValues,
      });
    } else if (stepId === "set-admins") {
      // this is type guard, this can never happen
      if (!contractAddressRef.current) {
        throw new Error("Contract address not set");
      }

      await props.createNFTFunctions.setAdmins({
        admins: formValues.collectionInfo.admins,
        chain: formValues.collectionInfo.chain,
        contractAddress: contractAddressRef.current,
        contractType: ercType === "erc721" ? "DropERC721" : "DropERC1155",
        gasless: isGasless,
      });
    }
  }

  async function executeSteps(
    steps: MultiStepState<StepId>[],
    startIndex: number,
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

        await executeStep(steps, currentStep.id);

        updateStatus(i, {
          type: "completed",
        });
      } catch (error) {
        console.error(error);
        const errorMessage = parseError(error);

        updateStatus(i, {
          message: errorMessage,
          type: "error",
        });

        reportAssetCreationFailed({
          assetType: "nft",
          contractType: ercType === "erc721" ? "DropERC721" : "DropERC1155",
          error: errorMessage,
          step: currentStep.id,
          is_testnet: chainMeta.testnet,
          chainId: Number(formValues.collectionInfo.chain),
        });

        throw error;
      }
    }

    reportAssetCreationSuccessful({
      assetType: "nft",
      contractType: ercType === "erc721" ? "DropERC721" : "DropERC1155",
      chainId: Number(formValues.collectionInfo.chain),
      is_testnet: chainMeta?.testnet ?? false,
    });

    props.onLaunchSuccess();
    batchesProcessedRef.current = 0;
  }

  async function handleRetry(step: MultiStepState<StepId>) {
    const startIndex = steps.findIndex((s) => s.id === step.id);
    if (startIndex === -1) {
      return;
    }

    try {
      await executeSteps(steps, startIndex);
    } catch {
      // no op
    }
  }

  const isComplete = steps.every((step) => step.status.type === "completed");

  const isPriceSame = props.values.nfts.every(
    (nft) => nft.price_amount === props.values.nfts[0]?.price_amount,
  );

  const chain = useV5DashboardChain(Number(formValues.collectionInfo.chain));

  const uniqueAttributes = useMemo(() => {
    const attributeNames = new Set<string>();
    for (const nft of props.values.nfts) {
      if (nft.attributes) {
        for (const attribute of nft.attributes) {
          if (attribute.trait_type && attribute.value) {
            attributeNames.add(attribute.trait_type);
          }
        }
      }
    }
    return Array.from(attributeNames);
  }, [props.values.nfts]);

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
            txChainID={Number(formValues.collectionInfo.chain)}
            variant="default"
          >
            <ArrowUpFromLineIcon className="size-4" />
            Launch NFT Collection
          </TransactionButton>
        ),
        type: "custom",
      }}
      prevButton={{
        onClick: props.onPrevious,
      }}
      title="Launch NFT Collection"
    >
      <Dialog
        open={isModalOpen}
        // do not set onOpenChange
      >
        <DialogContent
          className="gap-0 overflow-hidden p-0 md:max-w-[480px]"
          dialogCloseClassName="hidden"
        >
          {/** biome-ignore lint/complexity/useOptionalChain: can't change it to optional chain */}
          {notEnoughFunds && notEnoughFunds.showBuyWidget ? (
            <div className="bg-card">
              <div className="border-b py-2 px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setNotEnoughFunds({
                      ...notEnoughFunds,
                      showBuyWidget: false,
                    })
                  }
                  className="gap-2 px-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Button>
              </div>
              <BuyWidget
                client={props.client}
                chain={chain}
                amount={String(
                  Number(notEnoughFunds.values.requiredAmount) -
                    Number(notEnoughFunds.values.balance),
                )}
                buttonLabel={`Buy ${chainMeta?.nativeCurrency?.symbol || "ETH"}`}
                theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
                className="!border-none !w-full !rounded-none"
                onSuccess={() => {
                  setNotEnoughFunds({
                    ...notEnoughFunds,
                    isBuySuccess: true,
                    showBuyWidget: false,
                  });
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-6 mb-2">
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
                onRetry={handleRetry}
                renderError={(step, errorMessage) => {
                  if (
                    props.teamPlan === "free" &&
                    errorMessage.toLowerCase().includes("storage limit")
                  ) {
                    return (
                      <StorageErrorPlanUpsell
                        onRetry={() => handleRetry(step)}
                        teamSlug={props.teamSlug}
                        trackingCampaign="create-nft"
                      />
                    );
                  }

                  if (notEnoughFunds) {
                    return (
                      <div>
                        {notEnoughFunds.isBuySuccess ? (
                          <p className="text-success-text text-sm mt-1.5 mb-2">
                            Funds bought successfully
                          </p>
                        ) : (
                          <div className="mt-2 mb-2 space-y-1">
                            <p className="text-destructive-text text-sm">
                              Not enough funds
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Required Funds:{" "}
                              {notEnoughFunds.values.requiredAmount}{" "}
                              {chainMeta?.nativeCurrency?.symbol || "ETH"}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Balance: {notEnoughFunds.values.balance}{" "}
                              {chainMeta?.nativeCurrency?.symbol || "ETH"}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              handleRetry(step);
                              setNotEnoughFunds(false);
                            }}
                            size="sm"
                            variant={
                              notEnoughFunds.isBuySuccess
                                ? "default"
                                : "outline"
                            }
                            className="gap-2"
                          >
                            <RefreshCcwIcon className="size-3.5" />
                            Retry
                          </Button>

                          {!notEnoughFunds.isBuySuccess && (
                            <Button
                              onClick={() => {
                                setNotEnoughFunds({
                                  ...notEnoughFunds,
                                  showBuyWidget: true,
                                });
                              }}
                              size="sm"
                              className="gap-2"
                            >
                              <ShoppingBagIcon className="size-3.5" />
                              Buy Funds
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
                steps={steps}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 border-border border-t bg-card p-6">
            {!isComplete ? (
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  // reset steps
                  setSteps([]);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            ) : contractLink ? (
              <Button asChild className="gap-2">
                <Link href={contractLink}>
                  View NFT Collection <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Token info */}
      <div className="border-b border-dashed px-4 py-6 pb-6 md:px-6 ">
        <h2 className="mb-3 font-semibold text-base">Collection Info</h2>

        <div className="flex flex-col gap-6 lg:flex-row">
          <OverviewField className="shrink-0" name="Image">
            <FilePreview
              className="size-24 rounded-lg border object-cover"
              client={props.client}
              fallback={
                <div className="flex items-center justify-center bg-muted/50">
                  <ImageOffIcon className="size-5 text-muted-foreground" />
                </div>
              }
              srcOrFile={formValues.collectionInfo.image}
            />
          </OverviewField>

          <div className="flex grow flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:border-b lg:border-dashed lg:pb-4 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-dashed lg:[&>*:not(:first-child)]:pl-5">
              <OverviewField name="Name">
                <OverviewFieldValue value={formValues.collectionInfo.name} />
              </OverviewField>

              {formValues.collectionInfo.symbol && (
                <OverviewField name="Symbol">
                  <OverviewFieldValue
                    value={formValues.collectionInfo.symbol}
                  />
                </OverviewField>
              )}

              <OverviewField name="Chain">
                <ChainOverview
                  chainId={formValues.collectionInfo.chain}
                  client={props.client}
                />
              </OverviewField>
            </div>

            <OverviewField name="Description">
              <OverviewFieldValue
                value={
                  formValues.collectionInfo.description || "No Description"
                }
              />
            </OverviewField>

            <OverviewField
              name={
                formValues.collectionInfo.admins.length > 1 ? "Admins" : "Admin"
              }
            >
              <div className="space-y-0.5">
                {formValues.collectionInfo.admins.map((admin) => (
                  <WalletAddress
                    address={admin.address}
                    className="text-foreground text-sm h-auto py-1"
                    client={props.client}
                    iconClassName="size-3.5"
                    key={admin.address}
                  />
                ))}
              </div>
            </OverviewField>
          </div>
        </div>
      </div>

      {/* NFTs */}
      <div className="border-b border-dashed px-4 py-6 pb-6 md:px-6">
        <h2 className="font-semibold text-base">NFTs</h2>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:gap-4 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-dashed lg:[&>*:not(:first-child)]:pl-5">
          <OverviewField name="Total NFTs">
            <OverviewFieldValue value={formValues.nfts.length.toString()} />
          </OverviewField>

          {isPriceSame && formValues.nfts[0] && (
            <OverviewField name="Price">
              <p className="flex items-center gap-1 text-foreground text-sm">
                {formValues.nfts[0].price_amount}{" "}
                <TokenProvider
                  address={formValues.nfts[0].price_currency}
                  chain={chain}
                  client={props.client}
                >
                  <TokenSymbol
                    loadingComponent={<Skeleton className="size-5 w-20" />}
                  />
                </TokenProvider>
              </p>
            </OverviewField>
          )}

          {uniqueAttributes.length > 0 && (
            <OverviewField name="Attributes">
              <div className="flex flex-wrap gap-1">
                {uniqueAttributes.map((attr) => {
                  return (
                    <Badge key={attr} variant="secondary">
                      {attr}
                    </Badge>
                  );
                })}
              </div>
            </OverviewField>
          )}
        </div>
      </div>

      {/* sales and fees */}
      <div className="px-4 py-6 pb-6 md:px-6">
        <h2 className="font-semibold text-base">Sales and Fees</h2>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:gap-4 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-dashed lg:[&>*:not(:first-child)]:pl-5">
          <OverviewField name="Primary Sales Recipient">
            <WalletAddress
              address={formValues.sales.primarySaleRecipient}
              className="h-auto py-1"
              client={props.client}
              iconClassName="size-3.5"
            />
          </OverviewField>

          <OverviewField name="Royalties Recipient">
            <WalletAddress
              address={formValues.sales.royaltyRecipient}
              className="h-auto py-1"
              client={props.client}
              iconClassName="size-3.5"
            />
          </OverviewField>

          <OverviewField name="Royalties">
            <p className="flex items-center gap-1 text-foreground text-sm">
              {Number(formValues.sales.royaltyBps) / 100}%
            </p>
          </OverviewField>
        </div>
      </div>

      {/* gasless */}
      {showGaslessSection && (
        <div className="px-4 py-6 pb-6 md:px-6 border-t border-dashed">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base">Sponsor Gas</h2>
              <p className="text-muted-foreground text-sm">
                Sponsor gas fees for launching your NFT collection. <br /> This
                allows you to launch the NFT collection without requiring any
                balance in your wallet
              </p>
            </div>
            <GatedSwitch
              currentPlan={props.teamPlan}
              isLegacyPlan={props.isLegacyPlan}
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
    </StepCard>
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

function OverviewFieldValue(props: { value: string }) {
  return <p className="text-foreground text-sm">{props.value}</p>;
}
