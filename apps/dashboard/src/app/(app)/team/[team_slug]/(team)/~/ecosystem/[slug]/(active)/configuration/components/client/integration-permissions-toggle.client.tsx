"use client";
import { useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import type { Ecosystem } from "@/api/team/ecosystems";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

export function IntegrationPermissionsToggle({
  ecosystem,
  authToken,
  teamId,
}: {
  ecosystem: Ecosystem;
  authToken: string;
  teamId: string;
}) {
  const [messageToConfirm, setMessageToConfirm] = useState<
    | {
        title: string;
        description: string;
        permission: typeof ecosystem.permission;
      }
    | undefined
  >();
  const {
    mutateAsync: updateEcosystem,
    variables,
    isPending,
  } = useUpdateEcosystem(
    {
      authToken,
      teamId,
    },
    {
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Failed to create ecosystem";
        toast.error(message);
      },
    },
  );

  return (
    <RadioGroup
      className="flex flex-col gap-2 py-2 md:flex-row md:gap-4"
      defaultValue={ecosystem.permission}
      value={isPending ? variables?.permission : ecosystem.permission}
    >
      <RadioGroupItemButton
        className={cn(
          isPending &&
            variables?.permission === "PARTNER_WHITELIST" &&
            "animate-pulse",
        )}
        onClick={() => {
          if (ecosystem.permission === "PARTNER_WHITELIST") return;
          setMessageToConfirm({
            description:
              "Existing apps without a partner ID will no longer be able to connect to your ecosystem. You will need to create partner IDs and distribute them to developers using your ecosystem wallet.",
            permission: "PARTNER_WHITELIST",
            title:
              "Are you sure you want to set an allowlist for this ecosystem?",
          });
        }}
        value="PARTNER_WHITELIST"
      >
        Allowlist
      </RadioGroupItemButton>
      <RadioGroupItemButton
        className={cn(
          isPending && variables?.permission === "ANYONE" && "animate-pulse",
        )}
        onClick={() => {
          if (ecosystem.permission === "ANYONE") return;
          setMessageToConfirm({
            description:
              "Anyone will be able to add your ecosystem wallet as a connection option.",
            permission: "ANYONE",
            title: "Are you sure you want to make this ecosystem public?",
          });
        }}
        value="ANYONE"
      >
        Public
      </RadioGroupItemButton>
      <ConfirmationDialog
        description={messageToConfirm?.description}
        onOpenChange={(open) => {
          if (!open) {
            setMessageToConfirm(undefined);
          }
        }}
        onSubmit={() => {
          invariant(messageToConfirm, "Must have message for modal to be open");
          updateEcosystem({
            ...ecosystem,
            permission: messageToConfirm.permission,
          });
        }}
        open={!!messageToConfirm}
        title={messageToConfirm?.title}
        variant="destructive"
      />
    </RadioGroup>
  );
}

export function IntegrationPermissionsToggleSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-2 md:flex-row md:gap-4">
      <Skeleton className="h-14 w-full md:w-32" />
      <Skeleton className="h-14 w-full md:w-32" />
    </div>
  );
}
