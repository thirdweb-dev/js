import type { Chain } from "../src/types";
export default {
  "chain": "PLAYFAIR",
  "chainId": 12898,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets-test.avax.network/letsplayfair",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNvoUp2RWiWQzHUKrZ7SnPzwF3FbCNd3jSdpGJhQdH1y5",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://letsplayfair.ai",
  "name": "PlayFair Testnet Subnet",
  "nativeCurrency": {
    "name": "BTLT Token",
    "symbol": "BTLT",
    "decimals": 18
  },
  "networkId": 12898,
  "rpc": [
    "https://12898.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.letsplayfair.ai/ext/bc/2hhXFNp1jR4RuqvCmWQnBtt9CZnCmmyGr7TNTkxt7XY7pAzHMY/rpc"
  ],
  "shortName": "playfair",
  "slug": "playfair-testnet-subnet",
  "testnet": true
} as const satisfies Chain;