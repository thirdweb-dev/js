import { toast } from "sonner";
import type { Ecosystem, Partner } from "../../../../../types";
import { useAddPartner } from "../../hooks/use-add-partner";
import { PartnerForm, type PartnerFormValues } from "./partner-form.client";

export function AddPartnerForm({
  ecosystem,
  onPartnerAdded,
  authToken,
}: {
  authToken: string;
  ecosystem: Ecosystem;
  onPartnerAdded: () => void;
}) {
  const { mutateAsync: addPartner, isPending } = useAddPartner(
    {
      authToken,
    },
    {
      onSuccess: () => {
        onPartnerAdded();
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to add ecosystem partner";
        toast.error(message);
      },
    },
  );

  const handleSubmit = (
    values: PartnerFormValues,
    finalAccessControl: Partner["accessControl"] | null,
  ) => {
    addPartner({
      ecosystem,
      name: values.name,
      allowlistedDomains: values.domains
        .split(/,| /)
        .filter((d) => d.length > 0),
      allowlistedBundleIds: values.bundleIds
        .split(/,| /)
        .filter((d) => d.length > 0),
      accessControl: finalAccessControl,
    });
  };

  return (
    <PartnerForm
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Add"
    />
  );
}
