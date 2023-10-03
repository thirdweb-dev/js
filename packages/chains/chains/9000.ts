import type { Chain } from "../src/types";
export default {
  "chain": "Evmos",
  "chainId": 9000,
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://testnet.escan.live",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.evmos.dev"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://evmos.org",
  "name": "Evmos Testnet",
  "nativeCurrency": {
    "name": "test-Evmos",
    "symbol": "tEVMOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://evmos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.bd.evmos.dev:8545"
  ],
  "shortName": "evmos-testnet",
  "slug": "evmos-testnet",
  "testnet": true
} as const satisfies Chain;