import type { Chain } from "../src/types";
export default {
  "name": "Horizen EON Mainnet",
  "shortName": "EON",
  "chain": "EON",
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "rpc": [
    "https://horizen-eon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eon-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_eon"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zencash",
    "symbol": "ZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "chainId": 7332,
  "networkId": 7332,
  "slip44": 121,
  "explorers": [
    {
      "name": "Horizen EON Block Explorer",
      "url": "https://eon-explorer.horizenlabs.io",
      "icon": {
        "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
        "width": 1213,
        "height": 1213,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "horizen-eon"
} as const satisfies Chain;