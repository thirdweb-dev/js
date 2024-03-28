import { IconStyleProp } from "./types";
import Svg, { Path, Rect } from "react-native-svg";

const Email = ({ width, height }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Rect
        x="0.633333"
        y="0.633333"
        width="16.4667"
        height="16.4667"
        rx="4.43333"
        fill="#3385FF"
      />
      <Rect x="2.2168" y="4.43359" width="13.3" height="8.86667" fill="white" />
      <Path
        d="M14.7775 2.95557H2.95532C2.14254 2.95557 1.48493 3.62057 1.48493 4.43334L1.47754 13.3C1.47754 14.1128 2.14254 14.7778 2.95532 14.7778H14.7775C15.5903 14.7778 16.2553 14.1128 16.2553 13.3V4.43334C16.2553 3.62057 15.5903 2.95557 14.7775 2.95557ZM14.7775 5.91112L8.86643 9.60557L2.95532 5.91112V4.43334L8.86643 8.12779L14.7775 4.43334V5.91112Z"
        fill="#3385FF"
      />
      <Rect
        x="0.633333"
        y="0.633333"
        width="16.4667"
        height="16.4667"
        rx="4.43333"
        stroke="#1177FD"
        stroke-width="1.26667"
      />
    </Svg>
  );
};

export default Email;
