import CreateAccessToken from "./create-access-token";

export function KeyManagement({
  maskedAdminKey,
  projectId,
  teamId,
}: { maskedAdminKey?: string; projectId: string; teamId: string }) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card p-6">
      <div className="flex flex-row items-center gap-4">
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
        {/* TODO <Button variant={"outline"}>Rotate Admin Key</Button> */}
        <CreateAccessToken projectId={projectId} teamId={teamId} />
      </div>
      <div className="flex flex-row gap-4">
        <h3 className="font-medium text-sm">Admin Key</h3>
        <p className="text-muted-foreground text-sm">{maskedAdminKey}</p>
      </div>
    </div>
  );
}
