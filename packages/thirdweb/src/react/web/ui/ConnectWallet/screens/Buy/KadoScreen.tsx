import { useEffect } from "react";
import type { BuyWithFiatQuote } from "../../../../../../pay/buyWithFiat/getQuote.js";
import { Spinner } from "../../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../../components/basic.js";
import { radius } from "../../../design-system/index.js";

/**
 * @internal
 */
export function KadoScreen(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
}) {
  const iframeSrc = props.quote.onRampLink;
  const iframeOrigin = new URL(iframeSrc).origin;

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
        <iframe
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
