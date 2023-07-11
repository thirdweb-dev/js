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

// FIXME: Extract these into lib
export type ThirdwebServiceName = "bundler" | "rpc" | "storage";

export interface ThirdwebServiceAction {
  name: string;
  title: string;
  description?: string;
}

export interface ThirdwebService {
  name: ThirdwebServiceName;
  title: string;
  description?: string;
  actions: ThirdwebServiceAction[];
}
