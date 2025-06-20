import { Box, Flex } from "@chakra-ui/react";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { PriceInput } from "../../price-input";
import { useClaimConditionsFormContext } from "..";
import { CustomFormControl } from "../common";

/**
 * Allows the user to select how much they want to charge to claim each NFT
 */
export const ClaimPriceInput = (props: { contractChainId: number }) => {
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
      error={
        form.getFieldState(`phases.${phaseIndex}.price`, form.formState).error
      }
      label={`How much do you want to charge to claim each ${
        isErc20 ? "token" : "NFT"
      }?`}
    >
      <Flex flexDir={{ base: "column", md: "row" }} gap={2}>
        <Box minW="70px" w={{ base: "100%", md: "50%" }}>
          <PriceInput
            onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
            value={field.price?.toString() || ""}
            w="full"
          />
        </Box>
        <Box w={{ base: "100%", md: isColumn ? "50%" : "100%" }}>
          <CurrencySelector
            contractChainId={props.contractChainId}
            isDisabled={formDisabled}
            onChange={(e) =>
              form.setValue(
                `phases.${phaseIndex}.currencyAddress`,
                e.target.value,
              )
            }
            value={field?.currencyAddress || NATIVE_TOKEN_ADDRESS}
          />
        </Box>
      </Flex>
    </CustomFormControl>
  );
};
