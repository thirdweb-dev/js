export type Agent = {
  id: string;
  name: string;
  description: string;
  model_name: string;
  is_public: boolean;
  context: {
    chain_ids: number[];
    chain_type: string;
    automatic_execution: boolean;
  };
  prompts: Prompt[];
  tools: AgentTool[];
  triggers: AgentTrigger[];
  memories: Memory[];
  wallets: Wallet[];
  created_at: string;
  updated_at: string;
};

export type AgentTriggerType = "continuous" | "time";

export type AgentTrigger = {
  id: string;
  name: string;
  type: AgentTriggerType;
  data: {
    [key: string]: unknown;
  };
  prompts: Prompt[];
  is_paused: boolean;
  created_at: string;
  updated_at: string;
};

export type AgentTool = {
  id: string;
  name: string;
  description: string;
  data: {
    type: "mcp";
    config: {
      [key: string]: unknown;
    };
  };
  created_at: string;
  updated_at: string;
};

export type Memory = {
  id: string;
};

export type Model = {
  id: string;
  created: number;
  owned_by: string;
};

export type Prompt = {
  role: string;
  content: string;
};

export type WalletType = "eoa" | "server" | "eip4337" | "eip7702";

export type Wallet = {
  id: string;
  type: WalletType;
  address: string;
  data: {
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
};

/**************************
 * API Requests/Responses *
 **************************/

/** Agents */

export type GetAgentsResponse = {
  result: Agent[];
};

export type GetAgentResponse = {
  result: Agent;
};

export type CreateAgentRequest = Omit<
  Agent,
  "id" | "created_at" | "updated_at" | "model_name" | "memories" | "wallets"
>;

export type CreateAgentResponse = {
  result: Agent;
};

export type UpdateAgentRequest = Pick<
  Agent,
  "name" | "description" | "is_public" | "prompts"
>;

export type UpdateAgentResponse = {
  result: Agent;
};

export type DeleteAgentResponse = {
  result: string;
};

/** Agent Triggers */
export type GetAgentTriggerResponse = {
  result: AgentTrigger;
};

export type CreateAgentTriggerRequest = Omit<
  AgentTrigger,
  "id" | "created_at" | "updated_at"
>;

export type CreateAgentTriggerResponse = {
  result: AgentTrigger;
};

export type UpdateAgentTriggerRequest = Pick<
  AgentTrigger,
  "name" | "data" | "is_paused" | "prompts"
>;

export type UpdateAgentTriggerResponse = {
  result: AgentTrigger;
};

export type DeleteAgentTriggerResponse = {
  result: string;
};

/** Agent Tools */
export type GetAgentToolResponse = {
  result: AgentTool;
};

export type CreateAgentToolRequest = Omit<
  AgentTool,
  "id" | "created_at" | "updated_at"
>;

export type CreateAgentToolResponse = {
  result: AgentTool;
};

export type UpdateAgentToolRequest = Pick<
  AgentTool,
  "name" | "description" | "data"
>;

export type UpdateAgentToolResponse = {
  result: AgentTool;
};

export type DeleteAgentToolResponse = {
  result: string;
};

/** Agent Wallets */
export type GetAgentWalletsResponse = {
  result: Wallet[];
};

export type GetAgentWalletResponse = {
  result: Wallet;
};
