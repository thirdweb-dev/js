import Link from "next/link";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
        <div className="max-w-[800px]">
          <h1 className="mb-3 font-bold text-3xl tracking-tight lg:text-4xl">
            Pay
          </h1>
          <p className="text-muted-foreground leading-7">
            Pay allows your users to purchase cryptocurrencies and execute
            transactions with their credit card or debit card, or with any token
            via cross-chain routing.{" "}
            <Link
              target="_blank"
              href="https://portal.thirdweb.com/connect/pay/overview"
              className="!text-link-foreground"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>

      {props.children}
    </div>
  );
}
