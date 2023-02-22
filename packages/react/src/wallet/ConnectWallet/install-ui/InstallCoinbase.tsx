/* eslint-disable @next/next/no-img-element */
import { Spinner } from "../../../components/Spinner";
import { BackButton } from "../shared/modalElements";
import { blue } from "@radix-ui/colors";
import {
  useConnect,
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import { useEffect, useRef } from "react";

type CoinbaseWalletInstance = InstanceType<typeof CoinbaseWallet>;

export const InstallCoinbaseWallet: React.FC<{ onBack: () => void }> = (
  props,
) => {
  const createWalletInstance = useCreateWalletInstance();
  const connect = useConnect();
  const twWallet = useThirdwebWallet();

  const connectionStarted = useRef(false);

  useEffect(() => {
    if (connectionStarted.current) {
      return;
    }

    const coinbaseWallet = createWalletInstance(
      CoinbaseWallet,
    ) as CoinbaseWalletInstance;

    connectionStarted.current = true;
    coinbaseWallet.connect().then(() => {
      twWallet?.handleWalletConnect(coinbaseWallet);
    });
  }, [createWalletInstance, connect, twWallet]);

  return (
    <>
      <BackButton onClick={props.onBack} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spinner size="xl" color={blue.blue10} />
      </div>
    </>
  );
};

// custom QR code
// const QRCode: React.FC<{
//   content: string;
// }> = (props) => {
//   const [svg, setSvg] = useState("");

//   useEffect(() => {
//     const qrcode = new QRCodeSVG({
//       content: props.content,
//       background: "#ffffff",
//       color: "#000000",
//       container: "svg",
//       ecl: "M",
//       width: 200,
//       height: 200,
//       padding: 0,
//     });

//     const svgText = qrcode.svg();

//     const base64 = btoa(svgText);
//     setSvg(`data:image/svg+xml;base64,${base64}`);
//     // setSvg(svgText);
//   }, [props.content]);

//   return svg ? (
//     <QRCodeWrapper>
//       <CoinbaseWalletIconWrapper>
//         <CoinbaseWalletIcon width={iconSize.xl} height={iconSize.xl} />
//       </CoinbaseWalletIconWrapper>
//       <img src={svg} alt="" width="200" height="200" draggable="false" />
//     </QRCodeWrapper>
//   ) : null;
// };

// const CoinbaseWalletIconWrapper = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   border: 4px solid white;
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const QRCodeWrapper = styled.div`
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: ${spacing.xxs};
//   border-radius: ${radius.md};
//   background-color: white;
// `;
