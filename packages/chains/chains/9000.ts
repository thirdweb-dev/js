import type { Chain } from "../src/types";
export default {
  "chainId": 9000,
  "chain": "Evmos",
  "name": "Evmos Testnet",
  "rpc": [
    "https://evmos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.bd.evmos.dev:8545"
  ],
  "slug": "evmos-testnet",
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [
    "https://faucet.evmos.dev"
  ],
  "nativeCurrency": {
    "name": "test-Evmos",
    "symbol": "tEVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "shortName": "evmos-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://testnet.escan.live",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;