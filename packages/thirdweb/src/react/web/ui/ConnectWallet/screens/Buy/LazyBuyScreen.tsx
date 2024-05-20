import { Suspense, lazy } from "react";
import { LoadingScreen } from "../../../../wallets/shared/LoadingScreen.js";
import type { BuyScreenProps } from "./BuyScreen.js";

const BuyScreen = lazy(() => import("./BuyScreen.js"));

export function LazyBuyScreen(props: BuyScreenProps) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <BuyScreen {...props} />
    </Suspense>
  );
}
