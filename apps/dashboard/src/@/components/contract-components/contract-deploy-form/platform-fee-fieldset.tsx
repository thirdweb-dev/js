import type { ThirdwebClient } from "thirdweb";
import { BasisPointsInput } from "@/components/blocks/BasisPointsInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface PlatformFeeFieldsetProps {
  form: CustomContractDeploymentForm;
  isMarketplace: boolean;
  disabled: boolean;
  client: ThirdwebClient;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  form,
  isMarketplace,
  disabled,
  client,
}) => {
  return (
    <Fieldset legend="Platform fees">
      <div className="flex flex-col gap-4 md:flex-row">
        {!disabled ? (
          <>
            <FormFieldSetup
              className="grow"
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
              isRequired
              label="Recipient Address"
            >
              <SolidityInput
                solidityType="address"
                {...form.register("deployParams._platformFeeRecipient")}
                client={client}
              />
            </FormFieldSetup>

            <FormFieldSetup
              className="shrink-0 md:max-w-[150px]"
              errorMessage={
                form.getFieldState(
                  "deployParams._platformFeeBps",
                  form.formState,
                ).error?.message
              }
              isRequired
              label="Percentage"
            >
              <BasisPointsInput
                onChange={(value) =>
                  form.setValue(
                    "deployParams._platformFeeBps",
                    value.toString(),
                    {
                      shouldTouch: true,
                    },
                  )
                }
                value={Number(form.watch("deployParams._platformFeeBps"))}
              />
            </FormFieldSetup>
          </>
        ) : isMarketplace ? (
          <p className="text-muted-foreground text-sm leading-relaxed">
            A 2.5% platform fee is deducted from each sale to support ongoing
            platform operations and improvements. <br />
            <UnderlineLink
              href={"https://thirdweb.com/pricing"}
              rel="noopener noreferrer"
              target="_blank"
            >
              See fee breakdown on pricing page.
            </UnderlineLink>
          </p>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            A 2.5% platform fee is deducted from each primary sale price to
            support ongoing platform operations and improvements. <br />
            <UnderlineLink
              href={"https://thirdweb.com/pricing"}
              rel="noopener noreferrer"
              target="_blank"
            >
              See fee breakdown on pricing page.
            </UnderlineLink>
          </p>
        )}
      </div>
    </Fieldset>
  );
};
