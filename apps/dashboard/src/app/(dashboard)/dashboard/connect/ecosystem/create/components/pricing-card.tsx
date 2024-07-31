import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import headerImage from "../../assets/header.png";

export function EcosystemWalletPricingCard(props: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-border shadow rounded-xl bg-card",
        props.className,
      )}
    >
      <Image src={headerImage} alt="" sizes="50vw" className="w-full" />
      <div className="p-4 pb-8 border-t border-border md:p-6 md:pb-8 relative">
        <h4 className="text-4xl font-bold text-foreground">
          $250{" "}
          <span className="text-lg font-normal text-muted-foreground">
            per month
          </span>
        </h4>
        <ul className="flex flex-col gap-4 mt-6 text-sm md:text-base text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckIcon className="w-5 h-5 text-green-500 md:mt-0.5" /> Share
            assets across apps within your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-5 h-5 text-green-500 md:mt-0.5" /> Connect
            with social, phone, email, or passkey
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-5 h-5 text-green-500 md:mt-0.5" /> A
            standalone wallet UI for all your users
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-5 h-5 text-green-500 md:mt-0.5" /> Custom
            permissions and billing across your ecosystem
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-5 h-5 text-green-500 md:mt-0.5" /> 30,000
            active wallets included*
          </li>
        </ul>
        <p className="mt-4 text-xs italic text-muted-foreground text-right">
          $0.02 per additional wallet
        </p>
      </div>
    </div>
  );
}
