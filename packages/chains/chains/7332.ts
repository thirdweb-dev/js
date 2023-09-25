import type { Chain } from "../src/types";
export default {
  "chainId": 7332,
  "chain": "EON",
  "name": "Horizen EON Mainnet",
  "rpc": [
    "https://horizen-eon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eon-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_eon"
  ],
  "slug": "horizen-eon",
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Zencash",
    "symbol": "ZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "shortName": "EON",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Horizen EON Block Explorer",
      "url": "https://eon-explorer.horizenlabs.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;