import { TrackedUnderlineLink } from "@/components/ui/tracked-link";
import { TRACKING_CATEGORY } from "../_constants";

export async function InAppWalletsHeader() {
  return (
    <div className="">
      <h1 className="mb-2 font-semibold text-2xl tracking-tighter lg:text-3xl">
        In-App Wallets
      </h1>
      <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. <br /> Email login, social login, and
        bring-your-own auth supported.{" "}
        <TrackedUnderlineLink
          target="_blank"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          label="learn-more"
          category={TRACKING_CATEGORY}
        >
          Learn more
        </TrackedUnderlineLink>
      </p>
    </div>
  );
}
