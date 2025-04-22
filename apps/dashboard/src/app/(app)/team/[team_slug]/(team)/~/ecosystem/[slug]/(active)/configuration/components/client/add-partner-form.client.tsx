"use client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { Ecosystem, Partner } from "../../../../../types";
import { useAddPartner } from "../../hooks/use-add-partner";
import { PartnerForm, type PartnerFormValues } from "./partner-form.client";

export function AddPartnerForm({
  ecosystem,
  authToken,
  teamId,
}: {
  ecosystem: Ecosystem;
  authToken: string;
  teamId: string;
}) {
  const router = useDashboardRouter();
  const params = useParams();
  const teamSlug = params.team_slug as string;
  const ecosystemSlug = params.slug as string;

  const { mutateAsync: addPartner, isPending } = useAddPartner(
    {
      authToken,
      teamId,
    },
    {
      onSuccess: () => {
        toast.success("Partner added successfully", {
          description: "The partner has been added to your ecosystem.",
        });

        // Redirect to the redirect page that will take us back to the configuration page
        const redirectPath = `/team/${teamSlug}/~/ecosystem/${ecosystemSlug}`;
        router.push(redirectPath);
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
