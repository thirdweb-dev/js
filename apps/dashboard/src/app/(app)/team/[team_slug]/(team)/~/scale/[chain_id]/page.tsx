import { getChain } from "../../../../../../(dashboard)/(chain)/utils";

export default async function InfrastructurePage(props: {
  params: Promise<{
    team_slug: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  return <div>Infrastructure for: {chain.name}</div>;
}
