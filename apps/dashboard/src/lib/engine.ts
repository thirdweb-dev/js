export type EngineBackendWalletType = "local" | "aws-kms" | "gcp-kms";

export const EngineBackendWalletOptions: {
  key: EngineBackendWalletType;
  name: string;
}[] = [
  { key: "local", name: "Local" },
  { key: "aws-kms", name: "AWS KMS" },
  { key: "gcp-kms", name: "Google Cloud KMS" },
];
