import {
  createSOLQueryKeyWithNetwork,
  neverPersist,
} from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useSDK } from "../../providers/base";
import { programAccountTypeQuery } from "./useProgramAccountType";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  NFTCollection,
  NFTDrop,
  ThirdwebSDK,
  Token,
} from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

type ProgramMap = Readonly<{
  "nft-collection": NFTCollection;
  "nft-drop": NFTDrop;
  token: Token;
}>;

type ProgramType = keyof ProgramMap;

export type ValidProgram = NFTCollection | NFTDrop | Token;

export function programQuery<
  TProgram extends ValidProgram,
  TProgramType extends ProgramType | undefined = undefined,
>(
  queryClient: QueryClient,
  sdk: RequiredParam<ThirdwebSDK>,
  address: RequiredParam<string>,
  type?: TProgramType,
) {
  const network = sdk?.network;
  return {
    queryKey: neverPersist(
      createSOLQueryKeyWithNetwork(
        ["program-instance", address] as const,
        network || null,
      ),
    ),
    queryFn: (async () => {
      invariant(sdk, "sdk is required");
      invariant(address, "Address is required");
      // if the type is not passed in explicitly then we'll try to resolve it
      if (!type) {
        // why do we call `fetchQuery` here instead of calling the sdk directly?
        // while we can never persist the program itself to the cache we can persist the type!
        // (and this will be triggered by fetching the query on the queryClient)
        type = await queryClient.fetchQuery(
          programAccountTypeQuery(sdk, address),
        );
      }
      switch (type) {
        case "nft-collection":
          return await sdk.getNFTCollection(address);
        case "nft-drop":
          return await sdk.getNFTDrop(address);
        case "token":
          return await sdk.getToken(address);
        default:
          throw new Error("Unknown account type");
      }
      // this is the magic that makes the type inference work
    }) as () => Promise<
      TProgramType extends ProgramType ? ProgramMap[TProgramType] : TProgram
    >,
    enabled: !!sdk && !!network && !!address,
    // this cannot change as it is unique by address & network
    cacheTime: Infinity,
    staleTime: Infinity,
  };
}

/**
 * Get an SDK instance to interact with any program
 * @param address - the address of the program to get an interface for
 * @param type - optionally, pass in the program type to get static typing
 *
 * @example
 * ```jsx
 * import { useProgram } from "@thirdweb-dev/react/solana";
 *
 * export default function Component() {
 *   const program = useProgram("{{program_address}}");
 *
 *   // Now you can use the program in the rest of the component
 *
 *   // For example, we can make a transaction
 *   async function functionCall() {
 *     await program.call("mint", ...);
 *   }
 *
 *   ...
 * }
 * ```
 *
 * @public
 */
export function useProgram<
  TProgram extends ValidProgram,
  TProgramType extends ProgramType | undefined = undefined,
>(address: RequiredParam<string>, type?: TProgramType) {
  const queryClient = useQueryClient();
  const sdk = useSDK();
  return useQuery(
    programQuery<TProgram, TProgramType>(queryClient, sdk, address, type),
  );
}

export type UseProgramResult = ReturnType<typeof useProgram>;
