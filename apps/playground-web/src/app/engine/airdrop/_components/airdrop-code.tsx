import { Code } from "../../../../components/code/code";
import { airdropExample } from "../constants";

export function AirdropCode() {
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
        Send Airdrop Transaction Request
      </h3>
      <Code code={engineAirdropSendCode} lang="typescript" />

      <div className="h-8" />

      <div>
        <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
          Get Transaction Status
        </h3>
        <p className="mb-3 text-muted-foreground">
          Once you send a request to airdrop tokens, you can poll for the status
          of the transaction using the following code.
        </p>
      </div>
      <Code code={engineAirdropGetStatus} lang="typescript" />
    </div>
  );
}

const engineAirdropSendCode = `\
const addresses = ${JSON.stringify(
  airdropExample.receivers.map((x) => ({
    recipient: x.toAddress,
    amount: x.amount,
  })),
  null,
  2,
)};

const contract = getContract({
  address: ${airdropExample.contractAddress},
  chain: defineChain(${airdropExample.chainId}),
  client: THIRDWEB_CLIENT,
});

const transaction = airdropERC20({
    contract,
    tokenAddress: ${airdropExample.contractAddress},
    contents: addresses,
  });

const serverWallet = Engine.serverWallet({
  address: BACKEND_WALLET_ADDRESS,
  client: THIRDWEB_CLIENT,
  vaultAccessToken: ENGINE_VAULT_ACCESS_TOKEN,
});

const { transactionId } = await serverWallet.enqueueTransaction({ transaction });
`;

const engineAirdropGetStatus = `\
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
