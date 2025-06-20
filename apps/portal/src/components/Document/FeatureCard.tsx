import Image from "next/image";

type FeatureCardItem = {
  title: string;
  description: string;
  iconUrl: string | React.ReactNode;
};

export function FeatureCard(props: FeatureCardItem) {
  const { title, description, iconUrl } = props;
  return (
    <div className="flex flex-row gap-4 rounded-lg py-3">
      <div>
        {typeof iconUrl === "string" ? (
          <Image
            alt=""
            className="mt-0.5"
            height={24}
            src={iconUrl}
            width={24}
          />
        ) : (
          iconUrl
        )}
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-lg">{title}</h4>
        <p className="max-w-[300px] text-muted-foreground text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
