import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1088,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://andromeda-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbWKNucbMtrMPPkHG5ZmVmvNUo8CzqHHcrpk1C2BVQsEG/2022_H-Brand_Stacked_WhiteGreen.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://www.metis.io",
  "name": "Metis Andromeda Mainnet",
  "nativeCurrency": {
    "name": "Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "networkId": 1088,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://metis-andromeda.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1088.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://andromeda.metis.io/?owner=1088"
  ],
  "shortName": "metis-andromeda",
  "slug": "metis-andromeda",
  "testnet": false
} as const satisfies Chain;