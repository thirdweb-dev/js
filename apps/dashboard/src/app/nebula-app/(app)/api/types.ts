interface BaseExecuteConfig {
  mode: "engine" | "session_key" | "webhook" | "client";
}

export interface EngineConfig extends BaseExecuteConfig {
  mode: "engine";
  engine_url: string;
  engine_authorization_token: string;
  engine_backend_wallet_address: string;
}

export interface SessionKeyConfig extends BaseExecuteConfig {
  mode: "session_key";
  smart_account_address: string;
  smart_account_factory_address: string;
  smart_account_session_key: string;
}

export interface WebhookConfig extends BaseExecuteConfig {
  mode: "webhook";
  webhook_signing_url: string;
  webhook_metadata?: Record<string, unknown>;
  webhook_shared_secret?: string;
}

interface ClientConfig extends BaseExecuteConfig {
  mode: "client";
  signer_wallet_address: string;
}

export type ExecuteConfig =
  | EngineConfig
  | SessionKeyConfig
  | WebhookConfig
  | ClientConfig;

export type SessionInfo = {
  account_id: string;
  archive_at: string | null;
  can_execute: boolean;
  execute_config: ExecuteConfig | null;
  created_at: string;
  deleted_at: string | null;
  history: Array<{
    role: "user" | "assistant"; // role: action is coming up
    content: string;
    timestamp: number;
  }> | null;
  id: string;
  updated_at: string;
  title: string | null;
  is_public: boolean;
  // memory: ???
};

export type TruncatedSessionInfo = {
  created_at: string;
  id: string;
  updated_at: string;
  title: string;
};
