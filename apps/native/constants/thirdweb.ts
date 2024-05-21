import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: "c0235bde0f26718b6d5ccdf7dd550846",
});

export const chain = baseSepolia;

export const contract = getContract({
  client,
  address: "0x82e50a6BF13A70366eDFC871f8FB8a428C43Dc03",
  chain,
});
