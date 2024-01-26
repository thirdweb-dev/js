import type { Chain } from "../src/types";
export default {
  "chain": "Evmos",
  "chainId": 9000,
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://testnet.escan.live",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.evmos.dev"
  ],
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
  "networkId": 9000,
  "rpc": [
    "https://evmos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmos-testnet.lava.build",
    "https://eth.bd.evmos.dev:8545"
  ],
  "shortName": "evmos-testnet",
  "slip44": 1,
  "slug": "evmos-testnet",
  "testnet": true
} as const satisfies Chain;