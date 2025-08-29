import { CodeServer } from "@/components/code/code";
import { mintExample } from "../constants";

export function MintCode() {
  return (
    <div className="">
      <div>
        <h2 className="mb-0.5 font-semibold text-2xl tracking-tight">Code</h2>
        <p className="text-muted-foreground">
          Code to implement above shown example
        </p>
      </div>

      <div className="h-4" />
      <h3 className="mb-2 font-semibold text-xl tracking-tight">
        Send Transaction Request to Mint Dynamic NFTs
      </h3>
      <CodeServer code={engineMintCode} lang="typescript" />

      <div className="h-8" />

      <div>
        <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
          Get Transaction Status
        </h3>
        <p className="mb-3 text-muted-foreground">
          Once you send a request to mint NFTs, you can poll for the status of
          the transaction using the following code.
        </p>
      </div>
      <CodeServer code={getEngineStatusCode} lang="typescript" />
    </div>
  );
}

const engineMintCode = `\
const chainId = ${mintExample.chainId};
const contractAddress = "${mintExample.contractAddress}";
const contract = getContract({
  address: ${mintExample.contractAddress},
  chain: defineChain(${mintExample.chainId}),
  client: THIRDWEB_CLIENT,
});

const transaction = mintTo({
    contract,
    to: "0x....",
    nft: {
      name: "...",
      description: "...",
      image: "...", // ipfs or https link to your asset
    },
    supply: "1",
  });

const serverWallet = Engine.serverWallet({
  address: BACKEND_WALLET_ADDRESS,
  client: THIRDWEB_CLIENT,
  vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
});

const { transactionId } = await serverWallet.enqueueTransaction({ transaction });
`;

const getEngineStatusCode = `\
const result = await Engine.getTransactionStatus({
  client: THIRDWEB_CLIENT,
  transactionId: transactionId,
});

console.log(result.status);

// or wait for the transaction to be mined (polls status until it's mined)
const result = await Engine.waitForTransactionHash({
  client: THIRDWEB_CLIENT,
  transactionId: transactionId,
});

console.log(result.transactionHash);
`;
