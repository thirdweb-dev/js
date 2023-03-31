import type { Chain } from "../src/types";
export default {
  "name": "Ontology Mainnet",
  "chain": "Ontology",
  "icon": {
    "url": "ipfs://bafkreigmvn6spvbiirtutowpq6jmetevbxoof5plzixjoerbeswy4htfb4",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://ontology.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://dappnode1.ont.io:20339",
    "http://dappnode2.ont.io:20339",
    "http://dappnode3.ont.io:20339",
    "http://dappnode4.ont.io:20339",
    "https://dappnode1.ont.io:10339",
    "https://dappnode2.ont.io:10339",
    "https://dappnode3.ont.io:10339",
    "https://dappnode4.ont.io:10339"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONG",
    "symbol": "ONG",
    "decimals": 18
  },
  "infoURL": "https://ont.io/",
  "shortName": "OntologyMainnet",
  "chainId": 58,
  "networkId": 58,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.ont.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ontology"
} as const satisfies Chain;