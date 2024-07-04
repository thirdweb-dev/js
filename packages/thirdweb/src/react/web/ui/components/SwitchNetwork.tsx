import { useState } from "react";
import { Spinner } from "./Spinner.js";
import { Button, type ButtonProps } from "./buttons.js";

export function SwitchNetworkButton(
  props: ButtonProps & {
    fullWidth?: boolean;
    switchChain: () => Promise<void>;
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
          await props.switchChain();
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
