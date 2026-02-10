"use client";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import type { Ecosystem, Partner } from "@/api/team/ecosystems";
import { useDashboardStorageUpload } from "@/hooks/useDashboardStorageUpload";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useUpdatePartner } from "../../hooks/use-update-partner";
import { PartnerForm, type PartnerFormValues } from "./partner-form.client";

export function UpdatePartnerForm({
  ecosystem,
  partner,
  authToken,
  teamId,
  client,
}: {
  ecosystem: Ecosystem;
  partner: Partner;
  authToken: string;
  teamId: string;
  client: ThirdwebClient;
}) {
  const router = useDashboardRouter();
  const params = useParams();
  const teamSlug = params.team_slug as string;
  const ecosystemSlug = params.slug as string;

  const storageUpload = useDashboardStorageUpload({ client });

  const { mutateAsync: updatePartner, isPending } = useUpdatePartner(
    {
      authToken,
      teamId,
    },
    {
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update ecosystem partner";
        toast.error(message);
      },
      onSuccess: () => {
        toast.success("Partner updated successfully", {
          description: "The partner details have been updated.",
        });

        // Redirect to the redirect page that will take us back to the configuration page
        const redirectPath = `/team/${teamSlug}/~/ecosystem/${ecosystemSlug}`;
        router.push(redirectPath);
      },
    },
  );

  const isUploading = storageUpload.isPending;

  const handleSubmit = async (
    values: PartnerFormValues,
    finalAccessControl: Partner["accessControl"] | null,
  ) => {
    let imageUrl: string | undefined;
    if (values.logo) {
      try {
        const [uri] = await storageUpload.mutateAsync([values.logo]);
        imageUrl = uri;
      } catch {
        toast.error("Failed to upload logo");
        return;
      }
    }

    updatePartner({
      accessControl: finalAccessControl,
      allowlistedBundleIds: values.bundleIds
        .split(/,| /)
        .filter((d) => d.length > 0),
      allowlistedDomains: values.domains
        .split(/,| /)
        .filter((d) => d.length > 0),
      ecosystem,
      imageUrl,
      name: values.name,
      partnerId: partner.id,
    });
  };

  return (
    <PartnerForm
      client={client}
      isSubmitting={isPending || isUploading}
      onSubmit={handleSubmit}
      partner={partner}
      submitLabel="Update"
    />
  );
}
