import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import headerImage from "../../assets/header.png";

export function EcosystemWalletPricingCard(props: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow",
        props.className,
      )}
    >
      <Image src={headerImage} alt="" sizes="50vw" className="w-full" />
      <div className="relative border-border border-t p-4 pb-8 md:p-6 md:pb-8">
        <h4 className="font-bold text-4xl text-foreground">
          $250{" "}
          <span className="font-normal text-lg text-muted-foreground">
            per month
          </span>
        </h4>
        <ul className="mt-6 flex flex-col gap-4 text-muted-foreground text-sm md:text-base">
          <li className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 md:mt-0.5" /> Share
            assets across apps within your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 md:mt-0.5" /> Connect
            with social, phone, email, or passkey
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 md:mt-0.5" /> A
            standalone wallet UI for all your users
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 md:mt-0.5" /> Custom
            permissions and billing across your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 md:mt-0.5" /> 30,000
            active wallets included*
          </li>
        </ul>
        <p className="mt-4 text-right text-muted-foreground text-xs italic">
          $0.02 per additional wallet
        </p>
      </div>
    </div>
  );
}
