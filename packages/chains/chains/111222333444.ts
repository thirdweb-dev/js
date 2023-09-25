import type { Chain } from "../src/types";
export default {
  "chainId": 111222333444,
  "chain": "Alphabet Network",
  "name": "Alphabet Mainnet",
  "rpc": [
    "https://alphabet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://londonpublic.alphabetnetwork.org",
    "wss://londonpublic.alphabetnetwork.org/ws/",
    "https://main-rpc.com",
    "wss://main-rpc.com/ws/"
  ],
  "slug": "alphabet",
  "icon": {
    "url": "ipfs://QmfTeudwVJcu7jzySBcpD9H5ZVK66nPJKRnicxend1bxfq",
    "width": 500,
    "height": 500,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ALT",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://alphabetnetwork.org",
  "shortName": "alphabet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Alphabet Explorer",
      "url": "https://scan.alphabetnetwork.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;