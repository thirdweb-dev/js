import { ResetClaimEligibility } from "../reset-claim-eligibility";
import { ClaimConditionsPhase } from "./phase";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { useIsAdmin } from "@3rdweb-sdk/react/hooks/useContractRoles";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import {
  DropContract,
  TokenContract,
  useAddress,
  useClaimConditions,
  useSetClaimConditions,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import {
  ClaimConditionInput,
  ClaimConditionInputSchema,
  NATIVE_TOKEN_ADDRESS,
  SnapshotEntry,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { TooltipBox } from "components/configure-networks/Form/TooltipBox";
import { detectFeatures } from "components/contract-components/utils";
import { SnapshotUpload } from "contract-ui/tabs/claim-conditions/components/snapshot-upload";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  hasLegacyClaimConditions,
  hasMultiphaseClaimConditions,
} from "lib/claimcondition-utils";
import React, { useMemo, useState } from "react";
import {
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import invariant from "tiny-invariant";
import { Button, Heading, MenuItem, Text } from "tw-components";
import * as z from "zod";
import { ZodError } from "zod";

type ClaimConditionDashboardInput = ClaimConditionInput & {
  isEditing: boolean;
  fromSdk: boolean;
};

const DEFAULT_PHASE: ClaimConditionDashboardInput = {
  startTime: new Date(),
  maxClaimableSupply: "unlimited",
  maxClaimablePerWallet: "unlimited",
  waitInSeconds: "0",
  price: "0",
  currencyAddress: NATIVE_TOKEN_ADDRESS,
  snapshot: undefined,
  merkleRootHash: undefined,
  metadata: {
    name: "",
  },
  isEditing: true,
  fromSdk: false,
};

const ClaimConditionsSchema = z.object({
  phases: z.array(
    ClaimConditionInputSchema.extend({
      isEditing: z.boolean(),
      fromSdk: z.boolean(),
    }),
  ),
});

type DropType = "any" | "specific" | "overrides";

type ClaimConditionType =
  | "public"
  | "overrides"
  | "specific"
  | "creator"
  | "custom";

export const ClaimConditionTypeData: Record<
  ClaimConditionType,
  { name: string; description: string }
> = Object.freeze({
  public: {
    name: "Public",
    description: "Allow any wallet to claim this drop during this claim phase.",
  },
  overrides: {
    name: "Public (With Allowlist)",
    description:
      "Allow any wallet to claim this drop during this claim phase with special overrides for some wallet addresses.",
  },
  specific: {
    name: "Allowlist Only",
    description:
      "Only wallet addresses in the allowlist can claim this drop during this claim phase.",
  },
  creator: {
    name: "Only Owner",
    description:
      "A phase for the owner of the contract to indefinitely claim with no cost, (only gas).",
  },
  custom: {
    name: "Custom",
    description: "Create a custom claim phase catered to your drop.",
  },
});

const getClaimConditionTypeFromPhase = (
  phase: ClaimConditionInput,
): ClaimConditionType => {
  if (!phase.snapshot) {
    return "public";
  } else if (phase.snapshot) {
    if (
      typeof phase.snapshot !== "string" &&
      phase.snapshot.length === 1 &&
      phase.snapshot.some(
        (a) => (a as SnapshotEntry).maxClaimable === "unlimited",
      )
    ) {
      return "creator";
    } else if (phase.maxClaimablePerWallet?.toString() === "0") {
      return "specific";
    } else {
      return "overrides";
    }
  }
  return "custom";
};

type FormData = z.input<typeof ClaimConditionsSchema>;

type ControlledField = UseFieldArrayReturn<FormData>["fields"][number] &
  FormData["phases"][number];

interface ClaimsConditionFormContextData {
  form: UseFormReturn<FormData>;
  field: ControlledField;
  phaseIndex: number;
  formDisabled: boolean;
  tokenDecimals: number;
  isClaimPhaseV1: boolean;
  isMultiPhase: boolean;
  isActive: boolean;
  dropType: DropType;
  setOpenSnapshotIndex: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  isColumn?: boolean;
  isErc20: boolean;
  claimConditionType: ClaimConditionType;
}

const ClaimsConditionFormContext = React.createContext<
  ClaimsConditionFormContextData | undefined
>(undefined);

export function useClaimConditionsFormContext() {
  const data = React.useContext(ClaimsConditionFormContext);
  invariant(
    data,
    "useClaimConditionsFormContext must be used within a ClaimsConditionFormContext.Provider",
  );
  return data;
}

interface ClaimConditionsFormProps {
  contract: DropContract;
  tokenId?: string;
  isColumn?: true;
}

export const ClaimConditionsForm: React.FC<ClaimConditionsFormProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  const { isMultiPhase, isClaimPhaseV1, isErc20 } = useMemo(() => {
    return {
      isMultiPhase: hasMultiphaseClaimConditions(contract),
      isClaimPhaseV1: hasLegacyClaimConditions(contract),
      isErc20: detectFeatures(contract, ["ERC20"]),
    };
  }, [contract]);

  const walletAddress = useAddress();
  const trackEvent = useTrack();
  const [resetFlag, setResetFlag] = useState(false);
  const isAdmin = useIsAdmin(contract);
  const [openSnapshotIndex, setOpenSnapshotIndex] = useState(-1);
  const setClaimConditionsQuery = useSetClaimConditions(contract, tokenId);

  const tokenDecimals = useTokenDecimals(
    isErc20 ? (contract as TokenContract) : undefined,
  );
  const tokenDecimalsData = tokenDecimals.data ?? 0;
  const saveClaimPhaseNotification = useTxNotifications(
    "Saved claim phases",
    "Failed to save claim phases",
  );

  const claimConditionsQuery = useClaimConditions(contract, tokenId, {
    withAllowList: true,
  });

  const transformedQueryData = useMemo(() => {
    return (claimConditionsQuery.data || [])
      .map((phase, idx) => ({
        ...phase,
        price: phase.currencyMetadata.displayValue,
        maxClaimableSupply: phase.maxClaimableSupply?.toString() || "0",
        currencyMetadata: {
          ...phase.currencyMetadata,
          value: phase.currencyMetadata.value?.toString() || "0",
        },
        currencyAddress: phase.currencyAddress?.toLowerCase() || "0",
        maxClaimablePerWallet: phase.maxClaimablePerWallet?.toString() || "0",
        waitInSeconds: phase.waitInSeconds?.toString() || "0",
        startTime: new Date(phase.startTime),
        snapshot: phase.snapshot?.map(
          ({ address, maxClaimable, price, currencyAddress }) => ({
            address,
            maxClaimable: maxClaimable || "0",
            price: price || undefined,
            currencyAddress: currencyAddress || undefined,
          }),
        ),
        metadata: {
          ...phase.metadata,
          name: phase?.metadata?.name || `Phase ${idx + 1}`,
        },
        isEditing: false,
        fromSdk: true,
      }))
      .filter(
        (phase) => isMultiPhase || Number(phase.maxClaimableSupply) !== 0,
      );
  }, [claimConditionsQuery.data, isMultiPhase]);

  const isFetchingData =
    claimConditionsQuery.isFetching || setClaimConditionsQuery.isLoading;

  const canEditForm = isAdmin && !isFetchingData;

  const form = useForm<FormData>({
    defaultValues: { phases: transformedQueryData },
    values: { phases: transformedQueryData },
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  const addPhase = (type: ClaimConditionType) => {
    const name = `${ClaimConditionTypeData[type].name} phase`;

    switch (type) {
      case "public":
        append({
          ...DEFAULT_PHASE,
          metadata: { name },
        });
        break;

      case "specific":
        append({
          ...DEFAULT_PHASE,
          metadata: { name },
          maxClaimablePerWallet: "0",
          snapshot: [],
        });
        break;

      case "overrides":
        append({
          ...DEFAULT_PHASE,
          metadata: { name },
          maxClaimablePerWallet: "1",
          snapshot: [],
        });
        break;

      case "creator":
        append({
          ...DEFAULT_PHASE,
          metadata: { name },
          maxClaimablePerWallet: "0",
          price: "0",
          maxClaimableSupply: "unlimited",
          snapshot: walletAddress
            ? [
                {
                  address: walletAddress,
                  maxClaimable: "unlimited",
                  price: "0",
                },
              ]
            : [],
        });
        break;

      default:
        append({
          ...DEFAULT_PHASE,
          metadata: { name },
        });
    }
  };

  const removePhase = (index: number) => {
    remove(index);
  };

  const phases = form.watch("phases");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...phases[index],
    };
  });

  const handleFormSubmit = form.handleSubmit(async (d) => {
    const category = isErc20 ? "token" : "nft";

    trackEvent({
      category,
      action: "set-claim-conditions",
      label: "attempt",
    });

    try {
      await setClaimConditionsQuery.mutateAsync({
        phases: d.phases as ClaimConditionInput[],
        reset: resetFlag,
      });
      trackEvent({
        category,
        action: "set-claim-conditions",
        label: "success",
      });
      saveClaimPhaseNotification.onSuccess();

      const newPhases = d.phases.map((phase) => ({
        ...phase,
        isEditing: false,
        fromSdk: true,
      }));

      form.setValue("phases", newPhases);
    } catch (error) {
      trackEvent({
        category,
        action: "set-claim-conditions",
        label: "error",
      });
      if (error instanceof ZodError) {
        error.errors.forEach((e) => {
          const path = `phases.${e.path.join(".")}`;
          form.setError(path as any, e);
        });
      } else {
        saveClaimPhaseNotification.onError(error);
      }
    }
  });

  const activePhaseId = useMemo(() => {
    let phaseId: string | null = null;
    let latestStartTime = 0;

    controlledFields.forEach((phase) => {
      if (!phase.startTime || !phase.fromSdk) {
        return;
      }

      const phaseStartTime =
        typeof phase.startTime === "object"
          ? phase.startTime.getTime()
          : phase.startTime;
      const currentTime = new Date().getTime();

      if (phaseStartTime < currentTime && phaseStartTime > latestStartTime) {
        latestStartTime = phaseStartTime;
        phaseId = phase.id;
      }
    });

    return phaseId;
  }, [controlledFields]);

  const { hasAddedPhases, hasRemovedPhases } = useMemo(() => {
    const initialPhases = claimConditionsQuery.data || [];
    const currentPhases = controlledFields;

    const _hasAddedPhases =
      currentPhases.length > initialPhases.length &&
      claimConditionsQuery?.data?.length === 0 &&
      controlledFields?.length > 0;
    const _hasRemovedPhases =
      currentPhases.length < initialPhases.length &&
      isMultiPhase &&
      controlledFields?.length === 0;

    return {
      hasAddedPhases: _hasAddedPhases,
      hasRemovedPhases: _hasRemovedPhases,
    };
  }, [claimConditionsQuery.data, controlledFields, isMultiPhase]);

  return (
    <>
      {/* spinner */}
      {isFetchingData && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}

      <Flex onSubmit={handleFormSubmit} direction="column" as="form" gap={10}>
        <Flex direction={"column"} gap={6}>
          {/* Show the reason why the form is disabled */}
          {!isAdmin && (
            <Text>Connect with admin wallet to edit claim conditions.</Text>
          )}
          {controlledFields.map((field, index) => {
            const dropType: DropType = field.snapshot
              ? isClaimPhaseV1 ||
                field.maxClaimablePerWallet?.toString() === "0"
                ? "specific"
                : "overrides"
              : "any";

            const claimConditionType = getClaimConditionTypeFromPhase(field);

            const isActive = activePhaseId === field.id;

            const snapshotValue = field.snapshot?.map((v) =>
              typeof v === "string"
                ? {
                    address: v,
                    maxClaimable: "unlimited",
                    currencyAddress: constants.AddressZero,
                    price: "unlimited",
                  }
                : {
                    ...v,
                    maxClaimable: v?.maxClaimable?.toString() || "unlimited",
                    currencyAddress:
                      v?.currencyAddress || constants.AddressZero,
                    price: v?.price?.toString() || "unlimited",
                  },
            );

            return (
              <React.Fragment key={`snapshot_${field.id}_${index}`}>
                <SnapshotUpload
                  dropType={dropType}
                  isV1ClaimCondition={isClaimPhaseV1}
                  isOpen={openSnapshotIndex === index}
                  onClose={() => setOpenSnapshotIndex(-1)}
                  value={snapshotValue}
                  setSnapshot={(snapshot) =>
                    form.setValue(`phases.${index}.snapshot`, snapshot)
                  }
                  isDisabled={!canEditForm}
                />

                <ClaimsConditionFormContext.Provider
                  value={{
                    form,
                    field,
                    phaseIndex: index,
                    formDisabled: !canEditForm,
                    isErc20,
                    tokenDecimals: tokenDecimalsData,
                    isClaimPhaseV1,
                    dropType,
                    setOpenSnapshotIndex,
                    isAdmin,
                    isColumn,
                    claimConditionType,
                    isMultiPhase,
                    isActive,
                  }}
                >
                  <ClaimConditionsPhase
                    contract={contract}
                    onRemove={() => {
                      removePhase(index);
                      if (!isMultiPhase) {
                        setResetFlag(true);
                      }
                    }}
                    isLoading={setClaimConditionsQuery.isLoading}
                  />
                </ClaimsConditionFormContext.Provider>
              </React.Fragment>
            );
          })}

          {phases?.length === 0 && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Flex direction="column">
                <AlertTitle as={Heading} size="label.lg">
                  {isMultiPhase
                    ? "Missing Claim Phases"
                    : "Missing Claim Conditions"}
                </AlertTitle>
                <AlertDescription as={Text}>
                  {isMultiPhase
                    ? "You need to set at least one claim phase for people to claim this drop."
                    : "You need to set claim conditions for people to claim this drop."}
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          <Flex
            justifyContent="space-between"
            flexDir={{ base: "column", md: isColumn ? "column" : "row" }}
            gap={2}
          >
            <Flex gap={2}>
              <AdminOnly contract={contract as ValidContractInstance}>
                {!isClaimPhaseV1 ? (
                  <>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        colorScheme="primary"
                        variant={phases?.length > 0 ? "outline" : "solid"}
                        borderRadius="md"
                        leftIcon={<Icon as={FiPlus} />}
                        isDisabled={
                          setClaimConditionsQuery.isLoading ||
                          (!isMultiPhase && phases?.length > 0)
                        }
                      >
                        Add {isMultiPhase ? "Phase" : "Claim Conditions"}
                      </MenuButton>
                      <MenuList
                        borderRadius="lg"
                        overflow="hidden"
                        zIndex="overlay"
                      >
                        {Object.keys(ClaimConditionTypeData).map((key) => {
                          const type = key as ClaimConditionType;

                          if (type === "custom") {
                            return null;
                          }

                          return (
                            <MenuItem
                              key={type}
                              onClick={() => {
                                addPhase(type);
                                // TODO: Automatically start editing the new phase after adding it
                              }}
                            >
                              <Flex>
                                {ClaimConditionTypeData[type].name}
                                <TooltipBox
                                  content={
                                    <Text size="body.md">
                                      {ClaimConditionTypeData[type].description}
                                    </Text>
                                  }
                                />
                              </Flex>
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  <Button
                    size="sm"
                    colorScheme="primary"
                    variant="solid"
                    borderRadius="md"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={() => addPhase("custom")}
                    isDisabled={setClaimConditionsQuery.isLoading}
                  >
                    Add {isMultiPhase ? "Phase" : "Claim Conditions"}
                  </Button>
                )}
              </AdminOnly>
              {controlledFields.some((field) => field.fromSdk) && (
                <ResetClaimEligibility
                  isErc20={isErc20}
                  contract={contract}
                  isColumn={isColumn}
                  tokenId={tokenId}
                />
              )}
            </Flex>

            <Flex>
              <AdminOnly
                contract={contract as ValidContractInstance}
                fallback={<Box pb={5} />}
              >
                <Flex justifyContent="center" alignItems="center" gap={3}>
                  {(hasRemovedPhases || hasAddedPhases) && (
                    <Text color="red.500" fontWeight="bold">
                      You have unsaved changes
                    </Text>
                  )}
                  {controlledFields.length > 0 ||
                  hasRemovedPhases ||
                  !isMultiPhase ? (
                    <TransactionButton
                      colorScheme="primary"
                      transactionCount={1}
                      isDisabled={claimConditionsQuery.isLoading}
                      type="submit"
                      isLoading={setClaimConditionsQuery.isLoading}
                      loadingText="Saving..."
                      size="md"
                    >
                      Save Phases
                    </TransactionButton>
                  ) : null}
                </Flex>
              </AdminOnly>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
