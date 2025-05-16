import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get_engine_tx_status } from "../actions";
import type { EngineTxStatus } from "../types";

export function useEngineTxStatus(queueId: string | undefined) {
  return useQuery({
    queryKey: ["engineTxStatus", queueId],
    queryFn: async () => {
      if (!queueId) throw new Error("No queue ID provided");
      const res = await get_engine_tx_status(queueId);

      let txStatus: EngineTxStatus;
      switch (res.status) {
        case "QUEUED": {
          txStatus = {
            queueId: queueId,
            status: "queued",
            chainId: res.chain.id.toString(),
            transactionHash: null,
            queuedAt: res.createdAt,
            sentAt: null,
            minedAt: null,
            cancelledAt: null,
          };
          break;
        }
        case "SUBMITTED": {
          txStatus = {
            queueId: queueId,
            status: "sent",
            chainId: res.chain.id.toString(),
            transactionHash: null,
            queuedAt: res.createdAt,
            sentAt: res.createdAt,
            minedAt: null,
            cancelledAt: null,
          };
          break;
        }
        case "CONFIRMED": {
          txStatus = {
            queueId: queueId,
            status: "mined",
            chainId: res.chain.id.toString(),
            transactionHash: res.transactionHash,
            queuedAt: res.createdAt,
            sentAt: res.confirmedAt,
            minedAt: res.confirmedAt,
            cancelledAt: null,
          };
          break;
        }
        case "FAILED": {
          txStatus = {
            queueId: queueId,
            status: "errored",
            chainId: res.chain.id.toString(),
            transactionHash: null,
            queuedAt: res.createdAt,
            sentAt: null,
            minedAt: null,
            cancelledAt: res.cancelledAt,
          };
          break;
        }
        default: {
          throw new Error(`Unknown engine tx status: ${res}`);
        }
      }

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
