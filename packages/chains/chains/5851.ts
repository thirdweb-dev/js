import type { Chain } from "../src/types";
export default {
  "chain": "Ontology",
  "chainId": 5851,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.ont.io/testnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://developer.ont.io/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreigmvn6spvbiirtutowpq6jmetevbxoof5plzixjoerbeswy4htfb4",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://ont.io/",
  "name": "Ontology Testnet",
  "nativeCurrency": {
    "name": "ONG",
    "symbol": "ONG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ontology-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://polaris1.ont.io:20339",
    "http://polaris2.ont.io:20339",
    "http://polaris3.ont.io:20339",
    "http://polaris4.ont.io:20339",
    "https://polaris1.ont.io:10339",
    "https://polaris2.ont.io:10339",
    "https://polaris3.ont.io:10339",
    "https://polaris4.ont.io:10339"
  ],
  "shortName": "OntologyTestnet",
  "slug": "ontology-testnet",
  "testnet": true
} as const satisfies Chain;