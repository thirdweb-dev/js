export const API_URL = `https://${process.env.NEXT_PUBLIC_API_URL || "api.thirdweb.com"}`;

type NebulaUserMessageContentItem =
  | {
      type: "image";
      image_url: string | null;
      b64: string | null;
    }
  | {
      type: "text";
      text: string;
    }
  | {
      type: "transaction";
      transaction_hash: string;
      chain_id: number;
    };

type NebulaUserMessageContent = NebulaUserMessageContentItem[];

export type NebulaUserMessage = {
  role: "user";
  content: NebulaUserMessageContent;
};

export type NebulaTxData = {
  chain_id: number;
  data: `0x${string}`;
  to: string;
  value: string;
};

export type NebulaContext = {
  chainIds: string[] | null;
  walletAddress: string | null;
  sessionId: string | null;
  autoExecuteTransactions?: boolean;
};

export type NebulaSwapData = {
  action: string;
  transaction: {
    chain_id: number;
    to: `0x${string}`;
    data: `0x${string}`;
    value: string;
  };
  intent: {
    amount: string;
    destinationChainId: number;
    destinationTokenAddress: `0x${string}`;
    originChainId: number;
    originTokenAddress: `0x${string}`;
    receiver: `0x${string}`;
    sender: `0x${string}`;
  };
};

// Simplified types for the playground version
export type WalletMeta = {
  walletId: string;
  address: string;
};

export type ChatMessage =
  | {
      type: "user";
      content: NebulaUserMessageContent;
    }
  | {
      text: string;
      type: "error";
    }
  | {
      texts: string[];
      type: "presence";
    }
  | {
      // assistant type message loaded from history doesn't have request_id
      request_id: string | undefined;
      text: string;
      type: "assistant";
    }
  | {
      type: "action";
      subtype: "sign_transaction";
      request_id: string;
      data: NebulaTxData;
    }
  | {
      type: "action";
      subtype: "sign_swap";
      request_id: string;
      data: NebulaSwapData;
    }
  | {
      type: "image";
      request_id: string;
      data: {
        width: number;
        height: number;
        url: string;
      };
    };
