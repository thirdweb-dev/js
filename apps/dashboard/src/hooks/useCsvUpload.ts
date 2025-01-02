import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { type ThirdwebClient, ZERO_ADDRESS, isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { csvMimeTypes } from "utils/batch";
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
      resolvedAddress: address,
      isValid: false,
      ...rest,
    };
  }
  let isValid = true;
  let resolvedAddress = address;
  try {
    resolvedAddress = isAddress(address)
      ? address
      : await resolveAddress({ name: address, client: props.thirdwebClient });
    isValid = !!resolvedAddress;
  } catch {
    isValid = false;
  }
  return {
    address,
    resolvedAddress,
    isValid,
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
  const thirdwebClient = useThirdwebClient();
  const [rawData, setRawData] = useState<
    T[] | Array<T & { [key in string]: unknown }>
  >(props.defaultRawData || []);
  const [noCsv, setNoCsv] = useState(false);
  const reset = useCallback(() => {
    setRawData([]);
    setNoCsv(false);
  }, []);
  const onDrop = useCallback<Required<DropzoneOptions>["onDrop"]>(
    (acceptedFiles) => {
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
        header: true,
        complete: (results) => {
          const data = props.csvParser(results.data as T[]);
          if (!data[0]?.address) {
            setNoCsv(true);
            return;
          }
          setRawData(data);
        },
      });
    },
    [props.csvParser],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const normalizeQuery = useQuery({
    queryKey: ["snapshot-check-isAddress", rawData],
    queryFn: async () => {
      const limit = pLimit(50);
      const results = await Promise.all(
        rawData.map((item) => {
          return limit(() => checkIsAddress({ item: item, thirdwebClient }));
        }),
      );
      return {
        result: processAirdropData(results),
        invalidFound: !!results.find((item) => !item?.isValid),
      };
    },
    retry: false,
  });

  const removeInvalid = useCallback(() => {
    const filteredData = normalizeQuery.data?.result.filter(
      ({ isValid }) => isValid,
    );
    // double type assertion is save here because we don't really use this variable (only check for its length)
    // Also filteredData's type is the superset of T[]
    setRawData(filteredData as unknown as T[]);
  }, [normalizeQuery.data?.result]);
  return {
    normalizeQuery,
    getInputProps,
    getRootProps,
    isDragActive,
    rawData,
    noCsv,
    reset,
    removeInvalid,
  };
}
