import { ChakraNextImage } from "components/Image";
import { Heading } from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { ProductSection } from "./ProductSection";

interface SolutionsTextImageProps {
  image: string;
  title: string;
}

export const SolutionsTextImage: ComponentWithChildren<
  SolutionsTextImageProps
> = ({ image, title, children }) => {
  return (
    <ProductSection>
      <div className="flex flex-col items-center gap-12 py-6 md:flex-row md:py-12">
        <ChakraNextImage
          maxW={{ base: "100%", md: "50%" }}
          objectFit="contain"
          src={image}
          quality={95}
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
          borderRadius={{ base: "none", md: "lg" }}
        />

        <div className="flex flex-col gap-4">
          <Heading as="h2" size="title.xl" mb={4}>
            {title}
          </Heading>
          {children}
        </div>
      </div>
    </ProductSection>
  );
};
