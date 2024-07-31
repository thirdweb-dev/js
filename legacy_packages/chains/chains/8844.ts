import type { Chain } from "../src/types";
export default {
  "chain": "HYDRA",
  "chainId": 8844,
  "explorers": [
    {
      "name": "Hydra Chain Testnet explorer",
      "url": "https://hydragon.hydrachain.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVxyUjuA8t9q3oWDgv8ExqaUXcRuDqiKrZAiLaBWHYcmG",
        "width": 722,
        "height": 813,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://app.testnet.hydrachain.org/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmVxyUjuA8t9q3oWDgv8ExqaUXcRuDqiKrZAiLaBWHYcmG",
    "width": 722,
    "height": 813,
    "format": "png"
  },
  "infoURL": "https://hydrachain.org",
  "name": "Hydra Chain Testnet",
  "nativeCurrency": {
    "name": "tHydra",
    "symbol": "tHYDRA",
    "decimals": 18
  },
  "networkId": 8844,
  "rpc": [
    "https://8844.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.hydrachain.org"
  ],
  "shortName": "THYDRA",
  "slug": "hydra-chain-testnet",
  "testnet": true
} as const satisfies Chain;