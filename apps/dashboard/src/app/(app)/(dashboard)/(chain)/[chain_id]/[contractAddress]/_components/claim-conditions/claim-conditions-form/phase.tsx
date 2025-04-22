import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { ClaimConditionTypeData, useClaimConditionsFormContext } from ".";
import { PricePreview } from "../price-preview";
import { ClaimPriceInput } from "./Inputs/ClaimPriceInput";
import { ClaimerSelection } from "./Inputs/ClaimerSelection";
import { CreatorInput } from "./Inputs/CreatorInput";
import { MaxClaimablePerWalletInput } from "./Inputs/MaxClaimablePerWalletInput";
import { MaxClaimableSupplyInput } from "./Inputs/MaxClaimableSupplyInput";
import { PhaseNameInput } from "./Inputs/PhaseNameInput";
import { PhaseStartTimeInput } from "./Inputs/PhaseStartTimeInput";
import { CustomFormGroup } from "./common";

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
  } = useClaimConditionsFormContext();

  const toggleEditing = () => {
    form.setValue(`phases.${phaseIndex}.isEditing`, !field.isEditing);
  };

  return (
    <Card className="relative flex flex-col gap-8 p-8">
      <div className="absolute top-3 right-3 flex flex-row items-start justify-between gap-1">
        <Button
          variant="ghost"
          onClick={toggleEditing}
          size="sm"
          className="gap-2"
        >
          {field.isEditing ? "Collapse" : isAdmin ? "Edit" : "See Phase"}
          {field.isEditing ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Button>
        <AdminOnly contract={contract}>
          <Button
            variant="ghost"
            onClick={onRemove}
            disabled={isPending}
            size="sm"
            className="gap-2 text-red-300"
          >
            Remove <XIcon className="size-4" />
          </Button>
        </AdminOnly>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:mt-0">
        <div className="flex flex-row items-center gap-3">
          <p className="font-bold text-lg text-muted-foreground">
            {ClaimConditionTypeData[claimConditionType].name}
          </p>
          {isActive && (
            <Badge variant="success" className="rounded-lg p-1.5">
              Currently active
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground">
          {ClaimConditionTypeData[claimConditionType].description}
        </p>
      </div>

      {!field.isEditing ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="flex flex-col">
            <p className="font-bold text-muted-foreground">Phase start</p>
            <p className="text-muted-foreground">
              {field.startTime?.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-muted-foreground">
              {isErc20 ? "Tokens" : "NFTs"} to drop
            </p>
            <p className="text-muted-foreground capitalize">
              {field.maxClaimableSupply}
            </p>
          </div>
          <PricePreview
            price={field.price}
            currencyAddress={field.currencyAddress}
            contractChainId={contract.chain.id}
          />
          <div className="flex flex-col">
            <p className="font-bold text-muted-foreground">Limit per wallet</p>
            {claimConditionType === "specific" ? (
              <p>Set in the snapshot</p>
            ) : claimConditionType === "creator" ? (
              <p>Unlimited</p>
            ) : (
              <p className="text-muted-foreground capitalize">
                {field.maxClaimablePerWallet}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <CustomFormGroup>
            {/* Phase Name Input / Form Title */}
            {isMultiPhase ? <PhaseNameInput /> : null}
            <PhaseStartTimeInput />
          </CustomFormGroup>

          <CreatorInput
            creatorAddress={
              (field.snapshot?.[0] as { address: string })?.address
            }
          />

          <CustomFormGroup>
            <MaxClaimableSupplyInput />
            <ClaimPriceInput contractChainId={contract.chain.id} />
          </CustomFormGroup>

          {claimConditionType === "specific" ||
          claimConditionType === "creator" ? null : (
            <CustomFormGroup>
              <MaxClaimablePerWalletInput />
            </CustomFormGroup>
          )}

          <ClaimerSelection />
        </>
      )}
    </Card>
  );
};
