import { SkeletonContainer } from "@/components/ui/skeleton";

export function TokenPrice(props: {
  strikethrough: boolean;
  data:
    | {
        priceInTokens: number;
        symbol: string;
      }
    | undefined;
}) {
  return (
    <SkeletonContainer
      loadedData={
        props.data
          ? props.data.priceInTokens === 0
            ? "FREE"
            : `${tokenPriceFormatter.format(props.data.priceInTokens)} ${props.data.symbol}`
          : undefined
      }
      render={(v) => {
        if (props.strikethrough) {
          return (
            <s className="font-medium text-muted-foreground text-sm line-through decoration-muted-foreground/50">
              {v}
            </s>
          );
        }
        return <span className="font-medium text-foreground text-sm">{v}</span>;
      }}
      skeletonData={"0.00 ETH"}
    />
  );
}

const tokenPriceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 10,
  notation: "compact",
});
