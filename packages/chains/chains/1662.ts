import type { Chain } from "../src/types";
export default {
  "chain": "Yuma",
  "chainId": 1662,
  "explorers": [],
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
  "name": "Horizen Yuma Testnet Deprecated",
  "nativeCurrency": {
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "networkId": 1662,
  "rpc": [],
  "shortName": "Yuma",
  "slip44": 121,
  "slug": "horizen-yuma-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;