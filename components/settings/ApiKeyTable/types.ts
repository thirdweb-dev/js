export enum DrawerSection {
  General,
  Services,
}

export interface ApiKeyFormServiceValues {
  name: string;
  targetAddresses: string;
  enabled?: boolean;
  actions: string[];
}

export interface ApiKeyFormValues {
  name: string;
  domains: string;
  walletAddresses?: string;
  services?: ApiKeyFormServiceValues[];
}
