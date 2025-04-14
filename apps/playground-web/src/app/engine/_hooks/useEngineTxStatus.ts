import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get_engine_tx_status } from "../actions";
import type { EngineTxStatus } from "../types";

export function useEngineTxStatus(queueId: string | undefined) {
  return useQuery({
    queryKey: ["engineTxStatus", queueId],
    queryFn: async () => {
      if (!queueId) throw new Error("No queue ID provided");
      const res = await get_engine_tx_status(queueId);

      const txStatus: EngineTxStatus = {
        queueId: queueId,
        status: res.result.status,
        chainId: res.result.chainId,
        transactionHash: res.result.transactionHash,
        queuedAt: res.result.queuedAt,
        sentAt: res.result.sentAt,
        minedAt: res.result.minedAt,
        cancelledAt: res.result.cancelledAt,
      };

      return txStatus;
    },
    enabled: !!queueId,
    refetchInterval(query) {
      const status = query.state.data?.status;
      const isFinalStatus =
        status === "mined" || status === "errored" || status === "cancelled";

      return isFinalStatus ? false : 2000;
    },
    staleTime: 0,
    retry: false,
  });
}

export function useOptimisticallyUpdateEngineTxStatus() {
  const queryClient = useQueryClient();

  return (params: {
    chainId: number;
    queueId: string;
  }) => {
    queryClient.setQueryData(["engineTxStatus", params.queueId], {
      status: "queued",
      chainId: params.chainId.toString(),
      queueId: params.queueId,
      transactionHash: null,
      queuedAt: new Date().toISOString(),
      sentAt: null,
      minedAt: null,
      cancelledAt: null,
    } satisfies EngineTxStatus);
  };
}
