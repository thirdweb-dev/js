import { UnderlineLink } from "@/components/ui/UnderlineLink";

export async function InAppWalletsHeader() {
  return (
    <div className="">
      <h1 className="mb-1 font-semibold text-2xl tracking-tighter lg:text-3xl">
        Wallets
      </h1>
      <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. <br /> Email login, social login, and
        bring-your-own auth supported.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </UnderlineLink>
      </p>
    </div>
  );
}
