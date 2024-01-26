import { fadeInAnimation } from "../design-system/animations";
import { StyledDiv } from "../design-system/elements";

export const FadeIn = /* @__PURE__ */ StyledDiv({
  animation: `${fadeInAnimation} 0.15s ease-in`,
});
