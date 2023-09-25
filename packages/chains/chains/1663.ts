import type { Chain } from "../src/types";
export default {
  "chainId": 1663,
  "chain": "Gobi",
  "name": "Horizen Gobi Testnet",
  "rpc": [
    "https://horizen-gobi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gobi-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_gobi_testnet"
  ],
  "slug": "horizen-gobi-testnet",
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "faucets": [
    "https://faucet.horizen.io"
  ],
  "nativeCurrency": {
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "shortName": "Gobi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Gobi Testnet Block Explorer",
      "url": "https://gobi-explorer.horizen.io",
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