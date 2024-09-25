"use client";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { type Ecosystem, authOptions } from "../../../../types";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

export function AuthOptionsForm({ ecosystem }: { ecosystem: Ecosystem }) {
  const [messageToConfirm, setMessageToConfirm] = useState<
    | {
        title: string;
        description: string;
        authOptions: typeof ecosystem.authOptions;
      }
    | undefined
  >();
  const {
    mutateAsync: updateEcosystem,
    variables,
    isPending,
  } = useUpdateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create ecosystem";
      toast.error(message);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-2">
      {authOptions.map((option) => (
        <CheckboxWithLabel
          key={option}
          className={cn(
            isPending &&
              variables?.authOptions?.includes(option) &&
              "animate-pulse",
            "hover:cursor-pointer hover:text-foreground",
          )}
        >
          <Checkbox
            checked={ecosystem.authOptions.includes(option)}
            onClick={() => {
              if (ecosystem.authOptions.includes(option)) {
                setMessageToConfirm({
                  title: `Are you sure you want to remove ${option.slice(0, 1).toUpperCase() + option.slice(1)} as an authentication option for this ecosystem?`,
                  description:
                    "Users will no longer be able to log into your ecosystem using this option. Any users that previously used this option will be unable to log in.",
                  authOptions: ecosystem.authOptions.filter(
                    (o) => o !== option,
                  ),
                });
              } else {
                setMessageToConfirm({
                  title: `Are you sure you want to add ${option.slice(0, 1).toUpperCase() + option.slice(1)} as an authentication option for this ecosystem?`,
                  description:
                    "Users will be able to log into your ecosystem using this option. If you later remove this option users that used it will no longer be able to log in.",
                  authOptions: [...ecosystem.authOptions, option],
                });
              }
            }}
          />
          {option.slice(0, 1).toUpperCase() + option.slice(1)}
        </CheckboxWithLabel>
      ))}
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
            ecosystem,
            authOptions: messageToConfirm.authOptions,
          });
        }}
      />
    </div>
  );
}

export function AuthOptionsFormSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-2 md:flex-row md:gap-4">
      {authOptions.map((option) => (
        <Skeleton key={option} className="h-14 w-full md:w-32" />
      ))}
    </div>
  );
}
