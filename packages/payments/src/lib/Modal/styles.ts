import type { ModalStyles } from "../../interfaces/Modal";

const fullScreen = {
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
};

export const getDefaultModalStyles = (): ModalStyles => ({
  main: {
    ...fullScreen,
    position: "fixed",
    zIndex: "10000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  },
  overlay: {
    ...fullScreen,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    pointerEvents: "auto",
  },
  body: {
    background: "transparent",
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: "500px",
    height: "700px",
    maxHeight: "80%",
    animation: "pew-modal-slideIn 0.2s forwards",
    pointerEvents: "auto",
  },
  spinner: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
    borderWidth: "3px",
    borderColor: "#2D3748 #2D3748 transparent transparent",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
  },
  iframe: {
    position: "relative",
    height: "100%",
    width: "100%",
    border: "none",
    background: "transparent",
  },
});

export const modalKeyframeAnimations = `
  @keyframes pew-modal-slideIn {
    from {opacity: 0; transform: translate3d(0, 20px, 0);}
    to {opacity: 1; transform: translate3d(0, 0, 0);}
  }

  @keyframes pew-modal-slideOut {
    from {opacity: 1; transform: translate3d(0, 0, 0);}
    to {opacity: 0; transform: translate3d(0, 20px, 0);}
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
