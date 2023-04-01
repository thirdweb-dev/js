import type { Chain } from "../src/types";
export default {
  "name": "Exzo Network Mainnet",
  "chain": "EXZO",
  "icon": {
    "url": "ipfs://QmeYpc2JfEsHa2Bh11SKRx3sgDtMeg6T8KpXNLepBEKnbJ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Exzo",
    "symbol": "XZO",
    "decimals": 18
  },
  "infoURL": "https://exzo.network",
  "shortName": "xzo",
  "chainId": 1229,
  "networkId": 1229,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exzoscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "exzo-network"
} as const satisfies Chain;