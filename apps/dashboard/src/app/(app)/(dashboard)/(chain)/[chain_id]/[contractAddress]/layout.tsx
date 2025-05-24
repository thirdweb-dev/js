import type { Metadata } from "next";
import {
  SharedContractLayout,
  generateContractLayoutMetadata,
} from "./shared-layout";

export default async function Layout(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  return (
    <SharedContractLayout
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
    >
      {props.children}
    </SharedContractLayout>
  );
}

export async function generateMetadata(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}): Promise<Metadata> {
  const params = await props.params;
  return generateContractLayoutMetadata({
    contractAddress: params.contractAddress,
    chainIdOrSlug: params.chain_id,
  });
}
