import { useClaimConditionsFormContext } from "..";
import { CustomFormControl } from "../common";
import { Box, Flex, Icon, Select } from "@chakra-ui/react";
import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { Button, Text } from "tw-components";

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
    isClaimPhaseV1,
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
      if (val === "specific" && !isClaimPhaseV1) {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 0);
      }
      if (
        val === "overrides" &&
        !isClaimPhaseV1 &&
        field.maxClaimablePerWallet !== 1
      ) {
        form.setValue(`phases.${phaseIndex}.maxClaimablePerWallet`, 1);
      }
      form.setValue(`phases.${phaseIndex}.snapshot`, []);
      setOpenIndex(phaseIndex);
    }
  };

  let helperText: React.ReactNode;

  const disabledSnapshotButton = isAdmin && formDisabled;

  if (isClaimPhaseV1) {
    helperText = (
      <>
        Snapshot spots are one-time-use! Once a wallet has claimed the drop, it
        cannot claim again, even if it did not claim the entire amount assigned
        to it in the snapshot.
      </>
    );
  } else {
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
  }

  if (
    !isClaimPhaseV1 &&
    (claimConditionType === "public" || claimConditionType === "creator")
  ) {
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
            {!isClaimPhaseV1 ? (
              <option value="overrides">Any wallet (with overrides)</option>
            ) : null}
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
              colorScheme="purple"
              isDisabled={disabledSnapshotButton}
              borderRadius="md"
              onClick={() => setOpenIndex(phaseIndex)}
              rightIcon={<Icon as={FiUpload} />}
            >
              {isAdmin ? "Edit" : "See"} Claimer Snapshot
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
              <Icon as={BsCircleFill} boxSize={2} />
              <Text size="body.sm" color="inherit">
                <strong>
                  {field.snapshot?.length} address
                  {field.snapshot?.length === 1 ? "" : "es"}
                </strong>{" "}
                in snapshot
              </Text>
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
