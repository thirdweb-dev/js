import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import Link from "next/link";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface PlatformFeeFieldsetProps {
  form: CustomContractDeploymentForm;
  isMarketplace: boolean;
  isFeeExempt: boolean;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  form,
  isMarketplace,
  isFeeExempt,
}) => {
  return (
    <Fieldset legend="Platform fees">
      <div className="flex flex-col gap-4 md:flex-row">
        {isFeeExempt ? (
          <>
            <FormFieldSetup
              className="grow"
              label="Recipient Address"
              isRequired
              errorMessage={
                form.getFieldState(
                  "deployParams._platformFeeRecipient",
                  form.formState,
                ).error?.message
              }
              helperText={
                <>
                  For contract with primary sales, get additional fees for all
                  primary sales that happen on this contract. (This is useful if
                  you are deploying this contract for a 3rd party and want to
                  take fees for your service). <br /> If this contract is a
                  marketplace, get a percentage of all the secondary sales that
                  happen on your contract.
                </>
              }
            >
              <SolidityInput
                solidityType="address"
                {...form.register("deployParams._platformFeeRecipient")}
              />
            </FormFieldSetup>

            <FormFieldSetup
              label="Percentage"
              isRequired
              className="shrink-0 md:max-w-[150px]"
              errorMessage={
                form.getFieldState(
                  "deployParams._platformFeeBps",
                  form.formState,
                ).error?.message
              }
            >
              <BasisPointsInput
                value={Number(form.watch("deployParams._platformFeeBps"))}
                onChange={(value) =>
                  form.setValue(
                    "deployParams._platformFeeBps",
                    value.toString(),
                    {
                      shouldTouch: true,
                    },
                  )
                }
              />
            </FormFieldSetup>
          </>
        ) : isMarketplace ? (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each sale to support ongoing
            platform operations and improvements.{" "}
            <Link
              target="_blank"
              className="text-blue-500 underline"
              href={
                "https://blog.thirdweb.com/mint-fees-for-contract-deployments-update/"
              }
            >
              Read more.
            </Link>
          </p>
        ) : (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each primary sale price to
            support ongoing platform operations and improvements.{" "}
            <Link
              target="_blank"
              className="text-blue-500 underline"
              href={
                "https://blog.thirdweb.com/mint-fees-for-contract-deployments-update/"
              }
            >
              Read more.
            </Link>
          </p>
        )}
      </div>
    </Fieldset>
  );
};
