import Image from "next/image";

type FeatureCardItem = {
  title: string;
  description: string;
  iconUrl: string | React.ReactNode;
};

export function FeatureCard(props: FeatureCardItem) {
  const { title, description, iconUrl } = props;
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex mb-3">
        <div className="p-2 rounded-full border bg-background [&_svg]:size-4 [&_svg]:text-muted-foreground">
          {typeof iconUrl === "string" ? (
            <Image
              alt=""
              className="size-4 text-muted-foreground"
              height={16}
              src={iconUrl}
              width={16}
            />
          ) : (
            iconUrl
          )}
        </div>
      </div>
      <h4 className="mb-1 font-medium text-base">{title}</h4>
      <p className="text-muted-foreground text-sm text-pretty">{description}</p>
    </div>
  );
}
