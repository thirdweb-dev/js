"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Chain } from "thirdweb/chains";
import { getContract, resolveAbiFromContractApi } from "thirdweb/contract";

import type { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb/dist/types/client/client";
import {
  extractEventSignatures,
  extractFunctionSignatures,
  isValidAddress,
} from "../_utils/abi-utils";
import type {
  AbiData,
  AbiResponse,
  EventSignature,
  FunctionSignature,
  WebhookFormValues,
} from "../_utils/webhook-types";

interface UseAbiProcessingParams {
  form: ReturnType<typeof useForm<WebhookFormValues>>;
  isOpen: boolean;
  thirdwebClient: ThirdwebClient;
  chain?: Chain;
}

export function useAbiProcessing({
  form,
  isOpen,
  thirdwebClient,
  chain,
}: UseAbiProcessingParams) {
  const [eventSignatures, setEventSignatures] = useState<EventSignature[]>([]);
  const [functionSignatures, setFunctionSignatures] = useState<
    FunctionSignature[]
  >([]);

  const watchFilterType = form.watch("filterType") as
    | "event"
    | "transaction"
    | undefined;
  const selectedChainIds = form.watch("chainIds") || [];
  const contractAddresses = form.watch("addresses") || "";
  const toAddresses = form.watch("toAddresses") || "";

  const createAbiQueryKey = (
    chainIds: string[],
    addresses: string,
    type: "event" | "transaction",
  ) => {
    return ["fetchAbis", chainIds.join(","), addresses, type];
  };

  // Helper to show toast notifications based on ABI fetch results - memoized to avoid dependency issues
  const showAbiResultToasts = useCallback(
    (
      abis: Record<string, AbiData> = {},
      errors: Record<string, string> = {},
    ) => {
      const successCount = Object.keys(abis).length;
      const errorCount = Object.keys(errors).length;

      if (successCount > 0 && errorCount === 0) {
        toast.success(
          `Successfully fetched ABI for ${successCount} contract${successCount > 1 ? "s" : ""}`,
        );
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(
          `Fetched ABI for ${successCount} contract${successCount > 1 ? "s" : ""}, but failed for ${errorCount}`,
        );
      } else if (successCount === 0 && errorCount > 0) {
        toast.error(
          `Failed to fetch ABI for ${errorCount} contract${errorCount > 1 ? "s" : ""}`,
        );
      }
    },
    [],
  );

  // Query for event ABIs
  const { data: fetchedEventAbiData, isFetching: isFetchingEventAbi } =
    useQuery<AbiResponse | null, Error>({
      queryKey: createAbiQueryKey(selectedChainIds, contractAddresses, "event"),
      queryFn: async () => {
        const trimmedAddresses = contractAddresses.trim();
        if (!trimmedAddresses) return null;

        // Split by commas and clean up whitespace
        const addresses = trimmedAddresses
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean);

        // Validate addresses
        const invalidAddresses = addresses.filter(
          (addr) => !isValidAddress(addr),
        );
        if (invalidAddresses.length > 0) {
          return null;
        }

        // Extract chain ID from selected chains
        const watchChainId = selectedChainIds[0];
        if (!watchChainId) {
          return null;
        }

        // Create new object to store results
        const abis: Record<string, AbiData> = {};
        const errors: Record<string, string> = {};

        try {
          // For each address, try to fetch ABI
          for (const address of addresses) {
            try {
              if (!chain) {
                throw new Error("No chain ID selected");
              }

              // Use thirdweb SDK v5 to fetch the ABI
              const contract = getContract({
                client: thirdwebClient,
                address: address,
                chain: chain as Chain,
              });

              // Fetch the ABI using the contract API
              const abi = await resolveAbiFromContractApi(contract);

              // Store the fetched ABI in our results object
              abis[address] = {
                fetchedAt: new Date().toISOString(),
                status: "success",
                abi: abi,
                // Extract event names for UI display
                events: abi
                  .filter((item) => item.type === "event")
                  .map((event) => event.name),
              };
            } catch (err) {
              console.error(`Error fetching ABI for ${address}:`, err);
              errors[address] = "Could not fetch ABI";
            }
          }
        } catch (err) {
          console.error("Error fetching ABIs:", err);
        }

        // Return both successful ABIs and any errors
        return { abis, errors };
      },
      enabled:
        isOpen &&
        !!contractAddresses.trim() &&
        selectedChainIds.length > 0 &&
        watchFilterType === "event",
      staleTime: Number.POSITIVE_INFINITY, // Cache forever until explicitly invalidated
    });

  // Query for transaction ABIs
  const { data: fetchedTxAbiData, isFetching: isFetchingTxAbi } = useQuery<
    AbiResponse | null,
    Error
  >({
    queryKey: createAbiQueryKey(selectedChainIds, toAddresses, "transaction"),
    queryFn: async () => {
      const trimmedAddresses = toAddresses.trim();
      if (!trimmedAddresses) return null;

      const addresses = trimmedAddresses
        .split(",")
        .map((addr) => addr.trim())
        .filter(Boolean);

      const invalidAddresses = addresses.filter(
        (addr) => !isValidAddress(addr),
      );
      if (invalidAddresses.length > 0) {
        return null;
      }

      const watchChainId = selectedChainIds[0];
      if (!watchChainId) {
        return null;
      }

      // Create new object to store results
      const abis: Record<string, AbiData> = {};
      const errors: Record<string, string> = {};

      try {
        // For each address, try to fetch ABI
        for (const address of addresses) {
          try {
            if (!chain) {
              throw new Error("No chain ID selected");
            }

            const contract = getContract({
              client: thirdwebClient,
              address: address,
              chain: chain as Chain,
            });

            // Fetch the ABI using the contract API
            const abi = await resolveAbiFromContractApi(contract);

            // Store the fetched ABI in our results object
            abis[address] = {
              fetchedAt: new Date().toISOString(),
              status: "success",
              abi: abi,
              // Extract function names for UI display
              functions: abi
                .filter((item) => item.type === "function")
                .map((func) => func.name),
            };
          } catch (err) {
            console.error(`Error fetching ABI for ${address}:`, err);
            errors[address] = "Could not fetch ABI";
          }
        }
      } catch (err) {
        console.error("Error fetching ABIs:", err);
      }

      return { abis, errors };
    },
    enabled:
      isOpen &&
      !!toAddresses.trim() &&
      selectedChainIds.length > 0 &&
      watchFilterType === "transaction",
    staleTime: Number.POSITIVE_INFINITY, // Cache forever until explicitly invalidated
  });

  // Process event ABI data
  useQuery({
    queryKey: ["process-event-abis", fetchedEventAbiData],
    queryFn: () => {
      if (!fetchedEventAbiData) return null;

      form.setValue("abiData", Object.values(fetchedEventAbiData.abis));

      const signatures = extractEventSignatures(
        Object.values(fetchedEventAbiData.abis),
      );
      setEventSignatures(signatures);

      showAbiResultToasts(fetchedEventAbiData.abis, fetchedEventAbiData.errors);

      return null;
    },
    enabled: !!fetchedEventAbiData,
  });

  // Process transaction ABI data
  useQuery({
    queryKey: ["process-tx-abis", fetchedTxAbiData],
    queryFn: () => {
      if (!fetchedTxAbiData) return null;

      form.setValue("abiData", Object.values(fetchedTxAbiData.abis));

      const signatures = extractFunctionSignatures(
        Object.values(fetchedTxAbiData.abis),
      );
      setFunctionSignatures(signatures);

      showAbiResultToasts(fetchedTxAbiData.abis, fetchedTxAbiData.errors);

      return null;
    },
    enabled: !!fetchedTxAbiData,
  });

  const fetchedAbis = fetchedEventAbiData?.abis || {};
  const abiErrors = fetchedEventAbiData?.errors || {};

  const fetchedTxAbis = fetchedTxAbiData?.abis || {};
  const txAbiErrors = fetchedTxAbiData?.errors || {};

  const resetAbiState = () => {
    setEventSignatures([]);
    setFunctionSignatures([]);
  };

  return {
    eventSignatures,
    functionSignatures,
    fetchedAbis,
    abiErrors,
    fetchedTxAbis,
    txAbiErrors,
    isFetchingEventAbi,
    isFetchingTxAbi,
    resetAbiState,
  };
}
