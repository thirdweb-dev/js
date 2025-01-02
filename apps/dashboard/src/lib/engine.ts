export type EngineBackendWalletType =
  | "local"
  | "aws-kms"
  | "gcp-kms"
  | "smart:local"
  | "smart:aws-kms"
  | "smart:gcp-kms";

export const EngineBackendWalletOptions: {
  key: EngineBackendWalletType;
  name: string;
}[] = [
  { key: "local", name: "Local" },
  { key: "aws-kms", name: "AWS KMS" },
  { key: "gcp-kms", name: "Google Cloud KMS" },
  { key: "smart:local", name: "Smart (Local)" },
  { key: "smart:aws-kms", name: "Smart (AWS KMS)" },
  { key: "smart:gcp-kms", name: "Smart (Google Cloud KMS)" },
];
