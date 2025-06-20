const customClaimAmounts: Record<number, number> = {
  // Aleph Zero
  2039: 0.1,
  // Aavegotchi Polter
  631571: 0.1,
  // Sophon testnet
  531050104: 5,
};

const defaultClaimAmount = 0.01;

export function getFaucetClaimAmount(chainId: number) {
  return customClaimAmounts[chainId] || defaultClaimAmount;
}
