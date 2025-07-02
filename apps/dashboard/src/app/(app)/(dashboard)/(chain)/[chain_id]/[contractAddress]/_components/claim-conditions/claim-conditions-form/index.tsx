"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Button } from "chakra/button";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
import { CircleHelpIcon, PlusIcon } from "lucide-react";
import { createContext, Fragment, useContext, useMemo, useState } from "react";
import {
  type UseFieldArrayReturn,
  type UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
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
import * as z from "zod";
import { ZodError } from "zod";
import { AdminOnly } from "@/components/contracts/roles/admin-only";
import { TransactionButton } from "@/components/tx-button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useIsAdmin } from "@/hooks/useContractRoles";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import {
  type ClaimConditionInput,
  ClaimConditionInputSchema,
  type SnapshotEntry,
} from "../legacy-zod-schema";
import { ResetClaimEligibility } from "../reset-claim-eligibility";
import { SnapshotViewerSheet } from "../snapshot-upload";
import { getClaimPhasesInLegacyFormat, setClaimPhasesTx } from "./hooks";
import { ClaimConditionsPhase } from "./phase";

type ClaimConditionDashboardInput = ClaimConditionInput & {
  isEditing: boolean;
  fromSdk: boolean;
};

const DEFAULT_PHASE: ClaimConditionDashboardInput = {
  currencyAddress: NATIVE_TOKEN_ADDRESS,
  fromSdk: false,
  isEditing: true,
  maxClaimablePerWallet: "unlimited",
  maxClaimableSupply: "unlimited",
  merkleRootHash: undefined,
  metadata: {
    name: "",
  },
  price: "0",
  snapshot: undefined,
  startTime: new Date(),
};

