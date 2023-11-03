import type { Chain } from "../types";
export default {
  "chain": "Alphabet Network",
  "chainId": 111222333444,
  "explorers": [
    {
      "name": "Alphabet Explorer",
      "url": "https://scan.alphabetnetwork.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfTeudwVJcu7jzySBcpD9H5ZVK66nPJKRnicxend1bxfq",
    "width": 500,
    "height": 500,
    "format": "svg"
  },
  "infoURL": "https://alphabetnetwork.org",
  "name": "Alphabet Mainnet",
  "nativeCurrency": {
    "name": "ALT",
    "symbol": "ALT",
    "decimals": 18
  },
  "networkId": 111222333444,
  "rpc": [
    "https://alphabet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://111222333444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://londonpublic.alphabetnetwork.org",
    "wss://londonpublic.alphabetnetwork.org/ws/",
    "https://main-rpc.com",
    "wss://main-rpc.com/ws/"
  ],
  "shortName": "alphabet",
  "slug": "alphabet",
  "testnet": false
} as const satisfies Chain;