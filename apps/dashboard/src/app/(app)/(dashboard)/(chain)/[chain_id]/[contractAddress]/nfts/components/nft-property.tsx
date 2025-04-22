interface NftPropertyProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  property: any;
}

export const NftProperty: React.FC<NftPropertyProps> = ({ property }) => {
  return (
    <div className="rounded-lg border bg-card p-3 text-sm">
      {property?.trait_type && (
        <p className="mb-0.5 text-muted-foreground text-sm">
          {property?.trait_type}
        </p>
      )}
      <p className="text-foreground text-sm">
        {typeof property?.value === "object"
          ? JSON.stringify(property?.value || {})
          : property?.value}
      </p>
    </div>
  );
};
