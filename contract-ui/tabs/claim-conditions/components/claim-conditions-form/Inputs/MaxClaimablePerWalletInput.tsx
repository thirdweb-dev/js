import { Link } from "tw-components";
import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";
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
    claimConditionType,
  } = useClaimConditionsFormContext();

  if (claimConditionType === "creator" || claimConditionType === "specific") {
    return null;
  }

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
        <>
          {!isClaimPhaseV1 ? (
            <>
              This value applies for <strong>all</strong> wallets
              {claimConditionType !== "public"
                ? ", and can be overridden for specific wallets in the snapshot. "
                : ". "}
            </>
          ) : null}
          Limits are set per wallets and not per user, sophisticated actors
          could get around wallet restrictions.{" "}
          <Link
            isExternal
            color="blue.500"
            href="https://portal.thirdweb.com/contracts/design/Drop#sybil-attacks"
          >
            Learn more
          </Link>
          .
        </>
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
