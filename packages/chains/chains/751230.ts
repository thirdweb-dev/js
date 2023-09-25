import type { Chain } from "../src/types";
export default {
  "chainId": 751230,
  "chain": "BRNKCTEST",
  "name": "Bear Network Chain Testnet",
  "rpc": [
    "https://bear-network-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-test.bearnetwork.net"
  ],
  "slug": "bear-network-chain-testnet",
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "faucets": [
    "https://faucet.bearnetwork.net"
  ],
  "nativeCurrency": {
    "name": "Bear Network Chain Testnet Token",
    "symbol": "tBRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "shortName": "BRNKCTEST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "brnktestscan",
      "url": "https://brnktest-scan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;