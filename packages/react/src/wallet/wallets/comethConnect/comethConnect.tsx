import {
  ConnectUIProps,
  useConnect,
  type WalletConfig,
} from "@thirdweb-dev/react-core";
import {
  ComethConnect,
  ComethAdditionalOptions,
  walletIds,
} from "@thirdweb-dev/wallets";
import { useRef, useEffect, useState, useCallback } from "react";
import { Spinner } from "../../../components/Spinner";
import { Container } from "../../../components/basic";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { iconSize, spacing } from "../../../design-system";
import { Spacer } from "../../../components/Spacer";
import { Text } from "../../../components/text";
import { Button } from "../../../components/buttons";

export const comethConnect = (
  config: Omit<ComethAdditionalOptions, "chain">,
): WalletConfig<ComethConnect> => ({
  id: walletIds.comethConnect,
  meta: {
    name: "Cometh Connect",
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxRDJGNEEiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUwXzUpIj4KPHBhdGggZD0iTTYzLjUwNzUgMTUuMDM0MkM1Ni44NTI4IDE1LjQ3MjMgNDcuNzQwMSAxOC4yMzQ5IDM5LjkwNDMgMjIuMTg1M0MzNi45NDY2IDIzLjY3NzggMzQuODE3NCAyNC45ODU1IDMyLjgxNDggMjYuNTQzMUMzMi43NzAyIDI2LjU3NzMgMzIuNzMyNiAyNi41OTEgMzIuNzMyNiAyNi41NzA1QzMyLjczMjYgMjYuNTQ2NSAzMi44MDc5IDI2LjE5MzkgMzIuOTAzNyAyNS43ODMxQzMyLjk5NjEgMjUuMzcyNCAzMy4wNzUgMjUuMDE5OCAzMy4wNzUgMjQuOTk5MkMzMy4wNzUgMjQuODkzMSAyOS41Nzk4IDI3LjQwNTggMjcuNzY4OSAyOC44MDkzQzIwLjAzOTIgMzQuODEwMiAxNi4xMjY1IDQwLjQzNDYgMTUuMjA5IDQ2Ljg2NjlDMTUuMDI3NiA0OC4xNDA0IDE0Ljk1MjMgNDkuODg5NiAxNS4wMzEgNTEuMDI2MUMxNS4zNzY4IDU1Ljk0NTMgMTcuNTQ3MSA1OS44OTkyIDIxLjIzMDUgNjIuMzIyOEMyMS44ODA5IDYyLjc1MDggMjIuMjMzNSA2Mi45NDkyIDIyLjkxMTMgNjMuMjc3OUMyNi4wNDcgNjQuNzk0NCAyOS44NTM3IDY1LjI3MDIgMzQuMDg0OCA2NC42ODE0QzM2LjYxMTIgNjQuMzI4OSAzOS4yMjY2IDYzLjU3NTggNDEuMDE2OCA2Mi42ODU3QzQzLjAxMjYgNjEuNjkyOCA0NS4xMzE1IDYwLjI0ODMgNDcuMDU4OSA1OC41NzQ0QzQ3LjYxMzQgNTguMDg4MiA0OS4zMDQ1IDU2LjQwMDYgNDkuNzgzNyA1NS44NTI5QzUxLjAyNjQgNTQuNDI4OSA1Mi4wMjU5IDUzLjA4MzUgNTIuOTEyNiA1MS42NDIyTDUzLjE0NTMgNTEuMjY1N0w1Mi45NjA2IDUxLjQzN0M1Mi43MTQgNTEuNjY5NyA1Mi4zNjgzIDUxLjkwOTMgNTIuMDUzNCA1Mi4wNzM2QzUxLjcwNzYgNTIuMjUxNyA1MS42NTYyIDUyLjI0ODEgNTEuODI3NSA1Mi4wNDI5QzUyLjIwNCA1MS41OTQ0IDUyLjY1MjUgNTAuNzU1NyA1Mi44MDk5IDUwLjIwNzlDNTIuODU3OCA1MC4wNDAyIDUyLjg5MjEgNDkuODk5OCA1Mi44ODUyIDQ5Ljg5M0M1Mi44ODE4IDQ5Ljg4NjIgNTIuNzIxIDQ5Ljk4ODggNTIuNTM2IDUwLjEyMjRDNTAuNDQ3OCA1MS41OTQ0IDQ2LjY5NiA1My40MjI0IDQ0LjIwMzkgNTQuMTc4OUM0My45ODgyIDU0LjI0MzkgNDMuODA2OCA1NC4yOTE5IDQzLjggNTQuMjg1MUM0My43OTMgNTQuMjc4MyA0My44NTgxIDU0LjExMDQgNDMuOTQwMiA1My45MTJDNDQuMTAxMiA1My41MzIgNDQuMzM0IDUyLjg0MDQgNDQuNDE2MSA1Mi40OTgxQzQ0LjUyMjIgNTIuMDY2OCA0NC41NDI3IDUyLjA4MDQgNDQuMjEwNyA1Mi4zNDc1QzQzLjg3ODcgNTIuNjE0NCA0Mi44OTk3IDUzLjI3MTcgNDIuNDcxNyA1My41MTQ3QzQwLjkwNzMgNTQuNDAxNCAzOS4wODk2IDU1LjAwNzMgMzcuMjUxMiA1NS4yNTM5QzM2LjU3MzQgNTUuMzQ2MyAzNS4yMTQ0IDU1LjM4MzggMzQuNTkxNSA1NS4zMjU4QzMyLjc0OTcgNTUuMTU3OSAzMS4yNjQgNTQuNjM0MiAzMC4wNjI1IDUzLjcyN0MyOC41OTczIDUyLjYyNDggMjcuNzIxIDUwLjk4NTEgMjcuNDQwMyA0OC44Mjg0QzI3LjM2ODQgNDguMjkxIDI3LjM2MTUgNDcuMDI3OCAyNy40MjMyIDQ2LjQ1NkMyNy41ODA2IDQ1LjAwODEgMjcuOTIzIDQzLjc4NiAyOC41NDYgNDIuNDMzOEMyOS45NyAzOS4zNTY0IDMyLjk3NTYgMzUuODY4IDM3LjM5NSAzMi4xNzFDNDAuMTY3OSAyOS44NDk5IDQzLjYxODUgMjcuMzUxIDQ2LjkzOSAyNS4yNTk0QzUxLjQ0NzUgMjIuNDE4MSA1Ni41OTI1IDE5Ljc4NTYgNjEuNTA1IDE3LjgwMzZDNjEuODQzOCAxNy42NjY2IDYyLjEzNDggMTcuNTQzNCA2Mi4xNDg0IDE3LjUyOTdDNjIuMTgyOCAxNy40OTg5IDYxLjQ3MDcgMTcuMzc1NyA2MC44NTQ1IDE3LjMwMzhDNjAuNTkxIDE3LjI3MyA2MC4wMDU2IDE3LjIzODcgNTkuNTUzNyAxNy4yMjVMNTguNzMyMSAxNy4yMDQ1TDU4Ljk4ODggMTcuMTEyMUM1OS40MDY1IDE2Ljk2NDkgNjMuOTI4NiAxNS4zNDkxIDY0LjQzMTggMTUuMTY3N0w2NC44OTM5IDE0Ljk5OTlMNjQuNDE0NyAxNS4wMDM0QzY0LjE1MTEgMTUuMDAzNCA2My43NDM4IDE1LjAyMDUgNjMuNTA3NSAxNS4wMzQyWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF81MF81Ij4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUgMTUpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
  },
  create(walletOptions) {
    return new ComethConnect({
      ...walletOptions,
      ...config,
    });
  },
  connectUI: ComethConnectUI,
  isInstalled() {
    return false;
  },
});

