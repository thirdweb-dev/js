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
  type ClaimConditionInput,
  ClaimConditionInputSchema,
  type SnapshotEntry,
} from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { TooltipBox } from "components/configure-networks/Form/TooltipBox";
import { SnapshotUpload } from "contract-ui/tabs/claim-conditions/components/snapshot-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Fragment, createContext, useContext, useMemo, useState } from "react";
import {
  type UseFieldArrayReturn,
  type UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebContract,
  ZERO_ADDRESS,
} from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import invariant from "tiny-invariant";
import { Button, Heading, MenuItem, Text } from "tw-components";
import * as z from "zod";
import { ZodError } from "zod";
import { ResetClaimEligibility } from "../reset-claim-eligibility";
import { getClaimPhasesInLegacyFormat, setClaimPhasesTx } from "./hooks";
import { ClaimConditionsPhase } from "./phase";

type ClaimConditionDashboardInput = ClaimConditionInput & {
  isEditing: boolean;
  fromSdk: boolean;
};

const DEFAULT_PHASE: ClaimConditionDashboardInput = {
  startTime: new Date(),
  maxClaimableSupply: "unlimited",
  maxClaimablePerWallet: "unlimited",
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
  }
  if (phase.snapshot) {
    if (
      typeof phase.snapshot !== "string" &&
      phase.snapshot.length === 1 &&
      phase.snapshot.some(
        (a) => (a as SnapshotEntry).maxClaimable === "unlimited",
      )
    ) {
      return "creator";
    }
    if (phase.maxClaimablePerWallet?.toString() === "0") {
      return "specific";
    }
    return "overrides";
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
  isMultiPhase: boolean;
  isActive: boolean;
  dropType: DropType;
  setOpenSnapshotIndex: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  isColumn?: boolean;
  isErc20: boolean;
  claimConditionType: ClaimConditionType;
}

const ClaimsConditionFormContext = createContext<
  ClaimsConditionFormContextData | undefined
>(undefined);

export function useClaimConditionsFormContext() {
  const data = useContext(ClaimsConditionFormContext);
  invariant(
    data,
    "useClaimConditionsFormContext must be used within a ClaimsConditionFormContext.Provider",
  );
  return data;
}

interface ClaimConditionsFormProps {
  contract: ThirdwebContract;
  tokenId?: string;
  isColumn?: true;
  isErc20: boolean;
  isMultiPhase: boolean;
}

export const ClaimConditionsForm: React.FC<ClaimConditionsFormProps> = ({
  contract,
  tokenId,
  isColumn,
  isErc20,
  isMultiPhase,
}) => {
  // assume 1155 if we have a tokenId
  const isErc1155 = tokenId !== undefined;
  // if neither 1155 or 20 then it's 721
  const isErc721 = !isErc20 && !isErc1155;
  const walletAddress = useActiveAccount()?.address;
  const trackEvent = useTrack();

  const isAdmin = useIsAdmin(contract);
  const [openSnapshotIndex, setOpenSnapshotIndex] = useState(-1);
  const sendTx = useSendAndConfirmTransaction();

  const tokenDecimals = useReadContract(decimals, {
    contract,
    queryOptions: {
      enabled: isErc20,
    },
  });
  const tokenDecimalsData = tokenDecimals.data ?? 0;
  const saveClaimPhaseNotification = useTxNotifications(
    "Saved claim phases",
    "Failed to save claim phases",
  );

  const claimConditionsQuery = useReadContract(getClaimPhasesInLegacyFormat, {
    contract,
    ...(isErc20
      ? { type: "erc20" }
      : isErc721
        ? { type: "erc721" }
        : { type: "erc1155", tokenId: BigInt(tokenId || 0) }),
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

  const isFetchingData = claimConditionsQuery.isFetching || sendTx.isPending;

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
      const tx = setClaimPhasesTx(
        {
          contract,
          ...(isErc20
            ? { type: "erc20" }
            : isErc721
              ? { type: "erc721" }
              : { type: "erc1155", tokenId: BigInt(tokenId || 0) }),
        },
        d.phases,
      );
      await sendTx.mutateAsync(tx);
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
      console.error(error);
      trackEvent({
        category,
        action: "set-claim-conditions",
        label: "error",
      });
      if (error instanceof ZodError) {
        // biome-ignore lint/complexity/noForEach: FIXME
        error.errors.forEach((e) => {
          const path = `phases.${e.path.join(".")}`;
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
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

    // biome-ignore lint/complexity/noForEach: FIXME
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
              ? field.maxClaimablePerWallet?.toString() === "0"
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
                    currencyAddress: ZERO_ADDRESS,
                    price: "unlimited",
                  }
                : {
                    ...v,
                    maxClaimable: v?.maxClaimable?.toString() || "unlimited",
                    currencyAddress: v?.currencyAddress || ZERO_ADDRESS,
                    price: v?.price?.toString() || "unlimited",
                  },
            );

            return (
              <Fragment key={`snapshot_${field.id}_${index}`}>
                <SnapshotUpload
                  dropType={dropType}
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
                    }}
                    isLoading={sendTx.isPending}
                  />
                </ClaimsConditionFormContext.Provider>
              </Fragment>
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
              <AdminOnly contract={contract}>
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    colorScheme="primary"
                    variant={phases?.length > 0 ? "outline" : "solid"}
                    borderRadius="md"
                    leftIcon={<Icon as={FiPlus} />}
                    isDisabled={
                      sendTx.isPending || (!isMultiPhase && phases?.length > 0)
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
                          <div className="flex items-center gap-1">
                            {ClaimConditionTypeData[type].name}
                            <TooltipBox
                              content={
                                <Text size="body.md">
                                  {ClaimConditionTypeData[type].description}
                                </Text>
                              }
                            />
                          </div>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
              </AdminOnly>

              {controlledFields.some((field) => field.fromSdk) && (
                <ResetClaimEligibility
                  isErc20={isErc20}
                  contract={contract}
                  tokenId={tokenId}
                />
              )}
            </Flex>

            <Flex>
              <AdminOnly contract={contract} fallback={<Box pb={5} />}>
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
                      isLoading={sendTx.isPending}
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
