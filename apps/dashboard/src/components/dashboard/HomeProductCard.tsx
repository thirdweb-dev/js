"use client";
import type { SectionItemProps } from "components/product-pages/common/nav/types";
import { useTrack } from "hooks/analytics/useTrack";
import Image from "next/image";
import Link from "next/link";

interface HomeProductCardProps {
  product: SectionItemProps;
  isFromLandingPage?: boolean;
  TRACKING_CATEGORY: string;
}

export const HomeProductCard: React.FC<HomeProductCardProps> = ({
  product,
  TRACKING_CATEGORY,
  isFromLandingPage,
}) => {
  const trackEvent = useTrack();
  return (
    <div className="relative flex h-full items-center gap-3.5 overflow-hidden rounded-lg border border-border bg-muted/50 p-4 hover:bg-muted md:min-h-24">
      {product.icon && (
        <div className="shrink-0 rounded-full border border-border p-2">
          <Image alt="" className="size-5" src={product.icon} />
        </div>
      )}
      <div>
        <Link
          href={
            (isFromLandingPage ? product.link : product.dashboardLink) || ""
          }
          className="font-semibold tracking-tight before:absolute before:inset-0"
          onClick={() => {
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "select-product",
              product: product.name,
            });
          }}
        >
          {isFromLandingPage
            ? product.name
            : product?.dashboardName || product.name}
        </Link>
        <p className="mt-0.5 text-muted-foreground text-sm">
          {product.description}
        </p>
      </div>
    </div>
  );
};
