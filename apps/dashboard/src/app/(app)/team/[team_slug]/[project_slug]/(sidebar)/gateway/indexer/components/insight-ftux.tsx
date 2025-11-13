export function InsightFTUX(_props: { clientId: string }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-4 lg:px-6">
        <h2 className="font-semibold text-xl tracking-tight">Indexer</h2>
      </div>
      <div className="px-4 py-6 lg:p-6">
        <p className="text-muted-foreground text-sm">
          Indexed data is automatically used when using the thirdweb SDKs and
          API where appropriate.
        </p>
        <p className="text-muted-foreground text-sm">
          Once you have integrated thirdweb into your application you will start
          seeing usage patterns here.
        </p>
      </div>
      <div className="flex flex-col gap-3 border-t p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex gap-3"></div>

        <p className="flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-sm">
          <span className="!pointer-events-auto relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Waiting for integration
        </p>
      </div>
    </div>
  );
}
