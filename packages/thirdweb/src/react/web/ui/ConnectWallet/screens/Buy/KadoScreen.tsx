import { useEffect } from "react";
import type { BuyWithFiatQuote } from "../../../../../../pay/buyWithFiat/getQuote.js";
import { Spinner } from "../../../components/Spinner.js";
import {
  Container,
  Line,
  ModalHeader,
  noScrollBar,
} from "../../../components/basic.js";
import { StyledDiv, StyledIframe } from "../../../design-system/elements.js";
import { radius } from "../../../design-system/index.js";

/**
 * @internal
 */
export function KadoScreen(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  testMode?: boolean;
}) {
  let iframeSrc = props.quote.onRampLink;
  const iframeOrigin = new URL(iframeSrc).origin;

  // TODO - probably remove this after testing
  if (props.testMode) {
    const kadoSandbox = "https://sandbox--kado.netlify.app";
    iframeSrc = iframeSrc.replace(iframeOrigin, kadoSandbox);
  }

  useEffect(() => {
    function handlePostMessage(event: MessageEvent) {
      if (event.origin !== iframeOrigin) {
        return;
      }

      // TODO
      console.log("got from kado", event);
    }

    window.addEventListener("message", handlePostMessage);
    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
  }, [iframeOrigin]);

  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
      </Container>
      <Line />
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <Spinner size="lg" color="accentText" />
        </div>
        <Iframe
          title="Buy token with Kado"
          height={550}
          src={iframeSrc}
          style={{
            border: "none",
            borderRadius: radius.lg,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            width: "100%",
            zIndex: 10,
            position: "relative",
          }}
        />
      </div>
    </Container>
  );
}

const Iframe = StyledIframe(() => {
  return {
    ...noScrollBar,
  };
});
