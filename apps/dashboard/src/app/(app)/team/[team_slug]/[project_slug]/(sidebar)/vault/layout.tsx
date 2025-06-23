import Link from "next/link";

export default function VaultLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex grow flex-col">
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">Vault</h1>
          <p className="text-muted-foreground text-sm">
            Secure, non-custodial key management system for your server wallets.{" "}
            <Link
              className="underline"
              href="https://portal.thirdweb.com/vault"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more.
            </Link>
          </p>
        </div>
      </div>
      <div className="h-6" />

      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>

      <div className="h-20" />
    </div>
  );
}
