import { StyledDiv } from "../design-system/elements.js";

/**
 * The greet dot that is placed at the corner of the chain icon -
 * indicating that the chain is currently active (connected to)
 * @internal
 */
export const ChainActiveDot = /* @__PURE__ */ StyledDiv({
  backgroundColor: "#00d395",
  borderRadius: "50%",
  bottom: 0,
  boxShadow: "0 0 0 2px var(--bg)",
  height: "28%",
  position: "absolute",
  right: 0,
  width: "28%",
});
