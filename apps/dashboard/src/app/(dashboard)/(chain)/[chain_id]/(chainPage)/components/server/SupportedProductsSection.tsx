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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {enabledProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex gap-3 relative hover:bg-secondary transition-colors duration-300 pr-8"
            >
              <CircleCheckIcon className="size-5 text-success-text absolute top-4 right-4" />
              <product.icon className="size-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1.5">
                  <Link
                    href={product.link}
                    className="before:absolute before:inset-0"
                    target="_blank"
                  >
                    {" "}
                    {product.name}{" "}
                  </Link>
                </h3>
                <p className="text-sm text-secondary-foreground">
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
