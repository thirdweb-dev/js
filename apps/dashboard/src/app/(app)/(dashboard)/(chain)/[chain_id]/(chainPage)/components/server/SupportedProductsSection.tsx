import Link from "next/link";
import type { ChainMetadataWithServices } from "@/types/chain";
import { products } from "../../../../components/server/products";
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
              className="relative rounded-xl border bg-card p-4 hover:border-active-border"
              key={product.id}
            >
              <div className="flex mb-4">
                <div className="p-2 rounded-full border bg-background">
                  <product.icon className="size-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="mb-1">
                  <Link
                    className="before:absolute before:inset-0 text-base font-medium"
                    href={product.link}
                    rel="noopener noreferrer"
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
