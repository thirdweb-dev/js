import { getErc20Tokens } from "@/lib/assets/erc20";
import { getErc721Tokens } from "@/lib/assets/erc721";
import { SIMPLEHASH_SUPPORTED_CHAIN_IDS } from "@/util/simplehash";
import { isAddress } from "thirdweb";
import NftCard from "../../../../../components/NftCard";
import { getNativeBalances } from "../../../../../lib/assets/native";

export default async function Page({
  params: { address },
  searchParams: { chainId },
}: { params: { address: string }; searchParams: { chainId: string } }) {
  if (!isAddress(address)) {
    return <div>Invalid address</div>; // todo: reroute to 404 invalid address page
  }

  const erc721Tokens = await getErc721Tokens({
    owner: address,
    chainIds: chainId ? [Number(chainId)] : SIMPLEHASH_SUPPORTED_CHAIN_IDS,
    limit: 50,
  });

  // const nativeBalances = await getNativeBalances({
  //   address,
  //   chainIds: chainId ? [Number(chainId)] : SIMPLEHASH_SUPPORTED_CHAIN_IDS,
  // });

  // const erc20Tokens = await getErc20Tokens({
  //   owner: address,
  //   chainIds: chainId ? [Number(chainId)] : SIMPLEHASH_SUPPORTED_CHAIN_IDS,
  //   limit: 50,
  // });

  console.log(erc721Tokens);

  return (
    <div className="grid grid-cols-3 gap-4">
      {erc721Tokens.tokens.slice(0, 10).map((token) => (
        <NftCard key={token.contractAddress} data={token} />
      ))}
    </div>
  );
}
