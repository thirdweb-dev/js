import { Box, Flex } from "@chakra-ui/react";
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
        <Box w={{ base: "100%", md: "50%" }} minW="70px">
          <PriceInput
            w="full"
            value={field.price?.toString() || ""}
            onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
          />
        </Box>
        <Box w={{ base: "100%", md: isColumn ? "50%" : "100%" }}>
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
        </Box>
      </Flex>
    </CustomFormControl>
  );
};
