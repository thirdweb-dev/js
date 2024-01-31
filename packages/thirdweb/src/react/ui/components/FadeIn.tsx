import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";

export const FadeIn = /* @__PURE__ */ StyledDiv({
  animation: `${fadeInAnimation} 0.15s ease-in`,
});
