import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import type { ComponentType, ReactElement } from "react";

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export type EnhancedRoute<T = any> = {
  title: string;
  path: string;
  isDefault?: true;
  isBeta?: true;
  isDeprecated?: true;
  isEnabled?: ExtensionDetectedState;
  component: ComponentType<T> | ReactElement;
};

export type BasicContract = {
  chainId: number;
  address: string;
};
