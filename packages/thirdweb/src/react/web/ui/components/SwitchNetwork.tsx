import { useState } from "react";
import { Button, type ButtonProps } from "./buttons.js";
import { Spinner } from "./Spinner.js";

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
          <Spinner color="accentButtonText" size="sm" />
        </>
      ) : (
        "Switch Network"
      )}
    </Button>
  );
}
