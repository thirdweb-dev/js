import type { Chain } from "../src/types";
export default {
  "chain": "EON",
  "chainId": 7332,
  "explorers": [
    {
      "name": "Horizen EON Block Explorer",
      "url": "https://eon-explorer.horizenlabs.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "infoURL": "https://horizen.io/",
  "name": "Horizen EON Mainnet",
  "nativeCurrency": {
    "name": "Zencash",
    "symbol": "ZEN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://horizen-eon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eon-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_eon"
  ],
  "shortName": "EON",
  "slug": "horizen-eon",
  "testnet": false
} as const satisfies Chain;