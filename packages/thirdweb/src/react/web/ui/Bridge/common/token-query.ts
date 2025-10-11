import { useQuery } from "@tanstack/react-query";
import type { TokenWithPrices } from "../../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getToken } from "../../../../../pay/convert/get-token.js";

type TokenQueryResult =
  | { type: "success"; token: TokenWithPrices }
  | {
      type: "unsupported_token";
    };

export function useTokenQuery(params: {
  tokenAddress: string | undefined;
  chainId: number | undefined;
  client: ThirdwebClient;
}) {
  return useQuery({
    enabled: !!params.chainId,
    queryFn: async (): Promise<TokenQueryResult> => {
      if (!params.chainId) {
        throw new Error("Chain ID is required");
      }
      const tokenAddress = params.tokenAddress || NATIVE_TOKEN_ADDRESS;
      const token = await getToken(
        params.client,
        tokenAddress,
        params.chainId,
      ).catch((err) => {
        err.message.includes("not supported") ? undefined : Promise.reject(err);
      });

      if (!token) {
        return {
          type: "unsupported_token",
        };
      }

      return {
        token: token,
        type: "success",
      };
    },
    queryKey: ["bridge.getToken", params],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
