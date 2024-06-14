import { useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import { useSwitchActiveWalletChain } from "../../hooks/wallets/useSwitchActiveWalletChain.js";
import { Spinner } from "./Spinner.js";
import { Button, type ButtonProps } from "./buttons.js";

export function SwitchNetworkButton(
  props: ButtonProps & {
    chain: Chain;
    fullWidth?: boolean;
  },
) {
  const [isSwitching, setIsSwitching] = useState(false);
  const switchActiveWalletChain = useSwitchActiveWalletChain();

  return (
    <Button
      {...props}
      gap="xs"
      onClick={async () => {
        setIsSwitching(true);
        try {
          await switchActiveWalletChain(props.chain);
        } catch {}
        setIsSwitching(false);
      }}
    >
      {isSwitching ? (
        <>
          Switching
          <Spinner size="sm" color="accentButtonText" />
        </>
      ) : (
        "Switch Network"
      )}
    </Button>
  );
}
