import { LocalAsyncStorage } from "../../core/WalletStorage";
import { ThirdwebProvider as ThirdwebProviderCore } from "@thirdweb-dev/react-core";
import { ComponentProps } from "react";

export function ThirdwebProvider(
  props: Omit<ComponentProps<typeof ThirdwebProviderCore>, "storage">,
) {
  return <ThirdwebProviderCore {...props} storage={LocalAsyncStorage} />;
}
