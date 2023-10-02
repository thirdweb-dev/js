import { IconStyleProp } from "./types";
import Svg, { Line, Path } from "react-native-svg";

const DownloadIcon = ({ width, height, color = "white" }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9.05088 12.9506C9.26009 13.1598 9.59929 13.1598 9.80849 12.9506L13.2178 9.54132C13.427 9.33211 13.427 8.99291 13.2178 8.78371C13.0085 8.5745 12.6694 8.5745 12.4601 8.78371L9.42969 11.8142L6.39923 8.78371C6.19002 8.5745 5.85082 8.5745 5.64162 8.78371C5.43241 8.99292 5.43241 9.33211 5.64162 9.54132L9.05088 12.9506ZM9.9654 3.28606C9.9654 2.9902 9.72555 2.75035 9.42969 2.75035C9.13382 2.75035 8.89397 2.9902 8.89397 3.28606L9.9654 3.28606ZM9.9654 12.5718L9.9654 3.28606L8.89397 3.28606L8.89397 12.5718L9.9654 12.5718Z"
        fill={color}
      />
      <Line
        x1="5.68025"
        y1="14.1791"
        x2="13.1802"
        y2="14.1791"
        stroke={color}
        stroke-width="1.07143"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default DownloadIcon;
