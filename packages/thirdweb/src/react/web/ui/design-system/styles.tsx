import { radius } from "../../../core/design-system/index.js";

/**
 * @internal
 */
export const scrollbar = ({
  track,
  thumb,
  hover,
}: {
  track: string;
  hover: string;
  thumb: string;
}) => `
&::-webkit-scrollbar {
  width: 6px;
}

&::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px ${track};
  border-radius: ${radius.md};
}

&::-webkit-scrollbar-thumb {
  background: ${thumb};
  border-radius: ${radius.md};
}

&::-webkit-scrollbar-thumb:hover {
  background: ${hover};
}`;
