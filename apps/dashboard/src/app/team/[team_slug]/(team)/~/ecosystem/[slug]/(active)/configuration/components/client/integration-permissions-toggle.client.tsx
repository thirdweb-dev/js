"use client";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import type { Ecosystem } from "../../../../../types";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

export function IntegrationPermissionsToggle({
  ecosystem,
  authToken,
}: { ecosystem: Ecosystem; authToken: string }) {
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
      defaultValue={ecosystem.permission}
      value={isPending ? variables?.permission : ecosystem.permission}
      className="flex flex-col gap-2 py-2 md:flex-row md:gap-4"
    >
      <RadioGroupItemButton
        value="PARTNER_WHITELIST"
        id="PARTNER_WHITELIST"
        className={cn(
          isPending &&
            variables?.permission === "PARTNER_WHITELIST" &&
            "animate-pulse",
        )}
        onClick={() => {
          if (ecosystem.permission === "PARTNER_WHITELIST") return;
          setMessageToConfirm({
            title:
              "Are you sure you want to set an allowlist for this ecosystem?",
            description:
              "Existing apps without a partner ID will no longer be able to connect to your ecosystem. You will need to create partner IDs and distribute them to developers using your ecosystem wallet.",
            permission: "PARTNER_WHITELIST",
          });
        }}
      >
        Allowlist
      </RadioGroupItemButton>
      <RadioGroupItemButton
        value="ANYONE"
        id="ANYONE"
        className={cn(
          isPending && variables?.permission === "ANYONE" && "animate-pulse",
        )}
        onClick={() => {
          if (ecosystem.permission === "ANYONE") return;
          setMessageToConfirm({
            title: "Are you sure you want to make this ecosystem public?",
            description:
              "Anyone will be able to add your ecosystem wallet as a connection option.",
            permission: "ANYONE",
          });
        }}
      >
        Public
      </RadioGroupItemButton>
      <ConfirmationDialog
        open={!!messageToConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setMessageToConfirm(undefined);
          }
        }}
        title={messageToConfirm?.title}
        description={messageToConfirm?.description}
        onSubmit={() => {
          invariant(messageToConfirm, "Must have message for modal to be open");
          updateEcosystem({
            ...ecosystem,
            permission: messageToConfirm.permission,
          });
        }}
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
