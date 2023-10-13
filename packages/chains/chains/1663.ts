import type { Chain } from "../src/types";
export default {
  "chain": "Gobi",
  "chainId": 1663,
  "explorers": [
    {
      "name": "Gobi Testnet Block Explorer",
      "url": "https://gobi-explorer.horizen.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.horizen.io"
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
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "infoURL": "https://horizen.io/",
  "name": "Horizen Gobi Testnet",
  "nativeCurrency": {
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://horizen-gobi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gobi-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_gobi_testnet"
  ],
  "shortName": "Gobi",
  "slug": "horizen-gobi-testnet",
  "testnet": true
} as const satisfies Chain;