import type { Chain } from "../src/types";
export default {
  "chainId": 599,
  "chain": "ETH",
  "name": "Metis Goerli Testnet",
  "rpc": [
    "https://metis-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.gateway.metisdevops.link"
  ],
  "slug": "metis-goerli-testnet",
  "icon": {
    "url": "ipfs://QmbWKNucbMtrMPPkHG5ZmVmvNUo8CzqHHcrpk1C2BVQsEG/2022_H-Brand_Stacked_WhiteGreen.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://goerli.faucet.metisdevops.link"
  ],
  "nativeCurrency": {
    "name": "Goerli Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "shortName": "metis-goerli",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://goerli.explorer.metisdevops.link",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;