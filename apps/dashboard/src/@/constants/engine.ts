export type EngineBackendWalletType =
  | "local"
  | "aws-kms"
  | "gcp-kms"
  | "circle"
  | "smart:local"
  | "smart:aws-kms"
  | "smart:gcp-kms"
  | "smart:circle";

export const EngineBackendWalletOptions: {
  key: EngineBackendWalletType;
  name: string;
}[] = [
  { key: "local", name: "Local" },
  { key: "aws-kms", name: "AWS KMS" },
  { key: "gcp-kms", name: "Google Cloud KMS" },
  { key: "circle", name: "Circle" },
  { key: "smart:local", name: "Smart (Local)" },
  { key: "smart:aws-kms", name: "Smart (AWS KMS)" },
  { key: "smart:gcp-kms", name: "Smart (Google Cloud KMS)" },
  { key: "smart:circle", name: "Smart Circle" },
];
