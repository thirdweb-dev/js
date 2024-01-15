import { createClient } from "./src";

const client = createClient({ clientId: "foo" });

const encode1 = await client
  .createTx({
    address: "0x679fcB84162267426D8175DA205714A7B2Ca015f",
    chainId: 137,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
  })
  .encode();

console.log("encode1", encode1);

const contract = client.getContract({
  address: "0x679fcB84162267426D8175DA205714A7B2Ca015f",
  chainId: 137,
});

const encode2 = await contract
  .createTx({
    method: "function balanceOf(address owner) view returns (uint256)",
    params: async () => ["0x0890C23024089675D072E984f28A93bb391a35Ab"] as const,
  })
  .encode();

console.log("encode2", encode2);

const encode3 = await contract
  .createTx({
    method: "balanceOf",
    params: async () => ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
  })
  .encode();

console.log("encode3", encode3);
