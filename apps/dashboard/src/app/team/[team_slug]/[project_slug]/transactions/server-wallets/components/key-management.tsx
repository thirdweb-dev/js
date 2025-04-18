import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";
import ListAccessTokensButton from "./list-access-tokens.client";
import RotateAdminKeyButton from "./rotate-admin-key.client";

export function KeyManagement({
  maskedAdminKey,
  projectId,
  teamId,
}: { maskedAdminKey?: string; projectId: string; teamId: string }) {
  return maskedAdminKey ? (
    <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-row items-center gap-4 px-6 pt-6">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Key Management
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your admin key and access tokens.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-6 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-row items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
          <h3 className="font-medium text-sm">Vault Admin Key</h3>
          <p className="text-muted-foreground text-sm">{maskedAdminKey}</p>
        </div>
        <RotateAdminKeyButton />
      </div>
      <div className="flex flex-row justify-end gap-4 border-border border-t px-6 pt-4 pb-4">
        <ListAccessTokensButton projectId={projectId} teamId={teamId} />
      </div>
    </div>
  ) : null;
}
