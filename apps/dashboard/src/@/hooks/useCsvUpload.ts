import { useQuery, useQueryClient } from "@tanstack/react-query";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { isAddress, type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { csvMimeTypes } from "@/utils/batch";

/**
 * Validate if the item.address is a valid ethereum address
 * Take in an { address: string, ...rest } object and return a new object, with 2 new props: `isValid` and `resolvedAddress`
 */
async function checkIsAddress<T extends { address: string }>(props: {
  item: T;
  thirdwebClient: ThirdwebClient;
  allowZeroAddress?: boolean;
}): Promise<
  { address: string; resolvedAddress: string; isValid: boolean } & Omit<
    T,
    "address"
  >
> {
  const { address, ...rest } = props.item;
  if (!props.allowZeroAddress && address === ZERO_ADDRESS) {
    // Sending tokens to the zero address will result in an error
    // if user wants to burn, they should use the Burn tab
    return {
      address,
      isValid: false,
      resolvedAddress: address,
      ...rest,
    };
  }
  let isValid = true;
  let resolvedAddress = address;
  try {
    resolvedAddress = isAddress(address)
      ? address
      : await resolveAddress({ client: props.thirdwebClient, name: address });
    isValid = !!resolvedAddress;
  } catch {
    isValid = false;
  }
  return {
    address,
    isValid,
    resolvedAddress,
    ...rest,
  };
}

/**
 * Take in an array of useQuery results (from calling `checkIsAddress`)
 * and filter out the `undefined`, then move the invalid records on top
 */
function processAirdropData<
  T extends {
    address: string;
    resolvedAddress: string;
    isValid: boolean;
  } & Omit<T, "address">,
>(data: (T | undefined)[]): T[] {
  const seen = new Set();
  const filteredData = data
    .filter((o) => o !== undefined)
    .filter((el) => {
      const duplicate = seen.has(el.resolvedAddress);
      seen.add(el.resolvedAddress);
      return !duplicate;
    });
  const valid = filteredData.filter(({ isValid }) => isValid);
  const invalid = filteredData.filter(({ isValid }) => !isValid);
  // Make sure the invalid records are at the top so that users can see
  const ordered = [...invalid, ...valid];
  return ordered;
}

type Props<T> = {
  /**
   * Process the data after getting parsed by Papaparse
   * mostly for trimming the strings
   */
  csvParser: (items: T[]) => T[];
  defaultRawData?: T[] | undefined;
  client: ThirdwebClient;
};

/**
 * This hook is used in:
 * - Uploading csv as an ERC1155 airdrop list
 * - Upload csv for ERC20, 721 and 1155 claim condition snapshots
 * - and more in the future
 */
export function useCsvUpload<
  // Always gonna need the wallet address
  T extends { address: string },
>(props: Props<T>) {
  const queryClient = useQueryClient();
  const [rawData, setRawData] = useState<
    T[] | Array<T & { [key in string]: unknown }>
  >(props.defaultRawData || []);
  const [noCsv, setNoCsv] = useState(false);
  const reset = useCallback(() => {
    setRawData([]);
    setNoCsv(false);
  }, []);

  const setFiles = useCallback(
    (acceptedFiles: File[]) => {
      setNoCsv(false);
      const csv = acceptedFiles.find(
        (f) => csvMimeTypes.includes(f.type) || f.name?.endsWith(".csv"),
      );
      if (!csv) {
        console.error(
          "No valid CSV file found, make sure you have an address column.",
        );
        setNoCsv(true);
        return;
      }
      Papa.parse(csv, {
        complete: (results) => {
          try {
            const data = props.csvParser(results.data as T[]);
            if (!data[0]?.address) {
              setNoCsv(true);
              return;
            }
            setRawData(data);
          } catch (error) {
            console.error(error);
            setNoCsv(true);
          }
        },
        header: true,
      });
    },
    [props.csvParser],
  );

  const [normalizeProgress, setNormalizeProgress] = useState({
    total: 0,
    current: 0,
  });

  const normalizeQuery = useQuery({
    queryFn: async () => {
      const batchSize = 50;
      const results = [];
      for (let i = 0; i < rawData.length; i += batchSize) {
        const batch = rawData.slice(i, i + batchSize);
        setNormalizeProgress({
          total: rawData.length,
          current: i,
        });
        const batchResults = await Promise.all(
          batch.map((item) =>
            checkIsAddress({ item: item, thirdwebClient: props.client }),
          ),
        );
        results.push(...batchResults);
      }

      return {
        invalidFound: !!results.find((item) => !item?.isValid),
        result: processAirdropData(results),
      };
    },
    queryKey: ["snapshot-check-isAddress", rawData],
    retry: false,
  });

  const removeInvalid = useCallback(() => {
    const filteredData = normalizeQuery.data?.result.filter(
      (d) => d.isValid && d.resolvedAddress !== ZERO_ADDRESS,
    );

    if (filteredData && normalizeQuery.data) {
      // Directly update the query result instead of setting new state to avoid triggering refetch
      queryClient.setQueryData(["snapshot-check-isAddress", rawData], {
        ...normalizeQuery.data,
        result: filteredData,
        invalidFound: false, // Since we removed all invalid items
      });
    }
  }, [normalizeQuery.data, queryClient, rawData]);

  const processData = useCallback(
    (data: T[]) => {
      setNoCsv(false);
      const processedData = props.csvParser(data);
      if (!processedData[0]?.address) {
        setNoCsv(true);
        return;
      }
      setRawData(processedData);
    },
    [props.csvParser],
  );

  return {
    noCsv,
    normalizeQuery,
    processData,
    rawData,
    removeInvalid,
    reset,
    setFiles,
    normalizeProgress,
  };
}
