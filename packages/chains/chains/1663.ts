import type { Chain } from "../src/types";
export default {
  "name": "Horizen Gobi Testnet",
  "shortName": "Gobi",
  "chain": "Gobi",
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "rpc": [
    "https://horizen-gobi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gobi-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_gobi_testnet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [
    "https://faucet.horizen.io"
  ],
  "nativeCurrency": {
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "chainId": 1663,
  "networkId": 1663,
  "slip44": 121,
  "explorers": [
    {
      "name": "Gobi Testnet Block Explorer",
      "url": "https://gobi-explorer.horizen.io",
      "icon": {
        "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
        "width": 1213,
        "height": 1213,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "horizen-gobi-testnet"
} as const satisfies Chain;