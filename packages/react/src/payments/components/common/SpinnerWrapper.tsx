import { css } from "@emotion/css";
import { Spinner } from "./Spinner";

export const SpinnerWrapper: React.FC = () => {
  return (
    <div className={wrapperStyle}>
      <Spinner className={spinnerStyle} />
    </div>
  );
};

const wrapperStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

const spinnerStyle = css`
  color: #000000;
  width: 2rem;
  height: 2rem;
`;
