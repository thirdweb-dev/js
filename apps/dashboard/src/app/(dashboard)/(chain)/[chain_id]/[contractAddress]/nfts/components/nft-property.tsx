import { Card } from "@/components/ui/card";

interface NftPropertyProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  property: any;
}

export const NftProperty: React.FC<NftPropertyProps> = ({ property }) => {
  return (
    <Card className="flex flex-col gap-2 p-3">
      {property?.trait_type && (
        <p className="text-center text-link-foreground text-sm leading-[1.2]">
          {property?.trait_type}
        </p>
      )}
      <p className="text-center text-muted-foreground text-sm">
        {typeof property?.value === "object"
          ? JSON.stringify(property?.value || {})
          : property?.value}
      </p>
    </Card>
  );
};
