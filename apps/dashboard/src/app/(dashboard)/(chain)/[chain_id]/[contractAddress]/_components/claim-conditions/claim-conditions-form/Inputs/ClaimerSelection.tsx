import { Button } from "@/components/ui/button";
import { Box, Flex, Select } from "@chakra-ui/react";
import { UploadIcon } from "lucide-react";
import { useClaimConditionsFormContext } from "..";
import { CustomFormControl } from "../common";

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
    isColumn,
    claimConditionType,
  } = useClaimConditionsFormContext();

  const handleClaimerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value as "any" | "specific" | "overrides";

    if (val === "any") {
      form.setValue(`phases.${phaseIndex}.snapshot`, undefined);
    } else {
      if (val === "specific") {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 0);
      }
      if (val === "overrides" && field.maxClaimablePerWallet !== 1) {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 1);
      }
      form.setValue(`phases.${phaseIndex}.snapshot`, []);
      setOpenIndex(phaseIndex);
    }
  };

  let helperText: React.ReactNode;

  const disabledSnapshotButton = isAdmin && formDisabled;

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
    <CustomFormControl
      disabled={formDisabled}
      label={label}
      error={
        form.getFieldState(`phases.${phaseIndex}.snapshot`, form.formState)
          .error
      }
      helperText={helperText}
    >
      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        {claimConditionType === "overrides" ||
        claimConditionType === "specific" ? null : (
          <Select
            isDisabled={formDisabled}
            w={{ base: "100%", md: "50%" }}
            value={dropType}
            onChange={handleClaimerChange}
          >
            <option value="any">Any wallet</option>
            <option value="overrides">Any wallet (with overrides)</option>
            <option value="specific">Only specific wallets</option>
          </Select>
        )}

        {/* Edit or See Snapshot */}
        {field.snapshot ? (
          <Flex
            direction={{
              base: "column",
              md: isColumn ? "column" : "row",
            }}
            gap={1.5}
          >
            {/* disable the "Edit" button when form is disabled, but not when it's a "See" button */}
            <Button
              variant="primary"
              disabled={disabledSnapshotButton}
              className="gap-2 rounded-md"
              onClick={() => setOpenIndex(phaseIndex)}
            >
              {isAdmin ? "Edit" : "See"} Claimer Snapshot
              <UploadIcon className="size-4" />
            </Button>

            <Flex
              gap={2}
              direction="row"
              align="center"
              justify="center"
              opacity={disabledSnapshotButton ? 0.5 : 1}
              color={field.snapshot?.length === 0 ? "red.400" : "green.400"}
              _light={{
                color: field.snapshot?.length === 0 ? "red.500" : "green.500",
              }}
              ml={2}
            >
              <p>
                ●{" "}
                <strong>
                  {field.snapshot?.length} address
                  {field.snapshot?.length === 1 ? "" : "es"}
                </strong>{" "}
                in snapshot
              </p>
            </Flex>
          </Flex>
        ) : (
          <Box
            w={{ base: "100%", md: "50%" }}
            display={{ base: "none", md: "block" }}
          />
        )}
      </Flex>
    </CustomFormControl>
  );
};
