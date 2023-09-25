import type { Chain } from "../src/types";
export default {
  "chainId": 5851,
  "chain": "Ontology",
  "name": "Ontology Testnet",
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
  "slug": "ontology-testnet",
  "icon": {
    "url": "ipfs://bafkreigmvn6spvbiirtutowpq6jmetevbxoof5plzixjoerbeswy4htfb4",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [
    "https://developer.ont.io/"
  ],
  "nativeCurrency": {
    "name": "ONG",
    "symbol": "ONG",
    "decimals": 18
  },
  "infoURL": "https://ont.io/",
  "shortName": "OntologyTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.ont.io/testnet",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;