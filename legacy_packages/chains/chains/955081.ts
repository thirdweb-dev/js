import type { Chain } from "../src/types";
export default {
  "chain": "JONO12",
  "chainId": 955081,
  "explorers": [
    {
      "name": "JONO12 Explorer",
      "url": "https://subnets-test.avax.network/jono12",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreievzx4ke62dtc77o47x7vs7nn67ghzrwku6h5dxo3hwcsqfeblke4",
    "width": 612,
    "height": 612,
    "format": "png"
  },
  "name": "Jono12 Subnet",
  "nativeCurrency": {
    "name": "Jono12 Token",
    "symbol": "JONO",
    "decimals": 18
  },
  "networkId": 955081,
  "rpc": [
    "https://955081.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jono12/testnet/rpc"
  ],
  "shortName": "jono12",
  "slug": "jono12-subnet",
  "testnet": true
} as const satisfies Chain;