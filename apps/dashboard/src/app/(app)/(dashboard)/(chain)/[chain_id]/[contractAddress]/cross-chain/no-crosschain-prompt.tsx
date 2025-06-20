import Link from "next/link";

export function NoCrossChainPrompt() {
  return (
    <div>
      Multi-chain deployments are not available for this contract (or chain).
      <br />
      Please ensure the chain is supported or deploy a new contract to enable
      this functionality.
      <br />
      <br />
      <Link
        className="text-blue-500 underline"
        href="/explore"
        rel="noopener noreferrer"
        target="_blank"
      >
        Explore contracts
      </Link>
    </div>
  );
}
