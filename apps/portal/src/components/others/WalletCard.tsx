import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/Document";

type WalletInfo = { href: string; label: string; icon: StaticImport };

export function WalletCard(props: WalletInfo) {
  return (
    <div className="group/wallet-card relative rounded-[26px] border bg-card px-5 py-2 transition-colors hover:border-active-border">
      <div className="mt-[-30px] flex flex-col justify-center gap-1">
        <Link
          aria-label={props.label}
          className="absolute inset-0"
          href={props.href}
        />
        <Image
          alt=""
          className="size-20 rounded-[16px] border bg-background p-2 transition-transform duration-300 group-hover/wallet-card:scale-110 group-hover/wallet-card:border-foreground"
          src={props.icon}
        />
        <Heading
          anchorId={props.label}
          className="font-medium text-base text-foreground group-hover/wallet-card:text-foreground md:text-base"
          level={3}
        >
          {props.label}
        </Heading>
      </div>
    </div>
  );
}

export function WalletCardGrid(props: { children: React.ReactNode }) {
  return (
    <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
      {props.children}
    </div>
  );
}
