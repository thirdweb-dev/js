import { useEffect } from "react";
import type { BuyWithFiatQuote } from "../../../../../../pay/buyWithFiat/getQuote.js";
import { Spinner } from "../../../components/Spinner.js";
import {
  Container,
  Line,
  ModalHeader,
  noScrollBar,
} from "../../../components/basic.js";
import { StyledIframe } from "../../../design-system/elements.js";
import { radius } from "../../../design-system/index.js";

/**
 * @internal
 */
export function KadoScreen(props: {
  quote: BuyWithFiatQuote;
  onBack: () => void;
  testMode?: boolean;
  onComplete: () => void;
  theme: "light" | "dark";
}) {
  let iframeSrc = `${props.quote.onRampLink}&theme=${props.theme}`;
  let iframeOrigin = new URL(iframeSrc).origin;

  // TODO - probably remove this after testing
  if (props.testMode) {
    const kadoSandbox = "https://sandbox--kado.netlify.app";
    iframeSrc = iframeSrc.replace(iframeOrigin, kadoSandbox);
    iframeOrigin = kadoSandbox;
  }

  const { onComplete } = props;

  useEffect(() => {
    function handlePostMessage(event: MessageEvent) {
      if (event.origin !== iframeOrigin) {
        return;
      }

      onComplete();
    }

    window.addEventListener("message", handlePostMessage);
    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
  }, [iframeOrigin, onComplete]);

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
          <Spinner size="xl" color="accentText" />
        </div>
        <Iframe
          title="Buy token with Kado"
          allow="clipboard-write; payment; accelerometer; gyroscope; camera; geolocation; autoplay; fullscreen;"
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
