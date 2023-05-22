import type { Chain } from "../src/types";
export default {
  "name": "Alphabet Mainnet",
  "chain": "Alphabet Network",
  "icon": {
    "url": "ipfs://QmfTeudwVJcu7jzySBcpD9H5ZVK66nPJKRnicxend1bxfq",
    "width": 500,
    "height": 500,
    "format": "svg"
  },
  "rpc": [
    "https://alphabet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://londonpublic.alphabetnetwork.org",
    "wss://londonpublic.alphabetnetwork.org/ws/",
    "https://main-rpc.com",
    "wss://main-rpc.com/ws/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ALT",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://alphabetnetwork.org",
  "shortName": "alphabet",
  "chainId": 111222333444,
  "networkId": 111222333444,
  "explorers": [
    {
      "name": "Alphabet Explorer",
      "url": "https://scan.alphabetnetwork.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "alphabet"
} as const satisfies Chain;