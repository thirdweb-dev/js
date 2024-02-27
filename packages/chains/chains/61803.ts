import type { Chain } from "../src/types";
export default {
  "chain": "Etica Protocol (ETI/EGAZ)",
  "chainId": 61803,
  "explorers": [
    {
      "name": "eticascan",
      "url": "https://eticascan.org",
      "standard": "EIP3091"
    },
    {
      "name": "eticastats",
      "url": "http://explorer.etica-stats.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://faucet.etica-stats.org/"
  ],
  "icon": {
    "url": "ipfs://QmYSyhUqm6ArWyALBe3G64823ZpEUmFdkzKZ93hUUhNKgU",
    "width": 360,
    "height": 361,
    "format": "png"
  },
  "infoURL": "https://eticaprotocol.org",
  "name": "Etica Mainnet",
  "nativeCurrency": {
    "name": "EGAZ",
    "symbol": "EGAZ",
    "decimals": 18
  },
  "networkId": 61803,
  "rpc": [
    "https://61803.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eticamainnet.eticascan.org",
    "https://eticamainnet.eticaprotocol.org"
  ],
  "shortName": "Etica",
  "slug": "etica",
  "testnet": false
} as const satisfies Chain;