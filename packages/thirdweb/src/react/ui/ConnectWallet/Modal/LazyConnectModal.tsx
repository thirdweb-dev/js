import { Suspense, lazy } from "react";
import { useIsWalletModalOpen } from "../../../providers/wallet-ui-states-provider.js";

const ConnectModal = /* @__PURE__ */ lazy(() => import("./ConnectModal.js"));

/**
 * @internal
 */
export function LazyConnectModal() {
  const isWalletModalOpen = useIsWalletModalOpen();
  return (
    <Suspense fallback={null}>{isWalletModalOpen && <ConnectModal />}</Suspense>
  );
}
