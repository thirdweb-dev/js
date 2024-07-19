export const closeWindow = ({
  isWindowOpenedByFn,
  win,
  closeOpenedWindow,
}: {
  win?: Window | null;
  isWindowOpenedByFn: boolean;
  closeOpenedWindow?: (openedWindow: Window) => void;
}) => {
  if (isWindowOpenedByFn) {
    win?.close();
  } else {
    if (win && closeOpenedWindow) {
      closeOpenedWindow(win);
    } else if (win) {
      win.close();
    }
  }
};
