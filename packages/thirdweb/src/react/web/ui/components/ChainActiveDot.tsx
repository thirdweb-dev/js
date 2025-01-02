import { StyledDiv } from "../design-system/elements.js";

/**
 * The greet dot that is placed at the corner of the chain icon -
 * indicating that the chain is currently active (connected to)
 * @internal
 */
export const ChainActiveDot = /* @__PURE__ */ StyledDiv({
  width: "28%",
  height: "28%",
  borderRadius: "50%",
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "#00d395",
  boxShadow: "0 0 0 2px var(--bg)",
});