export const ComethConnectUI = ({
  connected,
  walletConfig,
}: ConnectUIProps<ComethConnect>) => {
  const connect = useConnect();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const prompted = useRef(false);

  const connectWallet = useCallback(async () => {
    try {
      setStatus("loading");
      await connect(walletConfig);
      connected();
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  }, [connect, connected, walletConfig]);

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;
    connectWallet();
  }, [connectWallet]);

  return (
    <Container flex="column" center="y" animate="fadein" fullHeight p="lg">
      <Container
        expand
        center="both"
        flex="column"
        style={{
          minHeight: "250px",
        }}
      >
        {status === "loading" && <Spinner size="xl" color="accentText" />}
        {status === "error" && (
          <Container color="danger" flex="column" center="x" animate="fadein">
            <ExclamationTriangleIcon width={iconSize.xl} height={iconSize.xl} />
            <Spacer y="md" />
            <Text color="danger">Failed to sign in</Text>
          </Container>
        )}
      </Container>

      {status === "error" && (
        <Button
          fullWidth
          variant="accent"
          onClick={connectWallet}
          style={{
            gap: spacing.sm,
          }}
        >
          <ReloadIcon width={iconSize.sm} height={iconSize.sm} />
          Try Again
        </Button>
      )}
    </Container>
  );
};
