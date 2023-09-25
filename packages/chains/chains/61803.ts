import type { Chain } from "../src/types";
export default {
  "chainId": 61803,
  "chain": "Etica Protocol (ETI/EGAZ)",
  "name": "Etica Mainnet",
  "rpc": [
    "https://etica.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eticamainnet.eticascan.org",
    "https://eticamainnet.eticaprotocol.org"
  ],
  "slug": "etica",
  "icon": {
    "url": "ipfs://QmYSyhUqm6ArWyALBe3G64823ZpEUmFdkzKZ93hUUhNKgU",
    "width": 360,
    "height": 361,
    "format": "png"
  },
  "faucets": [
    "http://faucet.etica-stats.org/"
  ],
  "nativeCurrency": {
    "name": "EGAZ",
    "symbol": "EGAZ",
    "decimals": 18
  },
  "infoURL": "https://eticaprotocol.org",
  "shortName": "Etica",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;