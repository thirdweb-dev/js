/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-assign-module-variable */
import { useQuery } from "@tanstack/react-query";

type WalletImageProps = {
  id: "app.core" | "io.metamask";
  size: string;
};

/**
 * Load the image for a wallet
 * @param props - test
 * @example
 * test
 * @component
 */
export function WalletImage(props: WalletImageProps) {
  const walletImgQuery = useQuery({
    queryKey: ["wallet-image", props.id],
    queryFn: async () => {
      try {
        const module = await import(
          `../../../../wallets/__generated__/${props.id}/image.js`
        );
        console.log({ module });
        return module.default;
      } catch (e) {
        console.error("failed to load wallet image module");
        console.error(e);
        throw e;
      }
    },
  });

  return (
    <img
      src={walletImgQuery.data || ""}
      width={props.size}
      height={props.size}
      alt=""
    />
  );
}
