/**
 * Opens a popup centered on the current window.
 * Note that modern browsers may prevent popups from opening automatically,
 * so try to handle the case where the window returned is null.
 *
 * @returns Window | null - The Window object that was opened. If null is returned, the popup failed to open.
 */
export const openCenteredPopup = ({
  url,
  width = 440,
  height = 700,
}: {
  url: string;
  width?: number;
  height?: number;
}): Window | null => {
  if (!window?.top){ return null;}

  const y = window.top.outerHeight / 2 + window.top.screenY - height / 2;
  const x = window.top.outerWidth / 2 + window.top.screenX - width / 2;
  return window.open(
    url,
    "_blank",
    `popup=true,width=${width},height=${height},top=${y},left=${x}`,
  );
};
