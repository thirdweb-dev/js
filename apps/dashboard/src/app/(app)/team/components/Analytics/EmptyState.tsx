import { ArrowRightIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { DocLink } from "@/components/blocks/DocLink";
import { Button } from "@/components/ui/button";
import { DotNetIcon } from "@/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "@/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "@/icons/brand-icons/UnrealIcon";
import { cn } from "@/lib/utils";
import accountAbstractionIcon from "../../../../../../public/assets/tw-icons/account-abstraction.svg";
import authIcon from "../../../../../../public/assets/tw-icons/auth.svg";
import payIcon from "../../../../../../public/assets/tw-icons/pay.svg";
import socialAuthIcon from "../../../../../../public/assets/tw-icons/social-auth.svg";
import walletsIcon from "../../../../../../public/assets/tw-icons/wallets.svg";

export function EmptyState() {
  return (
    <section className="group container flex h-full w-full grow flex-col items-center justify-center gap-8 rounded-lg border bg-card p-6 py-24 md:min-h-[500px]">
      <div className="flex max-w-[500px] flex-col items-center justify-center gap-6">
        <AnimatedIcons />
        <div className="flex flex-col gap-0.5 text-center">
          <h3 className="font-semibold text-2xl text-foreground">
            Get Started with the TypeScript SDK
          </h3>
          <p className="text-base text-muted-foreground">
            Add the TypeScript SDK to your app to start collecting analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SDKBadge
            href="https://portal.thirdweb.com/typescript/v5"
            icon={TypeScriptIcon}
            label="TypeScript"
          />
          <SDKBadge
            href="https://portal.thirdweb.com/react/v5"
            icon={ReactIcon}
            label="React"
          />
          <SDKBadge
            href="https://portal.thirdweb.com/react-native/v5"
            icon={ReactIcon}
            label="React Native"
          />
          <SDKBadge
            href="https://portal.thirdweb.com/unity/v5"
            icon={UnityIcon}
            label="Unity"
          />
          <SDKBadge
            href="https://portal.thirdweb.com/unreal-engine"
            icon={UnrealIcon}
            label="Unreal"
          />
          <SDKBadge
            href="https://portal.thirdweb.com/dotnet"
            icon={DotNetIcon}
            label=".NET"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild className="min-w-36" variant="primary">
          <Link
            href="https://portal.thirdweb.com/wallets"
            rel="noopener noreferrer"
            target="_blank"
          >
            View Docs <ArrowRightIcon className="ml-2 h-4 w-auto" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function AnimatedIcons() {
  return (
    <div className="-space-x-2 flex">
      <Icon
        className="-rotate-[16deg] group-hover:-rotate-[32deg] group-hover:-translate-x-[44px] group-hover:-translate-y-[12px] z-[0] translate-x-[0px] translate-y-[0px] scale-1 group-hover:scale-[1.2]"
        icon={walletsIcon}
      />
      <Icon
        className="-rotate-[12deg] group-hover:-rotate-[24deg] group-hover:-translate-x-[28px] -translate-y-[12px] group-hover:-translate-y-[40px] z-[1] translate-x-[0px] scale-1 group-hover:scale-[1.2]"
        icon={payIcon}
      />
      <Icon
        className="-translate-y-[16px] group-hover:-translate-y-[52px] z-[2] scale-1 group-hover:scale-[1.2]"
        icon={authIcon}
      />
      <Icon
        className="-translate-y-[12px] group-hover:-translate-y-[40px] z-[1] translate-x-[0px] rotate-[12deg] scale-1 group-hover:translate-x-[28px] group-hover:rotate-[24deg] group-hover:scale-[1.2]"
        icon={accountAbstractionIcon}
      />
      <Icon
        className="group-hover:-translate-y-[12px] z-[0] translate-x-[0px] translate-y-[0px] rotate-[16deg] scale-1 group-hover:translate-x-[44px] group-hover:rotate-[32deg] group-hover:scale-[1.2]"
        icon={socialAuthIcon}
      />
    </div>
  );
}

function Icon({
  icon,
  className,
}: {
  icon: StaticImageData;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-xl border bg-background transition-all duration-200 ease-in-out",
        className,
      )}
    >
      <Image
        alt=""
        className="rounded-full"
        height={24}
        src={icon}
        width={24}
      />
    </div>
  );
}

function SDKBadge({
  icon,
  label,
  href,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <div className="rounded-full bg-muted px-2.5 py-1">
      <DocLink icon={icon} label={label} link={href} />
    </div>
  );
}
