import Link from "next/link";

export default async function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        <div className="max-w-[800px]">
          <h1 className="text-3xl lg:text-4xl tracking-tight font-bold mb-3">
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
