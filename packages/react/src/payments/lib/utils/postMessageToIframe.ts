// UNCHANGED
export function postMessageToIframe(
  frame: HTMLIFrameElement,
  eventType: string,
  data: any,
) {
  frame.contentWindow?.postMessage({ eventType, ...data }, "*");
}
