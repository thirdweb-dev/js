import { WalletAddress } from "@/components/blocks/wallet-address";

interface WalletProfileProps {
  address: string;
}

export function WalletProfile({ address }: WalletProfileProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h1 className="mb-2 font-bold text-3xl">Wallet Overview</h1>
      <div className="flex-1" />
      <WalletAddress address={address} shortenAddress={false} />
    </div>
  );
}
