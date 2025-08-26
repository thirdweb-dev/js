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
