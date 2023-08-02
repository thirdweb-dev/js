import {
  Web3Button,
  useAddress,
  useContract,
  useNFT,
  useNFTBalance,
} from "@thirdweb-dev/react";
import { NFTShowcase } from "./NFTShowcase";
import { BigNumber } from "ethers";

export const ClaimNFT = () => {
  const address = useAddress();
  const nftContractAddress = "0x11e76ab2e2C48e4a561ac96935399c8595619FA4";
  const { contract } = useContract(nftContractAddress);
  const { data: nft } = useNFT(contract, "1");
  const nftBalance = useNFTBalance(contract, address);
  const hasClaimed = BigNumber.from(nftBalance.data || 0).gt(0);

  if (hasClaimed) {
    return <NFTShowcase nft={nft} />;
  }

  return (
    <Web3Button
      contractAddress={nftContractAddress}
      action={(cntr) => cntr.erc721.claim(1)}
    >
      Claim
    </Web3Button>
  );
};
