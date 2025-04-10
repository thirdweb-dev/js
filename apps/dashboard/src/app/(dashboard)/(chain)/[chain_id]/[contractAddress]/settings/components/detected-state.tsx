import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TrackedUnderlineLink } from "@/components/ui/tracked-link";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { Grid2x2XIcon } from "lucide-react";

const settingTypeMap = {
  metadata: {
    name: "Contract Metadata",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/ContractMetadata",
  },
  primarySale: {
    name: "Primary Sales",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/PrimarySale",
  },
  royalties: {
    name: "Royalties",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/Royalty",
  },
  platformFee: {
    name: "Platform Fee",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/PlatformFee",
  },
} as const;

export function SettingDetectedState({
  type,
  detectedState,
}: {
  type: keyof typeof settingTypeMap;
  detectedState: ExtensionDetectedState;
}) {
  if (detectedState === "enabled") {
    return null;
  }

  const metadata = settingTypeMap[type];

  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-card p-6">
      {detectedState === "loading" ? (
        <Spinner className="size-4" />
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full border bg-background">
            <Grid2x2XIcon className="size-4 text-red-500" />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-lg">Missing extension</h3>
            <p className="mb-0.5 text-muted-foreground text-sm">
              This contract does not implement the required extension for{" "}
              <span className="text-foreground">{metadata.name}</span>
            </p>
            <TrackedUnderlineLink
              category="contract-settings"
              label="metadata-extension"
              href={metadata.portalLink}
              target="_blank"
              className="text-muted-foreground text-sm"
            >
              Learn how to enable this extension
            </TrackedUnderlineLink>
          </div>
        </div>
      )}
    </div>
  );
}
