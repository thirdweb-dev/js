import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveScheme } from "thirdweb/storage";

export function DeployContractInfo(props: {
  name: string;
  displayName?: string;
  description?: string;
  logo?: string;
}) {
  const contractNameDisplay = props.displayName || props.name;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 items-center gap-4">
        {props.logo && (
          <div className="hidden shrink-0 items-center justify-center rounded-xl border border-border p-2 md:flex">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              className="size-12"
              alt={props.name}
              src={resolveScheme({
                client: getThirdwebClient(),
                uri: props.logo,
              })}
            />
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
