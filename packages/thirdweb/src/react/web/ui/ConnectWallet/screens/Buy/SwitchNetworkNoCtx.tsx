import { useState } from "react";
import type { Chain } from "../../../../../../chains/types.js";
import { Spinner } from "../../../components/Spinner.js";
import { Button, type ButtonProps } from "../../../components/buttons.js";

export function SwitchNetworkButtonNoCtx(
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
