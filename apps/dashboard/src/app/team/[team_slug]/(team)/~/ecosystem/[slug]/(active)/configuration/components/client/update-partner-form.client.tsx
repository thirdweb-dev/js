"use client";
import { toast } from "sonner";
import type { Ecosystem, Partner } from "../../../../../types";
import { useUpdatePartner } from "../../hooks/use-update-partner";
import { PartnerForm, type PartnerFormValues } from "./partner-form.client";

export function UpdatePartnerForm({
  ecosystem,
  partner,
  onSuccess,
  authToken,
}: {
  ecosystem: Ecosystem;
  partner: Partner;
  onSuccess: () => void;
  authToken: string;
}) {
  const { mutateAsync: updatePartner, isPending } = useUpdatePartner(
    {
      authToken,
    },
    {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update ecosystem partner";
        toast.error(message);
      },
    },
  );

  const handleSubmit = (
    values: PartnerFormValues,
    finalAccessControl: Partner["accessControl"] | null,
  ) => {
    updatePartner({
      ecosystem,
      partnerId: partner.id,
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
      partner={partner}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Update"
    />
  );
}
