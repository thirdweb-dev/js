import { notFound } from "next/navigation";
import { EventsFeed } from "../../../../../../contract-ui/tabs/events/components/events-feed";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  return <EventsFeed contract={info.contract} />;
}
