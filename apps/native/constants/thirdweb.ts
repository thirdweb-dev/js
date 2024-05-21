import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: "1f8cc222ef2e72d2d9cb5470cd5e0594",
});

export const chain = baseSepolia;

export const contract = getContract({
  client,
  address: "0x82e50a6BF13A70366eDFC871f8FB8a428C43Dc03",
  chain,
});
