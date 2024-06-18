import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import type { ComponentType } from "react";

export type EnhancedRoute<T = any> = {
  title: string;
  path: string;
  isDefault?: true;
  isBeta?: true;
  isDeprecated?: true;
  isEnabled?: ExtensionDetectedState;
  component: ComponentType<T>;
};

export type BasicContract = {
  chainId: number;
  address: string;
};
