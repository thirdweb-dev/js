import Link from "next/link";
import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";

/**
 * Allows the user to select how many NFTs can be claimed per wallet or transaction
 */
export const MaxClaimablePerWalletInput: React.FC = () => {
  const {
    formDisabled,
    isErc20,
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
      error={
        form.getFieldState(
          `phases.${phaseIndex}.maxClaimablePerWallet`,
          form.formState,
        ).error
      }
      helperText={
        <>
          This value applies for <strong>all</strong> wallets
          {claimConditionType !== "public"
            ? ", and can be overridden for specific wallets in the snapshot. "
            : ". "}
          Limits are set per wallets and not per user, sophisticated actors
          could get around wallet restrictions.{" "}
          <Link
            className="text-blue-500"
            href="https://portal.thirdweb.com/contracts/design/Drop#sybil-attacks"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </Link>
          .
        </>
      }
      label={`How many ${isErc20 ? "tokens" : "NFTs"} can be claimed per wallet?`}
    >
      <QuantityInputWithUnlimited
        decimals={tokenDecimals}
        isDisabled={
          dropType === "specific" || formDisabled || (isErc20 && !tokenDecimals)
        }
        isRequired
        onChange={(value) =>
          form.setValue(
            `phases.${phaseIndex}.maxClaimablePerWallet`,
            value.toString(),
          )
        }
        value={field?.maxClaimablePerWallet?.toString() || "0"}
      />
    </CustomFormControl>
  );
};
