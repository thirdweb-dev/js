import type { Theme } from "../design-system";
import styled from "@emotion/styled";
import { Chain } from "@thirdweb-dev/chains";
import { useStorage } from "@thirdweb-dev/react-core";

const defaultChainIcon =
  "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png";

export const ChainIcon: React.FC<{
  chain?: Chain;
  size: string;
  active?: boolean;
  className?: string;
  loading?: "lazy" | "eager";
}> = (props) => {
  const url = props.chain?.icon?.url || defaultChainIcon;
  const storage = useStorage();

  const src = storage
    ? storage.resolveScheme(url)
    : url.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
      }}
    >
      <img
        src={src || defaultChainIcon}
        onError={(e) => {
          if (defaultChainIcon && e.currentTarget.src !== defaultChainIcon) {
            e.currentTarget.src = defaultChainIcon;
          }
        }}
        alt=""
        width={props.size}
        height={props.size}
        className={props.className}
        loading={props.loading}
        style={{
          objectFit: "contain",
          width: props.size + "px",
          height: props.size + "px",
        }}
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
  box-shadow: 0 0 0 2px var(--bg);
`;
