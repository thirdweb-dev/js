interface BaseCredentialFormData {
  type: string;
  label: string;
}

type CircleCredentialFormData = BaseCredentialFormData & {
  type: "circle";
  entitySecret: string;
};

type CircleCredentialUpdateFormData = BaseCredentialFormData & {
  type: "circle";
  entitySecret?: string;
};

export type CredentialFormData = CircleCredentialFormData;
export type CredentialUpdateFormData = CircleCredentialUpdateFormData;

export const CREDENTIAL_TYPE_OPTIONS = [
  { label: "Circle", value: "circle" },
] as const;

export type CredentialType = (typeof CREDENTIAL_TYPE_OPTIONS)[number]["value"];
