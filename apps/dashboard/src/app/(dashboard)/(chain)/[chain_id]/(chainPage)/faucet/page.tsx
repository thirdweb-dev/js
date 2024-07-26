import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { THIRDWEB_ENGINE_FAUCET_WALLET } from "@/constants/env";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { getIpAddress } from "lib/ip";
import { cacheTtl } from "lib/redis";
import { redirect } from "next/navigation";
import type { Metadata } from "next/types";
import { getChain } from "../../../utils";
import { InfoCard } from "../components/server/info-card";
import { TestnetSpinWheel } from "./components/SpinWheel";

export async function generateMetadata({
  params,
}: { params: { chain_id: string } }): Promise<Metadata> {
  const chain = await getChain(params.chain_id);
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  return {
    title: `thirdweb ${sanitizedChainName} faucet`,
    description: `Get ${chain.nativeCurrency.symbol} testnet funds on ${chain.name}. Powered by thirdweb.`,
  };
}

export default async function Page(props: { params: { chain_id: string } }) {
  const chain = await getChain(props.params.chain_id);

  if (!chain.testnet) {
    redirect(`/${props.params.chain_id}`);
  }

  // Check eligibilty.
  const ipAddress = getIpAddress();
  const cacheKey = `testnet-faucet:${chain.chainId}:${ipAddress}`;
  const ttlSeconds = await cacheTtl(cacheKey);

  return (
    <>
      <div className="items-center">
        <h3 className="mb-3 text-lg font-semibold"> Faucet </h3>
        <ClientOnly ssr={null}>
          <TestnetSpinWheel chain={chain} ttlSeconds={ttlSeconds} />
        </ClientOnly>

        <div className="h-10" />

        <InfoCard title="Resources">
          <h3 className="mb-2 text-lg font-semibold">What is a faucet?</h3>
          <p>
            An testnet faucet is an online service that provides free testnet
            currency to web3 app and blockchain developers. This allows them to
            experiment with and test smart contracts and decentralized
            applications (dApps) on EVM testnets like {chain.name} without using
            real cryptocurrency.
          </p>

          <h2>How often can I claim from the faucet?</h2>
          <p>You may claim funds once per testnet chain every 24 hours.</p>

          <h3 className="mb-2 text-lg font-semibold">
            How can I refill the faucet?
          </h3>
          <p>Please send funds the following address:</p>
          <div>
            <CopyTextButton
              textToCopy={THIRDWEB_ENGINE_FAUCET_WALLET}
              textToShow={THIRDWEB_ENGINE_FAUCET_WALLET}
              tooltip="Copy"
              copyIconPosition="right"
              className="mb-2"
            />
          </div>

          <h3 className="mb-2 text-lg font-semibold">
            How does the faucet work?
          </h3>
          <p>
            When you request testnet funds, a multi-chain backend wallet
            transfers a small amount of {chain.nativeCurrency.symbol} on{" "}
            {chain.name} with{" "}
            <a
              href="https://thirdweb.com/engine"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              thirdweb Engine
            </a>
            .
          </p>
        </InfoCard>
      </div>
    </>
  );
}
