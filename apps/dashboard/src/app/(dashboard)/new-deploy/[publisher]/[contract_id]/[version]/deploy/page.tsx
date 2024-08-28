import { setOverrides } from "lib/vercel-utils";

setOverrides();

type PublishedContractVersionDeployPageProps = {
  params: {
    publisher: string;
    contract_id: string;
    version: string;
  };
};

export default function PublishedContractVersionDeployPage(
  props: PublishedContractVersionDeployPageProps,
) {
  return (
    <div className="container">
      deploy
      <pre>{JSON.stringify(props.params, null, 2)}</pre>
    </div>
  );
}
