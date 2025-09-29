import { type Container, createRoot } from "react-dom/client";
import { ThirdwebProvider } from "../react/web/providers/thirdweb-provider.js";
import {
  BridgeWidgetScript,
  type BridgeWidgetScriptProps,
} from "./bridge-widget-script.js";

// Note: This file is built as a UMD module with globalName "BridgeWidget"
// This will be available as a global function called `BridgeWidget.render`

export function render(element: Container, props: BridgeWidgetScriptProps) {
  createRoot(element).render(
    <ThirdwebProvider>
      <BridgeWidgetScript {...props} />
    </ThirdwebProvider>,
  );
}
