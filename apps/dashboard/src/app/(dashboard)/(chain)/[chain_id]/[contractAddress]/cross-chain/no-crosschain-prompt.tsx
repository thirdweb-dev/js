import Link from "next/link";

export function NoCrossChainPrompt() {
  return (
    <div>
      Multi-chain deployments are not available for this contract. Deploy a new
      contract to enable this functionality.
      <br />
      <br />
      <Link href="/explore" target="_blank" className="text-blue-500 underline">
        Explore contracts
      </Link>
    </div>
  );
}
