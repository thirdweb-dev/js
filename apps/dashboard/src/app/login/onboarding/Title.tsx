import type { JSX } from "react";

type TitleAndDescriptionProps = {
  heading: string | JSX.Element;
  description: string | JSX.Element;
};

export const TitleAndDescription: React.FC<TitleAndDescriptionProps> = ({
  heading,
  description,
}) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <h3 className="font-semibold text-foreground text-xl tracking-tight">
        {heading}
      </h3>

      {description && (
        <div className="text-muted-foreground">{description}</div>
      )}
    </div>
  );
};
