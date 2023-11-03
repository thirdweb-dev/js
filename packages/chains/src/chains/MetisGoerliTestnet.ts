import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 599,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://goerli.explorer.metisdevops.link",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://goerli.faucet.metisdevops.link"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmbWKNucbMtrMPPkHG5ZmVmvNUo8CzqHHcrpk1C2BVQsEG/2022_H-Brand_Stacked_WhiteGreen.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://www.metis.io",
  "name": "Metis Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "networkId": 599,
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://testnet-bridge.metis.io"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://metis-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://599.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.gateway.metisdevops.link"
  ],
  "shortName": "metis-goerli",
  "slug": "metis-goerli-testnet",
  "testnet": false
} as const satisfies Chain;