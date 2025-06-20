import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import headerImage from "../../assets/header.png";

export function EcosystemWalletPricingCard(props: { className?: string }) {
  return (
    <div
      className={cn(
        "flex max-w-sm grow flex-col overflow-hidden border-t lg:border-t-0 lg:border-l",
        props.className,
      )}
    >
      <Image alt="" className="w-full" sizes="50vw" src={headerImage} />

      <div className="relative flex grow flex-col border-border border-t p-4 lg:p-6">
        <h4 className="flex items-center gap-2 font-semibold text-4xl text-foreground tracking-tight">
          $250{" "}
          <span className="font-normal text-lg text-muted-foreground">
            per month
          </span>
        </h4>

        <ul className="mt-5 flex flex-col gap-3 text-muted-foreground text-sm">
          <li className="flex items-start gap-2">
            <CheckIcon className="size-4 text-green-500 md:mt-0.5" /> Share
            assets across apps within your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="size-4 text-green-500 md:mt-0.5" /> Connect
            with social, phone, email, or passkey
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="size-4 text-green-500 md:mt-0.5" /> A
            standalone wallet UI for all your users
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="size-4 text-green-500 md:mt-0.5" /> Custom
            permissions and billing across your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="size-4 text-green-500 md:mt-0.5" /> 30,000
            active wallets included*
          </li>
        </ul>
        <p className="mt-auto pt-5 text-right text-muted-foreground text-xs italic">
          * $0.02 per additional wallet
        </p>
      </div>
    </div>
  );
}
