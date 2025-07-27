import { FileTextIcon } from "lucide-react";
import { Img } from "@/components/blocks/Img";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

export function DeployContractInfo(props: {
  name: string;
  displayName?: string;
  description?: string;
  logo?: string;
}) {
  const contractNameDisplay = props.displayName || props.name;

  const contractImageLink = resolveSchemeWithErrorHandler({
    client: serverThirdwebClient,
    uri: props.logo,
  });

  return (
    <div className="space-y-4">
      <div className="flex">
        <div className="p-2 rounded-full border bg-card">
          <Img
            alt={props.name}
            className="size-8 rounded-lg"
            fallback={
              <div className="flex items-center justify-center">
                <FileTextIcon className="size-6 text-muted-foreground" />
              </div>
            }
            src={contractImageLink || ""}
          />
        </div>
      </div>

      <div className="space-y-0.5">
        <h1 className="font-bold text-3xl tracking-tight">
          {contractNameDisplay}
        </h1>
        <p className="text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}
