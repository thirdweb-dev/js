import { useClaimConditionsFormContext } from "..";
import { PriceInput } from "../../price-input";
import { CustomFormControl } from "../common";
import { Box, Flex } from "@chakra-ui/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { CurrencySelector } from "components/shared/CurrencySelector";

/**
 * Allows the user to select how much they want to charge to claim each NFT
 */
export const ClaimPriceInput = () => {
  const {
    formDisabled,
    isErc20,
    form,
    phaseIndex,
    field,
    isColumn,
    claimConditionType,
    isClaimPhaseV1,
  } = useClaimConditionsFormContext();

  if (!isClaimPhaseV1 && claimConditionType === "creator") {
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
        <Box w={{ base: "100%", md: "50%" }} minW="70px">
          <PriceInput
            w="full"
            value={field.price?.toString() || ""}
            onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
          />
        </Box>
        <Box w={{ base: "100%", md: isColumn ? "50%" : "100%" }}>
          <CurrencySelector
            isDisabled={formDisabled}
            value={field?.currencyAddress || NATIVE_TOKEN_ADDRESS}
            onChange={(e) =>
              form.setValue(
                `phases.${phaseIndex}.currencyAddress`,
                e.target.value,
              )
            }
          />
        </Box>
      </Flex>
    </CustomFormControl>
  );
};
