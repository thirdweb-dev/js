import { useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import { Spinner } from "./Spinner.js";
import { Button, type ButtonProps } from "./buttons.js";

export function SwitchNetworkButton(
  props: ButtonProps & {
    chain: Chain;
    fullWidth?: boolean;
    switchChain: (chain: Chain) => Promise<void>;
  },
) {
  const [isSwitching, setIsSwitching] = useState(false);

  return (
    <Button
      {...props}
      gap="xs"
      onClick={async () => {
        setIsSwitching(true);
        try {
          await props.switchChain(props.chain);
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
