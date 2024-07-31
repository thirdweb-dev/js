import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ChainIcon } from "../../../components/server/chain-icon";

type ChainHeaderProps = {
  headerImageUrl?: string;
  logoUrl?: string;
  mobileButton: React.ReactNode;
};

export function ChainHeader(props: ChainHeaderProps) {
  return (
    // force the banner image to be 4:1 aspect ratio and full-width on mobile devices
    <div className="flex flex-col">
      <AspectRatio
        ratio={props.headerImageUrl ? 4 : 8}
        className="border-b border-border -mx-4 lg:-mx-6"
      >
        {props.headerImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={props.headerImageUrl}
            alt=""
            className="object-cover object-center h-full w-full"
          />
        )}
      </AspectRatio>

      {/* below header */}
      <div className="relative flex flex-row justify-end items-end">
        {/* chain logo */}

        <ChainIcon
          iconUrl={props.logoUrl}
          className="p-2 lg:p-4 absolute top-0 left-0 size-20 lg:size-36 rounded-full bg-background -translate-y-[50%] overflow-hidden border border-border"
        />

        {/* action group */}
        <div className="pt-3 lg:pt-6">
          <div className="hidden lg:flex flex-row gap-2">
            <Button variant="primary">Get started with thirdweb</Button>
          </div>
          {props.mobileButton}
        </div>
      </div>
    </div>
  );
}
