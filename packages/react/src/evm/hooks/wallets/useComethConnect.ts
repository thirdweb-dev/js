import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { ComethAdditionalOptions } from "@thirdweb-dev/wallets";

export function useComethConnect() {
  const connect = useConnect();
  return useCallback(
    async (options: ComethAdditionalOptions) => {
      const { comethConnect } = await import(
        "../../../wallet/wallets/comethConnect/comethConnect"
      );
      return connect(comethConnect(options));
    },
    [connect],
  );
}
