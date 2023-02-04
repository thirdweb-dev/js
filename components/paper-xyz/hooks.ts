import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import {
  ChainId,
  useAddress,
  useSDK,
  useSDKChainId,
} from "@thirdweb-dev/react";
import invariant from "tiny-invariant";

export const PAPER_CHAIN_ID_MAP = {
  [ChainId.Mainnet]: "Ethereum",
  [ChainId.Goerli]: "Goerli",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Mumbai]: "Mumbai",
  [ChainId.Avalanche]: "Avalanche",
} as const;

const queryKey = (
  contractAddress: string,
  paperChain: (typeof PAPER_CHAIN_ID_MAP)[keyof typeof PAPER_CHAIN_ID_MAP],
) => ["paperxyz", paperChain, contractAddress, "register"];

export function usePaperContractQuery(jwt: string, contractAddress?: string) {
  const sdk = useSDK();
  const chainId = useSDKChainId();
  const paperChain =
    PAPER_CHAIN_ID_MAP[chainId as keyof typeof PAPER_CHAIN_ID_MAP];
  return useQuery(
    queryKey(contractAddress || "", paperChain),
    async () => {
      invariant(sdk?.auth, "SDK not initialized");
      invariant(paperChain, "unsupported chain id");
      invariant(contractAddress, "contract address required");

      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer id:${jwt}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `/api/paper/register?contractAddress=${contractAddress}&chain=${paperChain}`,
        options,
      );

      return (await response.json()) || null;
    },
    { enabled: !!sdk && !!contractAddress && !!paperChain && !!jwt },
  );
}

export function usePaperRegisterContractMutation(
  jwt: string,
  contractAddress?: string,
) {
  const sdk = useSDK();
  const chainId = useSDKChainId();
  const queryClient = useQueryClient();
  const paperChain =
    PAPER_CHAIN_ID_MAP[chainId as keyof typeof PAPER_CHAIN_ID_MAP];
  const address = useAddress();
  const auth = new ThirdwebAuth(address, "thirdweb.paper.xyz");
  return useMutation(
    async () => {
      invariant(sdk?.auth, "SDK not initialized");
      invariant(paperChain, "unsupported chain id");
      invariant(contractAddress, "contract address required");

      const loginPayload = await auth.login();

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer id:${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress,
          chain: paperChain,
          loginPayload,
        }),
      };

      const response = await fetch("/api/paper/register", options);

      return await response.json();
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          queryKey(contractAddress || "", paperChain),
        );
      },
    },
  );
}
