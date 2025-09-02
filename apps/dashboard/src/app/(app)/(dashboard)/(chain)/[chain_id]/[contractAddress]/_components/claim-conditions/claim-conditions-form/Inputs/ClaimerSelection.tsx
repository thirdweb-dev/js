import { ArrowDownToLineIcon, UploadIcon } from "lucide-react";
import Papa from "papaparse";
import { handleDownload } from "@/components/blocks/download-file-button";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SnapshotEntry } from "../../legacy-zod-schema";
import { useClaimConditionsFormContext } from "../index";

/**
 * Allows the user to
 * - Select Who can claim NFTs in a phase
 * - See the Claimer snapshot
 */
export const ClaimerSelection = () => {
  const {
    formDisabled,
    form,
    phaseIndex,
    field,
    dropType,
    isErc20,
    setOpenSnapshotIndex: setOpenIndex,
    isAdmin,
    claimConditionType,
    phaseSnapshots,
    setPhaseSnapshot,
  } = useClaimConditionsFormContext();

  const handleClaimerChange = (value: string) => {
    const val = value as "any" | "specific" | "overrides";

    if (val === "any") {
      setPhaseSnapshot(phaseIndex, undefined);
    } else {
      if (val === "specific") {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 0);
      }
      if (val === "overrides" && field.maxClaimablePerWallet !== 1) {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 1);
      }
      setPhaseSnapshot(phaseIndex, []);
      setOpenIndex(phaseIndex);
    }
  };

  let helperText: React.ReactNode;

  const disabledSnapshotButton = isAdmin && formDisabled;
  const snapshot = phaseSnapshots[phaseIndex];

  if (dropType === "specific") {
    helperText = (
      <>
        <b>Only</b> wallets on the <b>allowlist</b> can claim.
      </>
    );
  } else if (dropType === "any") {
    helperText = (
      <>
        <b>Anyone</b> can claim based on the rules defined in this phase.
        (&quot;Public Mint&quot;)
      </>
    );
  } else {
    helperText = (
      <>
        <b>Anyone</b> can claim based on the rules defined in this phase.
        <br />
        <b>Wallets in the snapshot</b> can claim with special rules defined in
        the snapshot.
      </>
    );
  }

  if (claimConditionType === "public" || claimConditionType === "creator") {
    return null;
  }

  const label =
    claimConditionType === "overrides"
      ? "Add Override Snapshot"
      : claimConditionType === "specific"
        ? "Add Allowlist"
        : `Who can claim ${isErc20 ? "tokens" : "NFTs"} during this phase?`;

  return (
    <FormFieldSetup
      errorMessage={undefined}
      helperText={helperText}
      label={label}
      isRequired={false}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {claimConditionType === "overrides" ||
        claimConditionType === "specific" ? null : (
          <Select
            disabled={formDisabled}
            onValueChange={handleClaimerChange}
            value={dropType}
          >
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any wallet</SelectItem>
              <SelectItem value="overrides">
                Any wallet (with overrides)
              </SelectItem>
              <SelectItem value="specific">Only specific wallets</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Edit or See Snapshot */}
        {snapshot ? (
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* disable the "Edit" button when form is disabled, but not when it's a "See" button */}
            <Button
              className="gap-2"
              disabled={disabledSnapshotButton}
              onClick={() => setOpenIndex(phaseIndex)}
              size="sm"
            >
              {isAdmin ? "Edit" : "See"} Claimer Snapshot
              <UploadIcon className="size-4" />
            </Button>

            {snapshot && snapshot.length > 0 && (
              <Button
                className="gap-2 rounded bg-background"
                variant="outline"
                disabled={disabledSnapshotButton}
                onClick={() => {
                  downloadSnapshotAsCSV(snapshot);
                }}
                size="sm"
              >
                <ArrowDownToLineIcon className="size-4" />
                Download
              </Button>
            )}

            <div
              className={cn(
                "flex gap-2 items-center",
                snapshot?.length === 0
                  ? "text-muted-foreground"
                  : "text-green-600 dark:text-green-500",
                disabledSnapshotButton ? "opacity-50" : "",
              )}
            >
              <div className="size-2 bg-current rounded-full" />
              <span className="text-sm">
                {snapshot?.length}{" "}
                {snapshot?.length === 1 ? "address" : "addresses"} in snapshot
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </FormFieldSetup>
  );
};

function downloadSnapshotAsCSV(snapshot: SnapshotEntry[]) {
  const csvData = snapshot.map((entry) => ({
    address: entry.address,
    maxClaimable:
      entry.maxClaimable === "0" ? "" : entry.maxClaimable?.toString() || "",
    price: entry.price?.toString() || "",
    currencyAddress: entry.currencyAddress || "",
  }));

  const csvContent = Papa.unparse(csvData, {
    header: true,
    delimiter: ",",
    quotes: false,
  });

  handleDownload({
    fileContent: csvContent,
    fileNameWithExtension: "snapshot.csv",
    fileFormat: "text/csv",
  });
}
