import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import type { ThirdwebClient } from "thirdweb";

export function DeployContractInfo(props: {
  name: string;
  displayName?: string;
  description?: string;
  logo?: string;
  client: ThirdwebClient;
}) {
  const contractNameDisplay = props.displayName || props.name;

  const contractImageLink = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: props.logo,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 items-center gap-4">
        {contractImageLink && (
          <div className="hidden shrink-0 items-center justify-center rounded-xl border border-border bg-card p-2 md:flex">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img className="size-12" alt={props.name} src={contractImageLink} />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
            {contractNameDisplay}
          </h1>
          <p className="text-muted-foreground text-sm">{props.description}</p>
        </div>
      </div>
    </div>
  );
}
