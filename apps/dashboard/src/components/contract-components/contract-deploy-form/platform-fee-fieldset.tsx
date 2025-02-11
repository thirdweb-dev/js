import { Fieldset } from "./common";

interface PlatformFeeFieldsetProps {
  isMarketplace: boolean;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = (
  props,
) => {
  return (
    <Fieldset legend="Platform fees">
      <div className="flex flex-col gap-4 md:flex-row">
        {props.isMarketplace ? (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each sale to support ongoing
            platform operations and improvements.
          </p>
        ) : (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each primary sale price to
            support ongoing platform operations and improvements.
          </p>
        )}
      </div>
    </Fieldset>
  );
};
