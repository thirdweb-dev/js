import Svg, { Path } from "react-native-svg";
import { IconStyleProp } from "./types";

const PocketWalletIcon = ({ width, height }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13.3337 7.99996V5.33329H4.00033C3.6467 5.33329 3.30756 5.19282 3.05752 4.94277C2.80747 4.69272 2.66699 4.35358 2.66699 3.99996C2.66699 3.26663 3.26699 2.66663 4.00033 2.66663H12.0003V5.33329"
        stroke="#646D7A"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2.66699 4V12C2.66699 12.7333 3.26699 13.3333 4.00033 13.3333H13.3337V10.6667"
        stroke="#646D7A"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12.0003 8C11.6467 8 11.3076 8.14048 11.0575 8.39052C10.8075 8.64057 10.667 8.97971 10.667 9.33333C10.667 10.0667 11.267 10.6667 12.0003 10.6667H14.667V8H12.0003Z"
        stroke="#646D7A"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default PocketWalletIcon;
