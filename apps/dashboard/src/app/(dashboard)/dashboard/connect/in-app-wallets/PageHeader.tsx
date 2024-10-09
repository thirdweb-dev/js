import { TrackedLinkTW } from "@/components/ui/tracked-link";

export function PageHeader() {
  return (
    <div>
      <h1 className="font-semibold text-3xl tracking-tigher">In-App Wallets</h1>
      <div className="h-3" />
      <p className="max-w-[500px] text-muted-foreground ">
        A wallet infrastructure that enables apps to create, manage, and control
        their users wallets. Email login, social login, and bring-your-own auth
        supported.{" "}
        <TrackedLinkTW
          target="_blank"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          label="learn-more"
          category="embedded-wallet"
          className="text-link-foreground hover:text-foreground"
        >
          Learn more
        </TrackedLinkTW>
      </p>
    </div>
  );
}
