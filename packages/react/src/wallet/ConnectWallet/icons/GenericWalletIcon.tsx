import { IconFC } from "./types";

export const GenericWalletIcon: IconFC = ({ size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 96 960 960"
      width={size}
    >
      <path
        fill="currentColor"
        d="M652 640q25 0 44.5-19.5t19.5-45q0-25.5-19.5-44.5T652 512q-25 0-44.5 19T588 575.5q0 25.5 19.5 45T652 640ZM180 823v53-600 547Zm0 113q-23 0-41.5-18T120 876V276q0-23 18.5-41.5T180 216h600q24 0 42 18.5t18 41.5v134h-60V276H180v600h600V743h60v133q0 24-18 42t-42 18H180Zm358-173q-34 0-54-20t-20-53V463q0-34 20-53.5t54-19.5h270q34 0 54 19.5t20 53.5v227q0 33-20 53t-54 20H538Zm284-60V450H524v253h298Z"
      />
    </svg>
  );
};
