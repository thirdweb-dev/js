import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import { useAllChainsData } from "../../../hooks/chains/allChains";
import type { NetworkConfigFormData } from "../ConfigureNetworkForm";

export const NetworkIDInput: React.FC<{
  form: UseFormReturn<NetworkConfigFormData>;
  disabled?: boolean;
}> = ({ form, disabled }) => {
  const { slugToChain } = useAllChainsData();

  return (
    <FormFieldSetup
      htmlFor="slug"
      isRequired
      label="Slug"
      tooltip={
        <span>
          Network slug is used to identify the network in the thirdweb
          dashboard.
          <p className="mt-2 mb-1 font-semibold">Example</p>
          <p className="text-muted-foreground text-sm">
            {"thirdweb.com/<slug>..."}
          </p>
        </span>
      }
      errorMessage={
        form.formState.errors.slug?.type === "taken" ? (
          <>Slug is taken by other network</>
        ) : undefined
      }
    >
      <Input
        disabled={disabled}
        autoComplete="off"
        placeholder="ethereum"
        id="slug"
        className="bg-muted/50 font-mono disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100"
        onKeyDown={(e) => {
          // only allow alphanumeric characters and dashes
          if (!/^[a-z0-9-]*$/i.test(e.key)) {
            e.preventDefault();
          }
        }}
        type="text"
        {...form.register("slug", {
          required: true,
          validate: {
            taken: (_slug) => {
              if (disabled) {
                return true;
              }

              const chainForSlug = slugToChain.get(_slug);

              if (chainForSlug && !chainForSlug.isCustom) {
                return false;
              }

              return true;
            },
          },
        })}
      />
    </FormFieldSetup>
  );
};
