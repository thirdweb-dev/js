import { ClaimPriceInput } from "./Inputs/ClaimPriceInput";
import { ClaimerSelection } from "./Inputs/ClaimerSelection";
import { CurrencySelection } from "./Inputs/CurrencySelection";
import { MaxClaimablePerWalletInput } from "./Inputs/MaxClaimablePerWalletInput";
import { MaxClaimableSupplyInput } from "./Inputs/MaxClaimableSupplyInput";
import { PhaseNameInput } from "./Inputs/PhaseNameInput";
import { PhaseStartTimeInput } from "./Inputs/PhaseStartTimeInput";
import { WaitingTimeInput } from "./Inputs/WaitingTimeInput";
import { CustomFormGroup } from "./common";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { useIsAdmin } from "@3rdweb-sdk/react/hooks/useContractRoles";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import {
  DropContract,
  TokenContract,
  useClaimConditions,
  useSetClaimConditions,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import {
  ClaimConditionInput,
  ClaimConditionInputArray,
  NATIVE_TOKEN_ADDRESS,
  ValidContractInstance,
} from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
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
import { FiPlus, FiTrash } from "react-icons/fi";
import invariant from "tiny-invariant";
import { Button, Card, Heading, Text } from "tw-components";
import * as z from "zod";
import { ZodError } from "zod";

const DEFAULT_PHASE = {
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
};

const ClaimConditionsSchema = z.object({
  phases: ClaimConditionInputArray,
});

type DropType = "any" | "specific" | "overrides";

export type FormData = z.input<typeof ClaimConditionsSchema>;

export type ControlledField = UseFieldArrayReturn<FormData>["fields"][number] &
  FormData["phases"][number];

export interface ClaimsConditionFormContextData {
  form: UseFormReturn<FormData>;
  field: ControlledField;
  phaseIndex: number;
  formDisabled: boolean;
  tokenDecimals: number;
  isClaimPhaseV1: boolean;
  dropType: DropType;
  setOpenSnapshotIndex: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  isColumn?: boolean;
  isErc20: boolean;
}

export const ClaimsConditionFormContext = React.createContext<
  ClaimsConditionFormContextData | undefined
>(undefined);

export function useClaimsConditionFormContext() {
  const data = React.useContext(ClaimsConditionFormContext);
  invariant(
    data,
    "useClaimsConditionFormContext must be used within a ClaimsConditionFormContext.Provider",
  );
  return data;
}

export interface ClaimConditionsFormProps {
  contract: DropContract;
  tokenId?: string;
  isColumn?: true;
}

export const ClaimConditionsForm: React.FC<ClaimConditionsFormProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  // memoized contract info
  const { isMultiPhase, isClaimPhaseV1, isErc20 } = useMemo(() => {
    return {
      isMultiPhase: hasMultiphaseClaimConditions(contract),
      isClaimPhaseV1: hasLegacyClaimConditions(contract),
      isErc20: detectFeatures(contract, ["ERC20"]),
    };
  }, [contract]);

  const trackEvent = useTrack();
  const [resetFlag, setResetFlag] = useState(false);
  const isAdmin = useIsAdmin(contract);
  const [openSnapshotIndex, setOpenSnapshotIndex] = useState(-1);
  const setClaimsConditionQuery = useSetClaimConditions(contract, tokenId);

  const tokenDecimals = useTokenDecimals(
    isErc20 ? (contract as TokenContract) : undefined,
  );
  const tokenDecimalsData = tokenDecimals.data ?? 0;
  const saveClaimPhaseNotification = useTxNotifications(
    "Saved claim phases",
    "Failed to save claim phases",
  );

  const claimsConditionQuery = useClaimConditions(contract, tokenId, {
    withAllowList: true,
  });

  const transformedQueryData = useMemo(() => {
    return (claimsConditionQuery.data || [])
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
      }))
      .filter((phase) => phase.maxClaimableSupply !== "0");
  }, [claimsConditionQuery.data]);

  const isFetchingData =
    claimsConditionQuery.isFetching || setClaimsConditionQuery.isLoading;

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

  const addPhase = () => {
    append({
      ...DEFAULT_PHASE,
      metadata: { name: `Phase ${fields.length + 1}` },
    });
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
    const category = isErc20 ? "token" : "NFT";

    trackEvent({
      category,
      action: "set-claim-conditions",
      label: "attempt",
    });

    try {
      await setClaimsConditionQuery.mutateAsync({
        phases: d.phases as ClaimConditionInput[],
        reset: resetFlag,
      });
      trackEvent({
        category,
        action: "set-claim-conditions",
        label: "success",
      });
      saveClaimPhaseNotification.onSuccess();
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
        <Flex
          direction={"column"}
          gap={8}
          px={isColumn ? 6 : { base: 6, md: 10 }}
        >
          {controlledFields.map((field, index) => {
            const dropType: DropType = field.snapshot
              ? isClaimPhaseV1
                ? "specific"
                : field.maxClaimablePerWallet?.toString() === "0"
                ? "specific"
                : "overrides"
              : "any";

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

                {/* Show the reason why the form is disabled */}
                {!isAdmin && (
                  <Text>
                    Connect with admin wallet to edit claim conditions
                  </Text>
                )}

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
                  }}
                >
                  <Card position="relative">
                    <Flex direction="column" gap={8}>
                      <Flex align="flex-start" justify="space-between">
                        {/* Phase Name Input / Form Title */}
                        {isMultiPhase ? (
                          <PhaseNameInput />
                        ) : (
                          <Heading size="label.lg">Claim Conditions</Heading>
                        )}

                        {/* Delete Phase */}
                        <AdminOnly contract={contract as ValidContractInstance}>
                          <IconButton
                            position="absolute"
                            top="8px"
                            right="8px"
                            size="sm"
                            variant="ghost"
                            aria-label="Delete Claim Phase"
                            colorScheme="red"
                            icon={<Icon as={FiTrash} />}
                            isDisabled={setClaimsConditionQuery.isLoading}
                            onClick={() => {
                              removePhase(index);
                              if (!isMultiPhase) {
                                setResetFlag(true);
                              }
                            }}
                          />
                        </AdminOnly>
                      </Flex>

                      <CustomFormGroup>
                        <PhaseStartTimeInput />
                        <MaxClaimableSupplyInput />
                      </CustomFormGroup>

                      <CustomFormGroup>
                        <ClaimPriceInput />
                        <CurrencySelection />
                      </CustomFormGroup>

                      <ClaimerSelection />

                      <CustomFormGroup>
                        <MaxClaimablePerWalletInput />
                        {isClaimPhaseV1 ? (
                          <WaitingTimeInput />
                        ) : (
                          <Box
                            w="100%"
                            display={{ base: "none", md: "block" }}
                          />
                        )}
                      </CustomFormGroup>
                    </Flex>
                  </Card>
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
                    ? "While no Claim Phase is defined no-one will be able to claim this drop."
                    : "While no Claim Conditions are defined no-one will be able to claim this drop."}
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          {/* Add Claim Phase */}
          <AdminOnly contract={contract as ValidContractInstance}>
            {isMultiPhase ? (
              <Button
                colorScheme={phases?.length > 0 ? "primary" : "purple"}
                variant={phases?.length > 0 ? "outline" : "solid"}
                borderRadius="md"
                leftIcon={<Icon as={FiPlus} />}
                onClick={addPhase}
                isDisabled={setClaimsConditionQuery.isLoading}
              >
                Add {phases?.length > 0 ? "Additional " : "Initial "}
                Claim Phase
              </Button>
            ) : (
              phases?.length === 0 && (
                <Button
                  colorScheme="purple"
                  variant="solid"
                  borderRadius="md"
                  leftIcon={<Icon as={FiPlus} />}
                  onClick={addPhase}
                  isDisabled={setClaimsConditionQuery.isLoading}
                >
                  Add Claim Condition
                </Button>
              )
            )}
          </AdminOnly>
        </Flex>

        {/* Save Claim Phases */}
        <AdminOnly
          contract={contract as ValidContractInstance}
          fallback={<Box pb={5} />}
        >
          <>
            <Divider />
            <TransactionButton
              colorScheme="primary"
              transactionCount={1}
              isDisabled={claimsConditionQuery.isLoading}
              type="submit"
              isLoading={setClaimsConditionQuery.isLoading}
              loadingText="Saving..."
              size="md"
              borderRadius="xl"
              borderTopLeftRadius="0"
              borderTopRightRadius="0"
            >
              Save Claim Phases
            </TransactionButton>
          </>
        </AdminOnly>
      </Flex>
    </>
  );
};
