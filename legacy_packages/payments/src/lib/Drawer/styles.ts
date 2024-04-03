import type { ModalStyles } from "../../interfaces/Modal";

const fullScreen = {
  position: "fixed",
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
};

export const getDefaultModalStyles = (): ModalStyles => ({
  main: {
    ...fullScreen,
    zIndex: "2147483646",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  },
  overlay: {
    ...fullScreen,
    backgroundColor: "rgba(0, 0, 0, 0)",
    transition: "background-color ease-out 0.2s",
  },
  body: {
    position: "fixed",
    width: "100%",
    maxWidth: "420px",
    top: "0px",
    bottom: "0px",
    right: "-100px",
    opacity: "0",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)",
    backgroundColor: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "#2F2F2F"
      : "white",
    overflow: "hidden",
    transition: "all ease-out 0.2s",
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
    height: "100%",
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "fixed",
    cursor: "pointer",
    top: "0.75rem",
    right: "1rem",
    color: "#888",
    padding: "2px 8px",
  },
});
