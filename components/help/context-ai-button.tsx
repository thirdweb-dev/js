import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import Script from "next/script";
import { FiSearch } from "react-icons/fi";

const contextBotId = "SV3HwtSN0";

export function ContextAIBotButton() {
  const trackEvent = useTrack();

  return (
    <>
      <ContextAIBotScript />
      <div
        context-launcher="true"
        context-bot-id={contextBotId}
        onClick={() => {
          trackEvent({
            category: "context-ai",
            action: "click",
            label: "open-modal",
          });
        }}
      >
        <InputGroup>
          <InputLeftElement>
            <Icon as={FiSearch} opacity={0.5} />
          </InputLeftElement>
          <Input
            bgColor="backgroundBody"
            _hover={{
              bgColor: "backgroundBody",
            }}
          />
        </InputGroup>
      </div>
    </>
  );
}

export function ContextAIBotScript() {
  return (
    <Script
      // defer
      id="__CONTEXT_BUBBLE__"
      src="https://portal.usecontext.io/portal/portal.js"
      data-theme="dark"
      data-type="attribute"
    ></Script>
  );
}
