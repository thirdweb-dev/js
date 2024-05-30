import type { Chain } from "../src/types";
export default {
  "chain": "EXZO",
  "chainId": 1229,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exzoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeYpc2JfEsHa2Bh11SKRx3sgDtMeg6T8KpXNLepBEKnbJ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://exzo.network",
  "name": "Exzo Network Mainnet",
  "nativeCurrency": {
    "name": "Exzo",
    "symbol": "XZO",
    "decimals": 18
  },
  "networkId": 1229,
  "rpc": [
    "https://1229.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.exzo.technology"
  ],
  "shortName": "xzo",
  "slug": "exzo-network",
  "testnet": false
} as const satisfies Chain;