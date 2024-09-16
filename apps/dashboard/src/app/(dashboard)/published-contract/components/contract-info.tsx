import { thirdwebClient } from "@/constants/client";
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
      <div className="flex gap-4 items-center flex-1">
        {props.logo && (
          <div className="rounded-xl p-2 border border-border shrink-0 items-center justify-center hidden md:flex">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              className="size-12"
              alt={props.name}
              src={resolveScheme({
                client: thirdwebClient,
                uri: props.logo,
              })}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {contractNameDisplay}
          </h1>
          <p className="text-muted-foreground text-sm">{props.description}</p>
        </div>
      </div>
    </div>
  );
}
