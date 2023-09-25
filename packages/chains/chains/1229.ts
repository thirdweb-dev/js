import type { Chain } from "../src/types";
export default {
  "chainId": 1229,
  "chain": "EXZO",
  "name": "Exzo Network Mainnet",
  "rpc": [
    "https://exzo-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.exzo.technology"
  ],
  "slug": "exzo-network",
  "icon": {
    "url": "ipfs://QmeYpc2JfEsHa2Bh11SKRx3sgDtMeg6T8KpXNLepBEKnbJ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Exzo",
    "symbol": "XZO",
    "decimals": 18
  },
  "infoURL": "https://exzo.network",
  "shortName": "xzo",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exzoscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;