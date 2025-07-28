import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { CurrencySelector } from "@/components/blocks/CurrencySelector";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { cn } from "@/lib/utils";
import { PriceInput } from "../../price-input";
import { useClaimConditionsFormContext } from "..";

/**
 * Allows the user to select how much they want to charge to claim each NFT
 */
export const ClaimPriceInput = (props: { contractChainId: number }) => {
  const { formDisabled, isErc20, form, phaseIndex, field, claimConditionType } =
    useClaimConditionsFormContext();

  if (claimConditionType === "creator") {
    return null;
  }

  return (
    <FormFieldSetup
      isRequired={false}
      errorMessage={
        form.getFieldState(`phases.${phaseIndex}.price`, form.formState).error
          ?.message
      }
      label={`How much do you want to charge to claim each ${
        isErc20 ? "token" : "NFT"
      }?`}
    >
      <div className={cn("flex flex-col md:flex-row gap-3")}>
        <PriceInput
          onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
          value={field.price?.toString() || ""}
          disabled={formDisabled}
          className="max-w-48"
        />
        <div className="grow max-w-md">
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
        </div>
      </div>
    </FormFieldSetup>
  );
};