const ClaimConditionsSchema = z.object({
  phases: z.array(
    ClaimConditionInputSchema.extend({
      fromSdk: z.boolean(),
      isEditing: z.boolean(),
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
  creator: {
    description:
      "A phase for the owner of the contract to indefinitely claim with no cost, (only gas).",
    name: "Only Owner",
  },
  custom: {
    description: "Create a custom claim phase catered to your drop.",
    name: "Custom",
  },
  overrides: {
    description:
      "Allow any wallet to claim this drop during this claim phase with special overrides for some wallet addresses.",
    name: "Public (With Allowlist)",
  },
  public: {
    description: "Allow any wallet to claim this drop during this claim phase.",
    name: "Public",
  },
  specific: {
    description:
      "Only wallet addresses in the allowlist can claim this drop during this claim phase.",
    name: "Allowlist Only",
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
      phase.maxClaimablePerWallet?.toString() === "0" &&
      phase.price === "0" &&
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
  tokenDecimals: number | undefined;
  isMultiPhase: boolean;
  isActive: boolean;
  dropType: DropType;
  setOpenSnapshotIndex: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  isColumn?: boolean;
  isErc20: boolean;
  claimConditionType: ClaimConditionType;
}

// legacy, but we SHOULD remove this and instead pass down props!
// eslint-disable-next-line no-restricted-syntax
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
  isLoggedIn: boolean;
}

export const ClaimConditionsForm: React.FC<ClaimConditionsFormProps> = ({
  contract,
  tokenId,
  isColumn,
  isErc20,
  isMultiPhase,
  isLoggedIn,
}) => {
  // assume 1155 if we have a tokenId
  const isErc1155 = tokenId !== undefined;
  // if neither 1155 or 20 then it's 721
  const isErc721 = !isErc20 && !isErc1155;
  const walletAddress = useActiveAccount()?.address;

  const isAdmin = useIsAdmin(contract);
  const [openSnapshotIndex, setOpenSnapshotIndex] = useState(-1);
  const sendTx = useSendAndConfirmTransaction();

  const tokenDecimals = useReadContract(decimals, {
    contract,
    queryOptions: {
      enabled: isErc20,
    },
  });
  const saveClaimPhaseNotification = useTxNotifications(
    "Saved claim phases",
    "Failed to save claim phases",
  );

  const claimConditionsQuery = useReadContract(getClaimPhasesInLegacyFormat, {
    contract,
    isMultiPhase,
    ...(isErc20
      ? { decimals: tokenDecimals.data, type: "erc20" }
      : isErc721
        ? { type: "erc721" }
        : {
            tokenId: BigInt(tokenId || 0),
            type: "erc1155",
          }),
  });

  const transformedQueryData = useMemo(() => {
    return (claimConditionsQuery.data || [])
      .map((phase, idx) => ({
        ...phase,
        currencyAddress: phase.currencyAddress?.toLowerCase() || "0",
        currencyMetadata: {
          ...phase.currencyMetadata,
          value: phase.currencyMetadata.value?.toString() || "0",
        },
        fromSdk: true,
        isEditing: false,
        maxClaimablePerWallet: phase.maxClaimablePerWallet?.toString() || "0",
        maxClaimableSupply: phase.maxClaimableSupply?.toString() || "0",
        merkleRootHash: (phase.merkleRootHash || "") as string,
        metadata: {
          ...phase.metadata,
          name: phase?.metadata?.name || `Phase ${idx + 1}`,
        },
        price: phase.currencyMetadata.displayValue,
        snapshot: phase.snapshot?.map(
          ({ address, maxClaimable, price, currencyAddress }) => ({
            address,
            currencyAddress: currencyAddress || undefined,
            maxClaimable: maxClaimable || "0",
            price: price || undefined,
          }),
        ),
        startTime: new Date(phase.startTime),
      }))
      .filter(
        (phase) => isMultiPhase || Number(phase.maxClaimableSupply) !== 0,
      );
  }, [claimConditionsQuery.data, isMultiPhase]);

  const isFetchingData =
    claimConditionsQuery.isFetching ||
    sendTx.isPending ||
    // Need to make sure the tokenDecimals.data is present when interacting with ERC20 claim conditions
    (isErc20 && tokenDecimals.isLoading);

  const canEditForm = isAdmin && !isFetchingData;

  const form = useForm<FormData>({
    defaultValues: { phases: transformedQueryData },
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
    values: { phases: transformedQueryData },
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
          maxClaimablePerWallet: "0",
          metadata: { name },
          snapshot: [],
        });
        break;

      case "overrides":
        append({
          ...DEFAULT_PHASE,
          maxClaimablePerWallet: "1",
          metadata: { name },
          snapshot: [],
        });
        break;

      case "creator":
        append({
          ...DEFAULT_PHASE,
          maxClaimablePerWallet: "0",
          maxClaimableSupply: "unlimited",
          metadata: { name },
          price: "0",
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
    if (isErc20 && !tokenDecimals.data) {
      return toast.error(
        `Could not fetch token decimals for contract ${contract.address}`,
      );
    }
    try {
      const tx = setClaimPhasesTx(
        {
          contract,
          isSinglePhase: !isMultiPhase,
          ...(isErc20
            ? { decimals: tokenDecimals.data, type: "erc20" }
            : isErc721
              ? { type: "erc721" }
              : { tokenId: BigInt(tokenId || 0), type: "erc1155" }),
        },
        d.phases,
      );
      await sendTx.mutateAsync(tx);

      saveClaimPhaseNotification.onSuccess();

      const newPhases = d.phases.map((phase) => ({
        ...phase,
        fromSdk: true,
        isEditing: false,
      }));

      form.setValue("phases", newPhases);
    } catch (error) {
      console.error(error);

      if (error instanceof ZodError) {
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

    controlledFields.forEach((phase) => {
      if (!phase.startTime || !phase.fromSdk) {
        return;
      }

      const phaseStartTime =
        typeof phase.startTime === "object"
          ? phase.startTime.getTime()
          : phase.startTime;
      const currentTime = Date.now();

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

  if (claimConditionsQuery.isPending) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-border">
        <Spinner className="size-10" />
      </div>
    );
  }

  // Do not proceed if fails to load the tokenDecimals.data - for ERC20 drop contracts specifically
  if (isErc20 && tokenDecimals.data === undefined) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-border">
        Failed to load token decimals
      </div>
    );
  }

  return (
    <>
      <Flex as="form" direction="column" gap={10} onSubmit={handleFormSubmit}>
        <Flex direction="column" gap={6}>
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
                    currencyAddress: ZERO_ADDRESS,
                    maxClaimable: "unlimited",
                    price: "unlimited",
                  }
                : {
                    ...v,
                    currencyAddress: v?.currencyAddress || ZERO_ADDRESS,
                    maxClaimable: v?.maxClaimable?.toString() || "unlimited",
                    price: v?.price?.toString() || "unlimited",
                  },
            );

            return (
              <Fragment key={`snapshot_${field.id}_${index}`}>
                <SnapshotViewerSheet
                  client={contract.client}
                  dropType={dropType}
                  isDisabled={!canEditForm}
                  isOpen={openSnapshotIndex === index}
                  onClose={() => {
                    setOpenSnapshotIndex(-1);
                  }}
                  setSnapshot={(snapshot) =>
                    form.setValue(`phases.${index}.snapshot`, snapshot)
                  }
                  value={snapshotValue}
                />

                <ClaimsConditionFormContext.Provider
                  value={{
                    claimConditionType,
                    dropType,
                    field,
                    form,
                    formDisabled: !canEditForm,
                    isActive,
                    isAdmin,
                    isColumn,
                    isErc20,
                    isMultiPhase,
                    phaseIndex: index,
                    setOpenSnapshotIndex,
                    tokenDecimals: tokenDecimals.data,
                  }}
                >
                  <ClaimConditionsPhase
                    contract={contract}
                    isPending={sendTx.isPending}
                    onRemove={() => {
                      removePhase(index);
                    }}
                  />
                </ClaimsConditionFormContext.Provider>
              </Fragment>
            );
          })}

          {phases?.length === 0 && (
            <Alert borderRadius="md" status="warning">
              <AlertIcon />
              <div className="flex flex-col">
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
              </div>
            </Alert>
          )}

          <Flex
            flexDir={{ base: "column", md: "row" }}
            gap={2}
            justifyContent="space-between"
          >
            <div className="flex flex-row gap-2">
              <AdminOnly contract={contract}>
                <Menu>
                  <MenuButton
                    as={Button}
                    borderRadius="md"
                    colorScheme="primary"
                    isDisabled={
                      sendTx.isPending || (!isMultiPhase && phases?.length > 0)
                    }
                    leftIcon={<PlusIcon className="size-5" />}
                    size="sm"
                    variant={phases?.length > 0 ? "outline" : "solid"}
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
                  contract={contract}
                  isErc20={isErc20}
                  isLoggedIn={isLoggedIn}
                  isMultiphase={isMultiPhase}
                  tokenId={tokenId}
                />
              )}
            </div>

            <div className="flex flex-row">
              <AdminOnly contract={contract} fallback={<Box pb={5} />}>
                <Flex alignItems="center" gap={3} justifyContent="center">
                  {(hasRemovedPhases || hasAddedPhases) && (
                    <Text color="red.500" fontWeight="bold">
                      You have unsaved changes
                    </Text>
                  )}
                  {controlledFields.length > 0 ||
                  hasRemovedPhases ||
                  !isMultiPhase ? (
                    <TransactionButton
                      client={contract.client}
                      disabled={claimConditionsQuery.isPending}
                      isLoggedIn={isLoggedIn}
                      isPending={sendTx.isPending}
                      transactionCount={1}
                      txChainID={contract.chain.id}
                      type="submit"
                    >
                      {claimConditionsQuery.isPending
                        ? "Saving Phases"
                        : "Save Phases"}
                    </TransactionButton>
                  ) : null}
                </Flex>
              </AdminOnly>
            </div>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

const TooltipBox: React.FC<{
  content: React.ReactNode;
}> = ({ content }) => {
  return (
    <ToolTipLabel label={<div>{content}</div>}>
      <CircleHelpIcon className="size-4 text-muted-foreground" />
    </ToolTipLabel>
  );
};
