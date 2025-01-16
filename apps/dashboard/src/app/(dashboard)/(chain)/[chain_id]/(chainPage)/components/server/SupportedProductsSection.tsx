import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";
import { products } from "../../../../components/server/products";
import type { ChainMetadataWithServices } from "../../../../types/chain";
import { SectionTitle } from "./SectionTitle";

export function SupportedProductsSection(props: {
  services: ChainMetadataWithServices["services"];
}) {
  const enabledProducts = products.filter((product) => {
    return props.services.find(
      (service) => service.service === product.id && service.enabled,
    );
  });

  if (enabledProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle title="thirdweb Products" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {enabledProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="relative flex gap-3 rounded-lg border bg-card p-4 pr-8 transition-colors hover:border-active-border"
            >
              <CircleCheckIcon className="absolute top-4 right-4 size-5 text-success-text" />
              <product.icon className="mt-0.5 size-5 shrink-0" />
              <div>
                <h3 className="mb-1.5 font-medium">
                  <Link
                    href={product.link}
                    className="before:absolute before:inset-0"
                    target="_blank"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
