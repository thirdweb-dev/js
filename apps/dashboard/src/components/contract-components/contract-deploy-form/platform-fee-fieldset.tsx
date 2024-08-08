import { FormControl } from "@chakra-ui/react";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { FormErrorMessage, FormLabel } from "tw-components";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface PlatformFeeFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  form,
}) => {
  return (
    <div>
      <h3 className="text-lg mb-1 font-semibold">Platform fees</h3>

      <p className="text-muted-foreground text-sm mb-3">
        For contract with primary sales, get additional fees for all primary
        sales that happen on this contract. (This is useful if you are deploying
        this contract for a 3rd party and want to take fees for your service).
        If this contract is a marketplace, get a percentage of all the secondary
        sales that happen on your contract.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <FormControl
          isRequired
          isInvalid={
            !!form.getFieldState(
              "deployParams._platformFeeRecipient",
              form.formState,
            ).error
          }
        >
          <FormLabel>Recipient Address</FormLabel>
          <SolidityInput
            solidityType="address"
            variant="filled"
            {...form.register("deployParams._platformFeeRecipient")}
          />
          <FormErrorMessage>
            {
              form.getFieldState(
                "deployParams._platformFeeRecipient",
                form.formState,
              ).error?.message
            }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          maxW={{ base: "100%", md: "150px" }}
          isInvalid={
            !!form.getFieldState("deployParams._platformFeeBps", form.formState)
              .error
          }
        >
          <FormLabel>Percentage</FormLabel>
          <BasisPointsInput
            variant="filled"
            value={Number(form.watch("deployParams._platformFeeBps"))}
            onChange={(value) =>
              form.setValue("deployParams._platformFeeBps", value.toString(), {
                shouldTouch: true,
              })
            }
          />
          <FormErrorMessage>
            {
              form.getFieldState("deployParams._platformFeeBps", form.formState)
                .error?.message
            }
          </FormErrorMessage>
        </FormControl>
      </div>
    </div>
  );
};
