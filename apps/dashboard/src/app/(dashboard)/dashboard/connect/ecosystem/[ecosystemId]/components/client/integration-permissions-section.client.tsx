"use client";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import type { Ecosystem } from "../../../types";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

export function IntegrationPermissionsSection({
  ecosystem,
}: { ecosystem?: Ecosystem }) {
  const { updateEcosystem, variables, isLoading } = useUpdateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create ecosystem";
      toast.error(message);
    },
  });

  return (
    <section className="space-y-4 md:space-y-8">
      <div className="space-y-2">
        <h4 className="text-2xl font-semibold text-foreground">
          Integration permissions
        </h4>
        <p className="text-sm text-muted-foreground">
          {ecosystem?.permission === "PARTNER_WHITELIST"
            ? "Only preset partners can add your wallet to their app."
            : "Anyone can add your wallet to their app."}
        </p>
      </div>
      <RadioGroup
        defaultValue={ecosystem?.permission}
        value={isLoading ? variables?.permission : ecosystem?.permission}
        className={cn(
          "flex flex-col md:flex-row md:space-x-4 py-2",
          !ecosystem && "animate-pulse",
        )}
      >
        <RadioGroupItemButton
          value="PARTNER_WHITELIST"
          id="PARTNER_WHITELIST"
          disabled={!ecosystem}
          className={cn(
            isLoading &&
              variables?.permission === "PARTNER_WHITELIST" &&
              "animate-pulse",
          )}
          onClick={() => {
            invariant(ecosystem, "Ecosystem not found");
            updateEcosystem({
              id: ecosystem.id,
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
            isLoading && variables?.permission === "ANYONE" && "animate-pulse",
          )}
          disabled={!ecosystem}
          onClick={() => {
            invariant(ecosystem, "Ecosystem not found");
            updateEcosystem({ id: ecosystem.id, permission: "ANYONE" });
          }}
        >
          Public
        </RadioGroupItemButton>
      </RadioGroup>
    </section>
  );
}
