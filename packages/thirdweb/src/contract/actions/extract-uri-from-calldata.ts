import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { eth_getTransactionByHash } from "../../rpc/actions/eth_getTransactionByHash.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { download } from "../../storage/download.js";
import { decodeUriFromCalldata } from "../../utils/any-evm/decode-uri-from-calldata.js";

export async function extractUriFromCalldata(options: {
  client: ThirdwebClient;
  chain: Chain;
  contractAddress: `0x${string}`;
}) {
  const res = await fetch(
    `https://contract.thirdweb-dev.com/creation/${options.chain.id}/${options.contractAddress}`,
  );
  const creationData = await res.json();

  if (creationData.status === "1" && creationData.result[0]?.txHash) {
    const rpcClient = getRpcClient({
      client: options.client,
      chain: options.chain,
    });
    const creationTx = await eth_getTransactionByHash(rpcClient, {
      hash: creationData.result[0]?.txHash,
    });

    const uri = decodeUriFromCalldata({
      initCalldata: creationTx.input,
    });

    const res = await download({
      client: options.client,
      uri,
    });
    const metadata = await res.json();

    return metadata;
  } else {
    throw new Error("Creation transaction can't be fetched");
  }
}
