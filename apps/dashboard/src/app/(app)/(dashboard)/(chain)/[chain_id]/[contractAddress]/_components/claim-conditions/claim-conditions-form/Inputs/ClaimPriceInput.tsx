import { cn } from "@/lib/utils";
import { Flex } from "@chakra-ui/react";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { useClaimConditionsFormContext } from "..";
import { PriceInput } from "../../price-input";
import { CustomFormControl } from "../common";

/**
 * Allows the user to select how much they want to charge to claim each NFT
 */
export const ClaimPriceInput = (props: {
  contractChainId: number;
}) => {
  const {
    formDisabled,
    isErc20,
    form,
    phaseIndex,
    field,
    isColumn,
    claimConditionType,
  } = useClaimConditionsFormContext();

  if (claimConditionType === "creator") {
    return null;
  }

  return (
    <CustomFormControl
      disabled={formDisabled}
      label={`How much do you want to charge to claim each ${
        isErc20 ? "token" : "NFT"
      }?`}
      error={
        form.getFieldState(`phases.${phaseIndex}.price`, form.formState).error
      }
    >
      <Flex gap={2} flexDir={{ base: "column", md: "row" }}>
        <div className="w-full min-w-[70px] md:w-1/2">
          <PriceInput
            w="full"
            value={field.price?.toString() || ""}
            onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
          />
        </div>
        <div className={cn("w-full", isColumn ? "md:w-1/2" : "md:w-full")}>
          <CurrencySelector
            contractChainId={props.contractChainId}
            isDisabled={formDisabled}
            value={field?.currencyAddress || NATIVE_TOKEN_ADDRESS}
            onChange={(e) =>
              form.setValue(
                `phases.${phaseIndex}.currencyAddress`,
                e.target.value,
              )
            }
          />
        </div>
      </Flex>
    </CustomFormControl>
  );
};
