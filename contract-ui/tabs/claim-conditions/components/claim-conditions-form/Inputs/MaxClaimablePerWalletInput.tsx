import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
import { CustomFormControl } from "../common";
import { useClaimsConditionFormContext } from "../index";
import React from "react";

/**
 * Allows the user to select how many NFTs can be claimed per wallet or transaction
 */
export const MaxClaimablePerWalletInput: React.FC = () => {
  const {
    formDisabled,
    isErc20,
    isClaimPhaseV1,
    form,
    tokenDecimals,
    field,
    dropType,
    phaseIndex,
  } = useClaimsConditionFormContext();

  return (
    <CustomFormControl
      disabled={formDisabled}
      label={`How many ${isErc20 ? "tokens" : "NFTs"} can be claimed per ${
        isClaimPhaseV1 ? "transaction" : "wallet"
      }?`}
      error={
        form.getFieldState(
          `phases.${phaseIndex}.maxClaimablePerWallet`,
          form.formState,
        ).error
      }
      helperText={
        !isClaimPhaseV1 ? (
          <>
            This value applies for <strong>all</strong> wallets, and can be
            overridden for specific wallets in the snapshot.
          </>
        ) : null
      }
    >
      <QuantityInputWithUnlimited
        isRequired
        decimals={tokenDecimals}
        isDisabled={
          (!isClaimPhaseV1 && dropType === "specific") || formDisabled
        }
        value={field?.maxClaimablePerWallet?.toString() || "0"}
        onChange={(value) =>
          form.setValue(
            `phases.${phaseIndex}.maxClaimablePerWallet`,
            value.toString(),
          )
        }
      />
    </CustomFormControl>
  );
};
