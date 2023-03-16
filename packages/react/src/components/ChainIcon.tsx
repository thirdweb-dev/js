import { Theme } from "../design-system";
import styled from "@emotion/styled";
import { Chain } from "@thirdweb-dev/chains";

const defaultChainIcon =
  "https://gateway.ipfscdn.io/ipfs/QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png";

export const ChainIcon: React.FC<{
  chain?: Chain;
  size: string;
  active?: boolean;
}> = (props) => {
  const url = props.chain?.icon?.url;
  const src = url
    ? `https://gateway.ipfscdn.io/ipfs/${url.replace("ipfs://", "")}`
    : defaultChainIcon;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={src || defaultChainIcon}
        onError={(e) => {
          if (e.currentTarget.src !== defaultChainIcon) {
            e.currentTarget.src = defaultChainIcon;
          }
        }}
        alt={`C`}
        width={props.size}
        height={props.size}
      />
      {props.active && <ActiveDot />}
    </div>
  );
};

const ActiveDot = styled.div<{ theme?: Theme }>`
  width: 28%;
  height: 28%;
  border-radius: 50%;
  position: absolute;
  top: 60%;
  right: 0px;
  background-color: #00d395;
  box-shadow: 0 0 0 2px ${(p) => p.theme.bg.elevated};
`;
