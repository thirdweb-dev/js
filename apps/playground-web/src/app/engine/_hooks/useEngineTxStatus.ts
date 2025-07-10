import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get_engine_tx_status } from "../actions";
import type { EngineTxStatus } from "../types";

export function useEngineTxStatus(queueId: string | undefined) {
  return useQuery({
    enabled: !!queueId,
    queryFn: async () => {
      if (!queueId) throw new Error("No queue ID provided");
      const res = await get_engine_tx_status(queueId);

      let txStatus: EngineTxStatus;
      switch (res.status) {
        case "QUEUED": {
          txStatus = {
            cancelledAt: null,
            chainId: res.chain.id.toString(),
            minedAt: null,
            queuedAt: res.createdAt,
            queueId: queueId,
            sentAt: null,
            status: "queued",
            transactionHash: null,
          };
          break;
        }
        case "SUBMITTED": {
          txStatus = {
            cancelledAt: null,
            chainId: res.chain.id.toString(),
            minedAt: null,
            queuedAt: res.createdAt,
            queueId: queueId,
            sentAt: res.createdAt,
            status: "sent",
            transactionHash: null,
          };
          break;
        }
        case "CONFIRMED": {
          txStatus = {
            cancelledAt: null,
            chainId: res.chain.id.toString(),
            minedAt: res.confirmedAt,
            queuedAt: res.createdAt,
            queueId: queueId,
            sentAt: res.confirmedAt,
            status: "mined",
            transactionHash: res.transactionHash,
          };
          break;
        }
        case "FAILED": {
          txStatus = {
            cancelledAt: res.cancelledAt,
            chainId: res.chain.id.toString(),
            minedAt: null,
            queuedAt: res.createdAt,
            queueId: queueId,
            sentAt: null,
            status: "errored",
            transactionHash: null,
          };
          break;
        }
        default: {
          throw new Error(`Unknown engine tx status: ${res}`);
        }
      }

      return txStatus;
    },
    queryKey: ["engineTxStatus", queueId],
    refetchInterval(query) {
      const status = query.state.data?.status;
      const isFinalStatus =
        status === "mined" || status === "errored" || status === "cancelled";

      return isFinalStatus ? false : 2000;
    },
    retry: false,
    staleTime: 0,
  });
}

export function useOptimisticallyUpdateEngineTxStatus() {
  const queryClient = useQueryClient();

  return (params: { chainId: number; queueId: string }) => {
    queryClient.setQueryData(["engineTxStatus", params.queueId], {
      cancelledAt: null,
      chainId: params.chainId.toString(),
      minedAt: null,
      queuedAt: new Date().toISOString(),
      queueId: params.queueId,
      sentAt: null,
      status: "queued",
      transactionHash: null,
    } satisfies EngineTxStatus);
  };
}
