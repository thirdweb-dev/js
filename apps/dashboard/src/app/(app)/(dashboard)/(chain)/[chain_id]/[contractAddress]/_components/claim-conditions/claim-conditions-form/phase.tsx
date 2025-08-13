import { formatDate } from "date-fns";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { cn } from "@/lib/utils";
import { PricePreview } from "../price-preview";
import { ClaimConditionTypeData, useClaimConditionsFormContext } from ".";
import { ClaimerSelection } from "./Inputs/ClaimerSelection";
import { ClaimPriceInput } from "./Inputs/ClaimPriceInput";
import { CreatorInput } from "./Inputs/CreatorInput";
import { MaxClaimablePerWalletInput } from "./Inputs/MaxClaimablePerWalletInput";
import { MaxClaimableSupplyInput } from "./Inputs/MaxClaimableSupplyInput";
import { PhaseNameInput } from "./Inputs/PhaseNameInput";
import { PhaseStartTimeInput } from "./Inputs/PhaseStartTimeInput";

interface ClaimConditionsPhaseProps {
  contract: ThirdwebContract;
  onRemove: () => void;
  isPending: boolean;
}

export const ClaimConditionsPhase: React.FC<ClaimConditionsPhaseProps> = ({
  contract,
  onRemove,
  isPending,
}) => {
  const {
    form,
    field,
    isErc20,
    isAdmin,
    claimConditionType,
    isActive,
    isMultiPhase,
    phaseIndex,
    phaseSnapshots,
  } = useClaimConditionsFormContext();

  const toggleEditing = () => {
    form.setValue(`phases.${phaseIndex}.isEditing`, !field.isEditing);
  };

  const snapshot = phaseSnapshots[phaseIndex];

  return (
    <DynamicHeight transition="height 0.3s ease">
      <div className="border border-border rounded-lg bg-card relative">
        <div className="p-4 lg:p-6">
          <div className="mb-4">
            {isActive && (
              <div className="lg:absolute lg:right-6 lg:top-6 mb-4 border-b pb-4 border-dashed lg:border-none lg:pb-0">
                <Badge
                  variant="secondary"
                  className="h-auto py-1.5 border border-border bg-background gap-1.5"
                >
                  <div className="size-2 bg-primary rounded-full" />
                  Currently Active
                </Badge>
              </div>
            )}

            <h3 className="font-semibold text-lg tracking-tight text-foreground mb-0.5">
              {ClaimConditionTypeData[claimConditionType].name}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xl">
              {ClaimConditionTypeData[claimConditionType].description}
            </p>
          </div>

          {!field.isEditing && (
            <div className="flex flex-col gap-4 md:flex-row md:gap-12 text-sm">
              {/* Phase start */}
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">Phase start</p>
                <p className="text-muted-foreground">
                  {field.startTime
                    ? formatDate(field.startTime, "MMM d, yyyy hh:mm a")
                    : "N/A"}
                </p>
              </div>

              {/* Tokens to drop */}
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">
                  {isErc20 ? "Tokens" : "NFTs"} to drop
                </p>
                <p className="text-muted-foreground capitalize">
                  {field.maxClaimableSupply}
                </p>
              </div>

              {/* Price */}
              <PricePreview
                contractChainId={contract.chain.id}
                currencyAddress={field.currencyAddress}
                price={field.price}
              />

              {/* Limit per wallet */}
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">Limit per wallet</p>
                {claimConditionType === "specific" ? (
                  <p className="text-muted-foreground"> Set in the snapshot</p>
                ) : claimConditionType === "creator" ? (
                  <p className="text-muted-foreground">Unlimited</p>
                ) : (
                  <p className="text-muted-foreground capitalize">
                    {field.maxClaimablePerWallet}
                  </p>
                )}
              </div>
            </div>
          )}

          {field.isEditing && (
            <div className="space-y-6">
              {/* Phase Name Input / Form Title */}
              {isMultiPhase ? <PhaseNameInput /> : null}
              <PhaseStartTimeInput />

              <CreatorInput
                creatorAddress={(snapshot?.[0] as { address: string })?.address}
              />

              <MaxClaimableSupplyInput />
              <ClaimPriceInput contractChainId={contract.chain.id} />

              {claimConditionType === "specific" ||
              claimConditionType === "creator" ? null : (
                <MaxClaimablePerWalletInput />
              )}

              <ClaimerSelection />
            </div>
          )}
        </div>

        <div className="flex flex-row items-start justify-end gap-3 border-t border-dashed p-4 lg:px-6 py-5">
          <Button
            className="gap-2 rounded-full"
            onClick={toggleEditing}
            size="sm"
            variant="outline"
          >
            <ChevronDownIcon
              className={cn(
                "size-3.5 transition-transform text-muted-foreground",
                field.isEditing && "rotate-180",
              )}
            />
            {field.isEditing ? "Collapse" : isAdmin ? "Edit" : "Expand"}
          </Button>

          {isAdmin && (
            <Button
              className="gap-2 rounded-full"
              disabled={isPending}
              onClick={onRemove}
              size="sm"
              variant="outline"
            >
              <XIcon className="size-3.5 text-muted-foreground" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </DynamicHeight>
  );
};
