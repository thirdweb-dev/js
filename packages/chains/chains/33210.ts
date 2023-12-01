import type { Chain } from "../src/types";
export default {
  "chain": "CLOUDVERSE",
  "chainId": 33210,
  "explorers": [
    {
      "name": "CLOUDVERSE Explorer",
      "url": "https://subnets.avax.network/cloudverse",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://muadao.build/",
  "name": "Cloudverse Subnet",
  "nativeCurrency": {
    "name": "XCLOUD",
    "symbol": "XCLOUD",
    "decimals": 18
  },
  "networkId": 33210,
  "rpc": [
    "https://cloudverse-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://33210.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/cloudverse/mainnet/rpc"
  ],
  "shortName": "cloudverse",
  "slug": "cloudverse-subnet",
  "testnet": false
} as const satisfies Chain;