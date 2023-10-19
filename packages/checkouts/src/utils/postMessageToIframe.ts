export function postMessageToIframe<T>(
  frame: HTMLIFrameElement,
  eventType: string,
  data: T,
) {
  frame.contentWindow?.postMessage({ eventType, ...data }, "*");
}
