// UNCHANGED
/**
 * Opens a popup centered on the parent page and returns a reference to the window.
 * The caller can close the popup with `popupWindow.close()`.
 * @returns The Window that was popped up
 */
export function openCenteredPopup({
  url,
  target,
  win,
  w,
  h,
}: {
  url: string;
  target: string;
  win: Window & typeof globalThis;
  w: number;
  h: number;
}) {
  const height = win?.top?.outerHeight || 100;
  const width = win?.top?.outerWidth || 100;
  const screenX = win?.top?.screenX || 100;
  const screenY = win?.top?.screenY || 100;
  const y = height / 2 + screenY - h / 2;
  const x = width / 2 + screenX - w / 2;
  return win.open(
    url,
    target,
    `toolbar=no,
    location=no,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes,
    width=${w},
    height=${h},
    top=${y},
    left=${x}`,
  );
}
