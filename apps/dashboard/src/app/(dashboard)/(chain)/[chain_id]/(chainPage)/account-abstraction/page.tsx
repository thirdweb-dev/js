import { redirect } from "next/navigation";
import { getChain } from "../../../utils";
import { InfoCard } from "../components/server/info-card";

export default async function Page(props: { params: { chain_id: string } }) {
  const chain = await getChain(props.params.chain_id);
  const enabled = chain.services.find(
    (s) => s.service === "account-abstraction",
  )?.enabled;

  if (!enabled) {
    redirect(`/${props.params.chain_id}`);
  }

  return (
    <div>
      <InfoCard
        title="Account Abstraction"
        links={[
          {
            label: "Get Started",
            href: "/dashboard/connect/account-abstraction",
          },
          {
            label: "Learn More",
            href: "https://portal.thirdweb.com/connect/account-abstraction/how-it-works",
          },
        ]}
      >
        <p>
          Everything you need to leverage account abstraction technology to
          enable seamless user experiences for your users.
        </p>
        <p>
          You get all the tools to integrate account abstraction into your app.
          This includes:
        </p>

        <div className="h-3" />

        <ul className="text-secondary-foreground pl-4 [&_li]:list-disc [&_li]:mb-3 [&_li]:pl-1">
          <li>
            Account factory contracts that let you spin up smart accounts for
            your users
          </li>

          <li>
            Bundler, which is the infrastructure needed to process account
            abstraction transactions (known as User Ops)
          </li>

          <li>
            Paymaster, which lets you sponsor transaction fees for your users
          </li>
        </ul>
      </InfoCard>
    </div>
  );
}
