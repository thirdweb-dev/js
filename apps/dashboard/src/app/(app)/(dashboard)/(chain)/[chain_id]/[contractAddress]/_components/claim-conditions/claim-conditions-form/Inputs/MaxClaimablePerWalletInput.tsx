import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
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
    <FormFieldSetup
      isRequired={true}
      errorMessage={
        form.getFieldState(
          `phases.${phaseIndex}.maxClaimablePerWallet`,
          form.formState,
        ).error?.message
      }
      helperText={
        <>
          This value applies for <strong>all</strong> wallets
          {claimConditionType !== "public"
            ? ", and can be overridden for specific wallets in the snapshot. "
            : ". "}
          Limits are set per wallets and not per user, sophisticated actors
          could get around wallet restrictions.{" "}
          <UnderlineLink
            href="https://portal.thirdweb.com/contracts/design/Drop#sybil-attacks"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </UnderlineLink>
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
    </FormFieldSetup>
  );
};
