import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getFunctionId } from "../../../utils/function-id.js";
import { getWalletInfo } from "../../../wallets/__generated__/getWalletInfo.js";
import type { WalletId } from "../../../wallets/wallet-types.js";
import { useWalletContext } from "../wallet/provider.js";

/**
 * @internal
 */
export function useWalletName(props: {
  formatFn?: (str: string) => string;
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">;
}) {
  const { id } = useWalletContext();
  const nameQuery = useQuery({
    queryFn: async () => fetchWalletName({ formatFn: props.formatFn, id }),
    queryKey: getQueryKeys({ formatFn: props.formatFn, id }),
    ...props.queryOptions,
  });
  return nameQuery;
}

/**
 * @internal Exported for tests only
 */
export function getQueryKeys(props: {
  id: WalletId;
  formatFn?: (str: string) => string;
}) {
  if (typeof props.formatFn === "function") {
    return [
      "walletName",
      props.id,
      { resolver: getFunctionId(props.formatFn) },
    ] as const;
  }
  return ["walletName", props.id] as const;
}

/**
 * @internal Exported for tests only
 */
export async function fetchWalletName(props: {
  id: WalletId;
  formatFn?: (str: string) => string;
}) {
  const info = await getWalletInfo(props.id);
  if (typeof props.formatFn === "function") {
    return props.formatFn(info.name);
  }
  return info.name;
}
