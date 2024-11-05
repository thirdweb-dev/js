import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DotNetIcon } from "components/icons/brand-icons/DotNetIcon";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "components/icons/brand-icons/UnrealIcon";
import { DocLink } from "components/shared/DocLink";
import { ArrowRightIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import accountAbstractionIcon from "../../../../../../public/assets/tw-icons/account-abstraction.svg";
import authIcon from "../../../../../../public/assets/tw-icons/auth.svg";
import payIcon from "../../../../../../public/assets/tw-icons/pay.svg";
import socialAuthIcon from "../../../../../../public/assets/tw-icons/social-auth.svg";
import walletsIcon from "../../../../../../public/assets/tw-icons/wallets.svg";

export function EmptyState() {
  return (
    <div className="container flex items-center justify-center p-6 md:h-[770px]">
      <div className="group container flex flex-col items-center justify-center gap-8 rounded-lg border bg-card p-6 py-24">
        <div className="flex max-w-[500px] flex-col items-center justify-center gap-6">
          <AnimatedIcons />
          <div className="flex flex-col gap-0.5 text-center">
            <h3 className="font-semibold text-2xl text-foreground">
              Project Overview is Coming Soon
            </h3>
            <p className="text-base text-muted-foreground">
              Understand how users are interacting with your project
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <SDKBadge
              icon={TypeScriptIcon}
              label="TypeScript"
              href="https://portal.thirdweb.com/typescript/v5"
            />
            <SDKBadge
              icon={ReactIcon}
              label="React"
              href="https://portal.thirdweb.com/react/v5"
            />
            <SDKBadge
              icon={ReactIcon}
              label="React Native"
              href="https://portal.thirdweb.com/react-native/v5"
            />
            <SDKBadge
              icon={UnityIcon}
              label="Unity"
              href="https://portal.thirdweb.com/unity/v5"
            />
            <SDKBadge
              icon={UnrealIcon}
              label="Unreal"
              href="https://portal.thirdweb.com/unreal-engine"
            />
            <SDKBadge
              icon={DotNetIcon}
              label=".NET"
              href="https://portal.thirdweb.com/dotnet"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="https://portal.thirdweb.com/connect" target="_blank">
              View Docs
            </Link>
          </Button>
          <Button asChild variant="primary">
            <Link href="https://thirdweb.com/dashboard/settings/api-keys">
              Get Started
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnimatedIcons() {
  return (
    <div className="-space-x-2 flex">
      <Icon
        icon={walletsIcon}
        className="-rotate-[16deg] group-hover:-rotate-[32deg] group-hover:-translate-x-[44px] group-hover:-translate-y-[12px] z-[0] translate-x-[0px] translate-y-[0px] scale-1 group-hover:scale-[1.2]"
      />
      <Icon
        icon={payIcon}
        className="-rotate-[12deg] group-hover:-rotate-[24deg] group-hover:-translate-x-[28px] -translate-y-[12px] group-hover:-translate-y-[40px] z-[1] translate-x-[0px] scale-1 group-hover:scale-[1.2]"
      />
      <Icon
        icon={authIcon}
        className="-translate-y-[16px] group-hover:-translate-y-[52px] z-[2] scale-1 group-hover:scale-[1.2]"
      />
      <Icon
        icon={accountAbstractionIcon}
        className="-translate-y-[12px] group-hover:-translate-y-[40px] z-[1] translate-x-[0px] rotate-[12deg] scale-1 group-hover:translate-x-[28px] group-hover:rotate-[24deg] group-hover:scale-[1.2]"
      />
      <Icon
        icon={socialAuthIcon}
        className="group-hover:-translate-y-[12px] z-[0] translate-x-[0px] translate-y-[0px] rotate-[16deg] scale-1 group-hover:translate-x-[44px] group-hover:rotate-[32deg] group-hover:scale-[1.2]"
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
        "flex size-10 items-center justify-center rounded-xl border bg-card transition-all duration-200 ease-in-out",
        className,
      )}
    >
      <Image
        src={icon}
        alt=""
        width={24}
        height={24}
        className="rounded-full"
      />
    </div>
  );
}

function SDKBadge({
  icon,
  label,
  href,
}: { icon: React.FC<{ className?: string }>; label: string; href: string }) {
  return (
    <div className="rounded-full bg-neutral-200 px-2.5 py-1 dark:bg-neutral-800">
      <DocLink link={href} label={label} icon={icon} />
    </div>
  );
}
